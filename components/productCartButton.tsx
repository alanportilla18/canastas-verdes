import { ShoppingCartIcon } from "@heroicons/react/24/solid";

import { useProductCart } from "@/context/ProductCart";
import { useAuthContext } from "@/context/Auth";
import { Account } from "@/types/Account";

export default function ProductCartButton() {
    const { items, setDrawerOpen } = useProductCart();
    const { account } = useAuthContext() as { account: Account | null };

    if (!account || account.admin) return null;

    const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <button
            className="fixed bottom-4 left-4 z-20 flex items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-white shadow-lg transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            onClick={() => setDrawerOpen(true)}
            disabled={itemsCount === 0}
        >
            <ShoppingCartIcon className="h-6 w-6" />
            <span className="text-sm font-semibold">
                {itemsCount === 0 ? "Carrito" : `${itemsCount} producto${itemsCount > 1 ? "s" : ""}`}
            </span>
        </button>
    );
}
