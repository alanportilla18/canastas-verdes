import { z } from "zod";

export const ProductsInProductOrderSchema = z.object({
    id: z.string(),
    productOrderId: z.string(),
    productId: z.number(),
    productName: z.string(),
    productCode: z.string(),
    presentation: z.string(),
    unitPrice: z.number(),
    quantity: z.number(),
    subtotal: z.number(),
    createdAt: z.string().datetime().or(z.date()),
    updatedAt: z.string().datetime().or(z.date()),
});

export const ProductsInProductOrdersSchema = z.array(
    ProductsInProductOrderSchema
);

export type ProductsInProductOrder = z.infer<
    typeof ProductsInProductOrderSchema
>;
