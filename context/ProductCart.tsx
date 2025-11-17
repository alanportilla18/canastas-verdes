import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

import { ProductoVender } from "@/types/ProductoVender";

export type ProductCartItem = {
    productId: number;
    name: string;
    codigo: string;
    municipio: string;
    categoria: string;
    presentacion: string;
    unitPrice: number;
    quantity: number;
};

type ProductCartContextValue = {
    items: ProductCartItem[];
    addProduct: (product: ProductoVender, quantity?: number) => void;
    incrementQuantity: (productId: number) => void;
    decrementQuantity: (productId: number) => void;
    removeProduct: (productId: number) => void;
    clear: () => void;
    total: number;
    isDrawerOpen: boolean;
    setDrawerOpen: Dispatch<SetStateAction<boolean>>;
    isCheckoutOpen: boolean;
    setCheckoutOpen: Dispatch<SetStateAction<boolean>>;
};

const ProductCartContext = createContext<ProductCartContextValue>({
    items: [],
    addProduct: () => { },
    incrementQuantity: () => { },
    decrementQuantity: () => { },
    removeProduct: () => { },
    clear: () => { },
    total: 0,
    isDrawerOpen: false,
    setDrawerOpen: () => { },
    isCheckoutOpen: false,
    setCheckoutOpen: () => { },
});

type ProductCartProviderProps = {
    children?: ReactNode;
};

export function ProductCartProvider({ children }: ProductCartProviderProps) {
    const [items, setItems] = useState<ProductCartItem[]>([]);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isCheckoutOpen, setCheckoutOpen] = useState(false);

    const addProduct = useCallback((product: ProductoVender, quantity = 1) => {
        if (quantity <= 0) return;
        setItems((prev) => {
            const existing = prev.find((item) => item.productId === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [
                ...prev,
                {
                    productId: product.id,
                    name: product.producto,
                    codigo: product.codigo,
                    municipio: product.municipio,
                    categoria: product.categoria,
                    presentacion: product.presentacion,
                    unitPrice: product.precioVenta,
                    quantity,
                },
            ];
        });
        setDrawerOpen(true);
    }, []);

    const incrementQuantity = useCallback((productId: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.productId === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    }, []);

    const decrementQuantity = useCallback((productId: number) => {
        setItems((prev) =>
            prev
                .map((item) =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    }, []);

    const removeProduct = useCallback((productId: number) => {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
    }, []);

    const clear = useCallback(() => {
        setItems([]);
    }, []);

    const total = useMemo(() => {
        return items.reduce(
            (acc, current) => acc + current.unitPrice * current.quantity,
            0
        );
    }, [items]);

    return (
        <ProductCartContext.Provider
            value={{
                items,
                addProduct,
                incrementQuantity,
                decrementQuantity,
                removeProduct,
                clear,
                total,
                isDrawerOpen,
                setDrawerOpen,
                isCheckoutOpen,
                setCheckoutOpen,
            }}
        >
            {children}
        </ProductCartContext.Provider>
    );
}

export function useProductCart() {
    return useContext(ProductCartContext);
}
