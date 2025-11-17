import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useCallback } from "react";
import Image from "next/image";

import Loading from "@/components/loading";
import { useUser } from "@/hooks/user";
import { ProductOrderAndItemsSchema } from "@/types/ProductOrderAndItems";
import { ProductOrderAndItems } from "@/types/ProductOrderAndItems";
import { ErrorResponse } from "@/types/ErrorResponse";
import { apiFetcher, apiFetcherSWR } from "@/lib/fetcher";
import { UpdateStatusOrderSchema } from "@/types/Order";
import { useLoadingContext } from "@/context/Loading";
import PapaBlancaImg from "@/images/PAPA-BLANCA.jpg";

const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
});

export default function PedidoProductos() {
    const router = useRouter();
    const { id } = router.query;
    const { isLoadingAccount } = useUser({ redirectAdminTo: "/mi-restaurante" });
    const { setLoadingModal } = useLoadingContext();

    const {
        data: order,
        isLoading,
        mutate,
    } = useSWR<ProductOrderAndItems, ErrorResponse>(
        () => (id ? `/product-orders/${id}` : null),
        apiFetcherSWR({ schema: ProductOrderAndItemsSchema }),
        {
            shouldRetryOnError: false,
        }
    );

    const handleCancel = useCallback(async () => {
        if (!id) return;
        setLoadingModal({ title: "Cancelando pedido..." });
        await apiFetcher<{ update: true }>(`/product-orders/${id}`, {
            method: "PUT",
            body: JSON.stringify(
                UpdateStatusOrderSchema.parse({ status: "canceled" })
            ),
        });
        await mutate();
        setLoadingModal(null);
        router.back();
    }, [id, mutate, router, setLoadingModal]);

    if (isLoadingAccount || isLoading)
        return (
            <>
                <Head>
                    <title>Canastas Verdes - Pedido</title>
                </Head>
                <main className="mt-10 mx-auto flex max-w-7xl items-center justify-center">
                    <Loading />
                </main>
            </>
        );

    if (!order)
        return (
            <main className="mt-10 text-center text-gray-500">
                No encontramos el pedido solicitado.
            </main>
        );

    return (
        <>
            <Head>
                <title>Canastas Verdes - Pedido</title>
            </Head>
            <main className="mx-auto mt-10 max-w-7xl px-6 lg:px-8">
                <div className="px-4 sm:px-0">
                    <h3 className="text-base font-semibold leading-7 text-gray-900">
                        Información del pedido
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                        Detalles de tus productos del catálogo
                    </p>
                </div>
                <div className="mt-6 border-t border-gray-100">
                    <dl className="divide-y divide-gray-100">
                        <InfoRow label="Nombre completo" value={order.name} />
                        <InfoRow label="Dirección" value={order.address} />
                        <InfoRow label="Teléfono" value={`+57 ${order.phone}`} />
                        <InfoRow
                            label="Estado"
                            value={
                                order.status === "pending"
                                    ? "Pendiente"
                                    : order.status === "preparing"
                                        ? "Preparando"
                                        : order.status === "completed"
                                            ? "Completado"
                                            : "Cancelado"
                            }
                        />
                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-sm font-medium leading-6 text-gray-900">
                                Productos
                            </dt>
                            <dd className="sm:col-span-2">
                                <ul className="-my-6 divide-y divide-gray-200">
                                    {order.products.map((item) => (
                                        <li key={item.id} className="flex py-6">
                                            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                <Image
                                                    src={PapaBlancaImg}
                                                    alt={item.productName}
                                                    fill
                                                    className="object-cover object-center"
                                                    sizes="96px"
                                                />
                                            </div>
                                            <div className="ml-4 flex flex-1 flex-col">
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <h3>{item.productName}</h3>
                                                    <p>{formatter.format(item.subtotal)}</p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {item.presentation} · Código {item.productCode}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Cantidad {item.quantity}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </dd>
                        </div>
                        <InfoRow label="Total" value={formatter.format(order.total)} />
                    </dl>
                </div>
                {order.status === "pending" && (
                    <div className="mt-6 flex justify-end">
                        <button
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                            onClick={handleCancel}
                        >
                            Cancelar pedido
                        </button>
                    </div>
                )}
            </main>
        </>
    );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
    return (
        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">{label}</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {value}
            </dd>
        </div>
    );
}
