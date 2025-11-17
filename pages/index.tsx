import Head from "next/head";
import Image from "next/image";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { MinusSmallIcon } from "@heroicons/react/24/outline";

import { useNoAdmin } from "@/hooks/noAdmin";
import Loading from "@/components/loading";
import { apiFetcherSWR } from "@/lib/fetcher";
import { Restaurant, RestaurantsSchema } from "@/types/Restaurant";
import { ErrorResponse } from "@/types/ErrorResponse";
import { AccountAndFavorites } from "@/types/AccountAndFavorites";
import { prisma } from "@/lib/db";
import { ProductoVender } from "@/types/ProductoVender";
import PapaBlancaImg from "@/images/PAPA-BLANCA.jpg";

export default function Home({
  productos,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { isLoadingAccount, account } = useNoAdmin({
    redirectTo: "/mi-restaurante",
  });

  const { data: restaurants, isLoading: isLoadingRestaurants } = useSWR<
    Restaurant[],
    ErrorResponse
  >("/restaurants", apiFetcherSWR({ schema: RestaurantsSchema }), {
    shouldRetryOnError: false,
  });

  if (isLoadingAccount || isLoadingRestaurants)
    return (
      <>
        <Head>
          <title> Canastas Verdes - Inicio</title>
        </Head>
        <main className="mt-10 mx-auto flex max-w-7xl items-center justify-center">
          <Loading />
        </main>
      </>
    );

  return (
    <>
      <Head>
        <title> Canastas Verdes - Inicio </title>
      </Head>
      <main className="mt-10 mx-auto max-w-7xl">
        <Restaurants restaurants={restaurants} />
        <Restaurants
          restaurants={restaurants?.filter(
            (restaurant) => restaurant.isOnOffer
          )}
          title="Fincas con productos en oferta"
        />

        <FavoritesRestaurants account={account} />
        <ProductsSection productos={productos} />
      </main>
    </>
  );
}

type ProductsSectionProps = {
  productos: ProductoVender[];
};

function ProductsSection({ productos }: ProductsSectionProps) {
  const [search, setSearch] = useState("");
  const [municipio, setMunicipio] = useState<string>("todos");
  const [categoria, setCategoria] = useState<string>("todos");
  const [precioMin, setPrecioMin] = useState<string>("");
  const [precioMax, setPrecioMax] = useState<string>("");

  const municipios = useMemo(
    () =>
      Array.from(
        new Set(productos.map((p) => p.municipio).filter(Boolean))
      ).sort(),
    [productos]
  );

  const categorias = useMemo(
    () =>
      Array.from(
        new Set(productos.map((p) => p.categoria).filter(Boolean))
      ).sort(),
    [productos]
  );

  const filteredProductos = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const min = Number(precioMin);
    const max = Number(precioMax);
    return productos.filter((producto) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        producto.producto.toLowerCase().includes(normalizedSearch) ||
        producto.codigo.toLowerCase().includes(normalizedSearch);
      const matchesMunicipio =
        municipio === "todos" || producto.municipio === municipio;
      const matchesCategoria =
        categoria === "todos" || producto.categoria === categoria;
      const matchesMin = Number.isNaN(min) || min <= 0 || producto.precioVenta >= min;
      const matchesMax = Number.isNaN(max) || max <= 0 || producto.precioVenta <= max;

      return (
        matchesSearch &&
        matchesMunicipio &&
        matchesCategoria &&
        matchesMin &&
        matchesMax
      );
    });
  }, [productos, search, municipio, categoria, precioMin, precioMax]);

  return (
    <section className="mb-16 px-4">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-wide text-primary-600 font-semibold">
            Catálogo de productos
          </p>
          <h2 className="text-3xl font-bold text-gray-900">
            Disponibles para tu canasta
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Mostrando {filteredProductos.length} de {productos.length} productos
          </p>
        </div>
        <ProductsFilters
          search={search}
          onSearchChange={setSearch}
          municipios={municipios}
          municipio={municipio}
          onMunicipioChange={setMunicipio}
          categorias={categorias}
          categoria={categoria}
          onCategoriaChange={setCategoria}
          precioMin={precioMin}
          precioMax={precioMax}
          onPrecioMinChange={setPrecioMin}
          onPrecioMaxChange={setPrecioMax}
        />
      </div>
      <ProductsGrid productos={filteredProductos} />
      {filteredProductos.length === 0 && (
        <p className="mt-6 text-center text-gray-500">
          No encontramos productos que coincidan con tu búsqueda. Intenta con otros filtros.
        </p>
      )}
    </section>
  );
}

type ProductsFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  municipio: string;
  onMunicipioChange: (value: string) => void;
  municipios: string[];
  categoria: string;
  onCategoriaChange: (value: string) => void;
  categorias: string[];
  precioMin: string;
  precioMax: string;
  onPrecioMinChange: (value: string) => void;
  onPrecioMaxChange: (value: string) => void;
};

function ProductsFilters({
  search,
  onSearchChange,
  municipio,
  onMunicipioChange,
  municipios,
  categoria,
  onCategoriaChange,
  categorias,
  precioMin,
  precioMax,
  onPrecioMinChange,
  onPrecioMaxChange,
}: ProductsFiltersProps) {
  return (
    <div className="grid w-full gap-4 lg:max-w-4xl lg:grid-cols-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">
          Buscar
        </label>
        <input
          type="text"
          name="search"
          placeholder="Nombre o código del producto"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">
          Municipio
        </label>
        <select
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          value={municipio}
          onChange={(event) => onMunicipioChange(event.target.value)}
        >
          <option value="todos">Todos</option>
          {municipios.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">
          Categoría
        </label>
        <select
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          value={categoria}
          onChange={(event) => onCategoriaChange(event.target.value)}
        >
          <option value="todos">Todas</option>
          {categorias.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Precio mínimo (COP)
        </label>
        <input
          type="number"
          min={0}
          step={100}
          placeholder="0"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          value={precioMin}
          onChange={(event) => onPrecioMinChange(event.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Precio máximo (COP)
        </label>
        <input
          type="number"
          min={0}
          step={100}
          placeholder="50000"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          value={precioMax}
          onChange={(event) => onPrecioMaxChange(event.target.value)}
        />
      </div>
    </div>
  );
}

type ProductosGridProps = {
  productos: ProductoVender[];
};

function ProductsGrid({ productos }: ProductosGridProps) {
  if (!productos || productos.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {productos.map((producto) => (
        <article
          key={producto.id}
          className="rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-gray-50">
            <Image
              src={PapaBlancaImg}
              alt={producto.producto}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="p-4 space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {producto.producto}
            </h3>
            <p className="text-2xl font-bold text-primary-600">
              {formatCurrency(producto.precioVenta)}
            </p>
            <dl className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <dt className="font-medium">Municipio:</dt>
                <dd>{producto.municipio}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Presentación:</dt>
                <dd>{producto.presentacion}</dd>
              </div>
            </dl>
          </div>
        </article>
      ))}
    </div>
  );
}

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

type ProductoVenderRecord = Awaited<
  ReturnType<typeof prisma.productosVender.findMany>
>[number];

const serializeProducto = (
  producto: ProductoVenderRecord
): ProductoVender => ({
  ...producto,
  createdAt:
    producto.createdAt instanceof Date
      ? producto.createdAt.toISOString()
      : producto.createdAt,
  updatedAt:
    producto.updatedAt instanceof Date
      ? producto.updatedAt.toISOString()
      : producto.updatedAt,
});

function Restaurants({
  restaurants,
  title = "Fincas",
}: {
  restaurants: Restaurant[] | undefined;
  title?: string;
}) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide
      ? (restaurants?.length || 0) - 1
      : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, restaurants?.length]);

  const nextSlide = useCallback(() => {
    const isLastSlide = currentIndex === (restaurants?.length || 0) - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, restaurants?.length]);

  const goToSlide = useCallback((slideIndex: number) => {
    setCurrentIndex(slideIndex);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <>
      {restaurants && restaurants.length > 0 && (
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800 ml-10">{title}</h1>
          <div className="max-w-[1400px] h-[780px] w-full m-auto py-16 px-10 relative group border-b border-gray-200 mb-10">
            <div
              style={{
                backgroundImage: `url(${restaurants[currentIndex].image})`,
              }}
              className="w-full h-full rounded-2xl bg-center bg-cover duration-500 ease-in-out transition-all hover:scale-105 cursor-pointer"
              onClick={() => {
                router.push(`/restaurantes/${restaurants[currentIndex].slug}`);
              }}
            ></div>
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
              <ChevronLeftIcon className="w-6 h-6" onClick={prevSlide} />
            </div>
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
              <ChevronRightIcon className="w-6 h-6" onClick={nextSlide} />
            </div>
            <div className="flex top-4 justify-center py-2">
              {restaurants.map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  onClick={() => goToSlide(slideIndex)}
                  className="text-2xl cursor-pointer"
                >
                  <MinusSmallIcon
                    className={`w-8 h-8 text-gray-400 ${currentIndex === slideIndex ? "text-gray-800" : ""
                      }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FavoritesRestaurants({
  account,
}: {
  account: AccountAndFavorites | undefined;
}) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide
      ? (account?.FavoriteRestaurant.length || 0) - 1
      : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [account?.FavoriteRestaurant.length, currentIndex]);

  const nextSlide = useCallback(() => {
    const isLastSlide =
      currentIndex === (account?.FavoriteRestaurant.length || 0) - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [account?.FavoriteRestaurant.length, currentIndex]);

  const goToSlide = useCallback((slideIndex: number) => {
    setCurrentIndex(slideIndex);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <>
      {account && account.FavoriteRestaurant.length > 0 && (
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800 ml-10">
            Tus restaurantes favoritos
          </h1>
          <div className="max-w-[1400px] h-[780px] w-full m-auto py-16 px-10 relative group">
            <div
              style={{
                backgroundImage: `url(${account.FavoriteRestaurant[currentIndex].restaurant.image})`,
              }}
              className="w-full h-full rounded-2xl bg-center bg-cover duration-500 ease-in-out transition-all hover:scale-105 cursor-pointer"
              onClick={() => {
                router.push(
                  `/restaurantes/${account.FavoriteRestaurant[currentIndex].restaurant.slug}`
                );
              }}
            ></div>
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
              <ChevronLeftIcon className="w-6 h-6" onClick={prevSlide} />
            </div>
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
              <ChevronRightIcon className="w-6 h-6" onClick={nextSlide} />
            </div>
            <div className="flex top-4 justify-center py-2">
              {account.FavoriteRestaurant.map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  onClick={() => goToSlide(slideIndex)}
                  className="text-2xl cursor-pointer"
                >
                  <MinusSmallIcon
                    className={`w-8 h-8 text-gray-400 ${currentIndex === slideIndex ? "text-gray-800" : ""
                      }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  productos: ProductoVender[];
}> = async () => {
  const productosDb = await prisma.productosVender.findMany({
    orderBy: {
      producto: "asc",
    },
  });

  return {
    props: {
      productos: productosDb.map(serializeProducto),
    },
  };
};
