import { Fragment, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/router";

import { useProductCart } from "@/context/ProductCart";
import { useNotificationContext } from "@/context/Notification";
import { useAuthContext } from "@/context/Auth";
import { Account } from "@/types/Account";
import PapaBlancaImg from "@/images/PAPA-BLANCA.jpg";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
});

export default function ProductCartDrawer() {
    const {
        isDrawerOpen,
        setDrawerOpen,
        items,
        incrementQuantity,
        decrementQuantity,
        removeProduct,
        total,
        setCheckoutOpen,
    } = useProductCart();
    const { setNotification } = useNotificationContext();
    const { account } = useAuthContext() as { account: Account | null };
    const router = useRouter();

    const handleCheckout = useCallback(() => {
        if (!account) {
            setNotification({
                title: "Inicia sesión para continuar",
                description:
                    "Debes iniciar sesión como usuario para completar tu pedido",
            });
            setDrawerOpen(false);
            router.push("/iniciar-sesion");
            return;
        }

        if (account.admin) {
            setNotification({
                title: "Cuenta administradora",
                description: "Inicia sesión como usuario para crear pedidos",
            });
            setDrawerOpen(false);
            return;
        }

        if (items.length === 0) return;

        setDrawerOpen(false);
        setCheckoutOpen(true);
    }, [
        account,
        items.length,
        router,
        setCheckoutOpen,
        setDrawerOpen,
        setNotification,
    ]);

    return (
        <Transition.Root show={isDrawerOpen} as={Fragment}>
            <Dialog as="div" className="relative z-40" onClose={setDrawerOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">
                                                    Tu carrito
                                                </Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                                        onClick={() => setDrawerOpen(false)}
                                                    >
                                                        <span className="sr-only">Cerrar panel</span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-8">
                                                {items.length === 0 ? (
                                                    <p className="text-sm text-gray-500">
                                                        Aún no agregas productos. Explora el catálogo y haz clic
                                                        en Agregar para empezar.
                                                    </p>
                                                ) : (
                                                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                        {items.map((item) => (
                                                            <li key={item.productId} className="flex py-6">
                                                                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                    <Image
                                                                        src={PapaBlancaImg}
                                                                        alt={item.name}
                                                                        className="object-cover object-center"
                                                                        sizes="96px"
                                                                        fill
                                                                    />
                                                                </div>

                                                                <div className="ml-4 flex flex-1 flex-col">
                                                                    <div>
                                                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                                                            <h3>{item.name}</h3>
                                                                            <p>
                                                                                {currencyFormatter.format(
                                                                                    item.unitPrice * item.quantity
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                        <p className="mt-1 text-sm text-gray-500">
                                                                            {item.presentacion}
                                                                        </p>
                                                                        <p className="text-xs text-gray-400">
                                                                            Código: {item.codigo}
                                                                        </p>
                                                                    </div>
                                                                    <div className="mt-2 flex items-center justify-between text-sm">
                                                                        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1">
                                                                            <button
                                                                                type="button"
                                                                                className="text-gray-500 hover:text-gray-700"
                                                                                onClick={() => decrementQuantity(item.productId)}
                                                                            >
                                                                                <MinusIcon className="h-4 w-4" />
                                                                            </button>
                                                                            <span className="text-gray-700">{item.quantity}</span>
                                                                            <button
                                                                                type="button"
                                                                                className="text-gray-500 hover:text-gray-700"
                                                                                onClick={() => incrementQuantity(item.productId)}
                                                                            >
                                                                                <PlusIcon className="h-4 w-4" />
                                                                            </button>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            className="flex items-center gap-1 text-red-500 hover:text-red-700"
                                                                            onClick={() => removeProduct(item.productId)}
                                                                        >
                                                                            <TrashIcon className="h-4 w-4" />
                                                                            Quitar
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <p>Subtotal</p>
                                                <p>{currencyFormatter.format(total)}</p>
                                            </div>
                                            <p className="mt-0.5 text-sm text-gray-500">
                                                Los costos de envío se coordinan directamente contigo.
                                            </p>
                                            <div className="mt-6">
                                                <button
                                                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                                                    onClick={handleCheckout}
                                                    disabled={items.length === 0}
                                                >
                                                    Realizar pedido
                                                </button>
                                            </div>
                                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                                <button
                                                    type="button"
                                                    className="font-medium text-green-600 hover:text-green-500"
                                                    onClick={() => setDrawerOpen(false)}
                                                >
                                                    Seguir comprando →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
