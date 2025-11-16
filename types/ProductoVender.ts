import { z } from "zod";

export const ProductoVenderSchema = z.object({
    id: z.number(),
    itemNumber: z.number(),
    codigo: z.string(),
    municipio: z.string(),
    categoria: z.string(),
    producto: z.string(),
    presentacion: z.string(),
    costoPcc: z.number(),
    porcentajeLogistica: z.number(),
    porcentajeTransporte: z.number(),
    precioSugerido: z.number(),
    precioVenta: z.number(),
    createdAt: z.string().datetime().or(z.date()),
    updatedAt: z.string().datetime().or(z.date()),
});

export type ProductoVender = z.infer<typeof ProductoVenderSchema>;
