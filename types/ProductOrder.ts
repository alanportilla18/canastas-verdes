import { z } from "zod";

const baseStringField = {
    required_error: "Campo requerido",
    invalid_type_error: "Formato inválido",
};

export const ProductOrderSchema = z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    status: z.string(),
    accountId: z.string(),
    total: z.number(),
    createdAt: z.string().datetime().or(z.date()),
    updatedAt: z.string().datetime().or(z.date()),
    deletedAt: z.string().datetime().or(z.date()).nullable(),
});

export const ProductOrdersSchema = z.array(ProductOrderSchema);

const baseTextValidation = z
    .string(baseStringField)
    .min(3, { message: "Debe tener al menos 3 caracteres" })
    .max(120, { message: "Debe tener máximo 120 caracteres" })
    .nonempty({ message: "No puede estar vacío" });

export const CreateProductOrderSchema = z.object({
    name: baseTextValidation,
    address: z
        .string(baseStringField)
        .min(5, { message: "La dirección debe tener al menos 5 caracteres" })
        .max(200, { message: "La dirección debe tener máximo 200 caracteres" }),
    phone: z
        .string(baseStringField)
        .length(10, { message: "El teléfono debe tener 10 dígitos" })
        .regex(/^[0-9]*$/, {
            message: "El teléfono debe ser numérico",
        }),
    items: z
        .array(
            z.object({
                productId: z.number({
                    required_error: "El id del producto es requerido",
                }),
                quantity: z
                    .number({
                        required_error: "La cantidad es requerida",
                    })
                    .int({ message: "La cantidad debe ser un entero" })
                    .positive({ message: "La cantidad debe ser positiva" }),
            })
        )
        .min(1, { message: "Debes incluir al menos un producto" }),
});

export type ProductOrder = z.infer<typeof ProductOrderSchema>;
export type ProductOrders = z.infer<typeof ProductOrdersSchema>;
export type CreateProductOrder = z.infer<typeof CreateProductOrderSchema>;
