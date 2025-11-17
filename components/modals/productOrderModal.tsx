import { FormEvent, Fragment, useCallback, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { useProductCart } from "@/context/ProductCart";
import { useAuthContext } from "@/context/Auth";
import { Account } from "@/types/Account";
import {
    CreateProductOrderSchema,
    ProductOrder,
    ProductOrderSchema,
} from "@/types/ProductOrder";
import { useNotificationContext } from "@/context/Notification";
import { useLoadingContext } from "@/context/Loading";
import { useErrorContext } from "@/context/Error";
import { handleErrorModal } from "@/lib/error";
import { apiFetcher } from "@/lib/fetcher";

const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
});

export default function ProductOrderModal() {
    const {
        isCheckoutOpen,
        setCheckoutOpen,
        items,
        clear,
        total,
    } = useProductCart();
    const { account } = useAuthContext() as { account: Account | null };
    const { setNotification } = useNotificationContext();
    const { setLoadingModal } = useLoadingContext();
    const { setErrorModal } = useErrorContext();

    const [form, setForm] = useState({
        name: account?.name ?? "",
        address: account?.address ?? "",
        phone: account?.phone ?? "",
    });

    useEffect(() => {
        if (!isCheckoutOpen) return;
        setForm({
            name: account?.name ?? "",
            address: account?.address ?? "",
            phone: account?.phone ?? "",
        });
    }, [account, isCheckoutOpen]);

    const handleSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!account) return;
            setLoadingModal({ title: "Procesando pedido..." });
            try {
                const payload = CreateProductOrderSchema.parse({
                    ...form,
                    items: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                });

                await apiFetcher<ProductOrder>("/product-orders", {
                    method: "POST",
                    body: JSON.stringify(payload),
                    schema: ProductOrderSchema,
                });

                setNotification({
                    title: "Pedido registrado",
                    description: "Te avisaremos cuando sea confirmado",
                });
                clear();
                setCheckoutOpen(false);
            } catch (error) {
                handleErrorModal(error, setErrorModal);
            } finally {
                setLoadingModal(null);
            }
        },
        [
            account,
            clear,
            form,
            items,
            setCheckoutOpen,
            setErrorModal,
            setLoadingModal,
            setNotification,
        ]
    );

    return (
        <Transition.Root show={isCheckoutOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setCheckoutOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
                                <form onSubmit={handleSubmit}>
                                    <div className="grid gap-6 p-6 lg:grid-cols-2">
                                        <div>
                                            <Dialog.Title className="text-lg font-semibold text-gray-900">
                                                Información de entrega
                                            </Dialog.Title>
                                            <div className="mt-6 space-y-4">
                                                <label className="flex flex-col text-sm">
                                                    Nombre completo
                                                    <input
                                                        type="text"
                                                        className="mt-1 rounded-md border border-gray-300 px-3 py-2"
                                                        required
                                                        value={form.name}
                                                        onChange={(event) =>
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                name: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </label>
                                                <label className="flex flex-col text-sm">
                                                    Dirección
                                                    <input
                                                        type="text"
                                                        className="mt-1 rounded-md border border-gray-300 px-3 py-2"
                                                        required
                                                        value={form.address}
                                                        onChange={(event) =>
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                address: event.target.value,
                                                            }))
                                                        }
                                                    />
                                                </label>
                                                <label className="flex flex-col text-sm">
                                                    Teléfono de contacto
                                                    <div className="mt-1 flex rounded-md border border-gray-300">
                                                        <span className="flex items-center rounded-l-md bg-gray-100 px-3 text-gray-500">
                                                            +57
                                                        </span>
                                                        <input
                                                            type="text"
                                                            className="w-full rounded-r-md border-0 px-3 py-2 focus:outline-none"
                                                            required
                                                            maxLength={10}
                                                            value={form.phone}
                                                            onChange={(event) =>
                                                                setForm((prev) => ({
                                                                    ...prev,
                                                                    phone: event.target.value,
                                                                }))
                                                            }
                                                        />
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <Dialog.Title className="text-lg font-semibold text-gray-900">
                                                Resumen
                                            </Dialog.Title>
                                            <div className="mt-6 space-y-4 rounded-md border border-gray-200 bg-gray-50 p-4">
                                                {items.length === 0 && (
                                                    <p className="text-sm text-gray-500">
                                                        Aún no tienes productos en el carrito.
                                                    </p>
                                                )}
                                                {items.map((item) => (
                                                    <div
                                                        key={item.productId}
                                                        className="flex items-center justify-between border-b border-gray-200 pb-3 text-sm last:border-0 last:pb-0"
                                                    >
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {item.presentacion} · Cantidad {item.quantity}
                                                            </p>
                                                        </div>
                                                        <p className="font-semibold text-gray-900">
                                                            {formatter.format(item.unitPrice * item.quantity)}
                                                        </p>
                                                    </div>
                                                ))}
                                                <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                                                    <span>Total</span>
                                                    <span>{formatter.format(total)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
                                        <button
                                            type="button"
                                            className="rounded-md px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
                                            onClick={() => setCheckoutOpen(false)}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                            disabled={items.length === 0}
                                        >
                                            Confirmar pedido
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
