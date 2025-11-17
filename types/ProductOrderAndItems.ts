import { z } from "zod";

import { ProductOrderSchema } from "@/types/ProductOrder";
import { ProductsInProductOrdersSchema } from "@/types/ProductsInProductOrder";

export const ProductOrderAndItemsSchema = ProductOrderSchema.extend({
    products: ProductsInProductOrdersSchema,
});

export type ProductOrderAndItems = z.infer<
    typeof ProductOrderAndItemsSchema
>;
