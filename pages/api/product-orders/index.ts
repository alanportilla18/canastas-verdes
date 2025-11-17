import type { NextApiRequest, NextApiResponse } from "next";
import createHttpError from "http-errors";

import { apiHandler, withAuth } from "@/lib/api";
import { prisma } from "@/lib/db";
import { ErrorResponse } from "@/types/ErrorResponse";
import {
    CreateProductOrderSchema,
    ProductOrder,
    ProductOrderSchema,
} from "@/types/ProductOrder";
import { Account } from "@/types/Account";

async function createProductOrder(
    req: NextApiRequest,
    res: NextApiResponse<ProductOrder | ErrorResponse>
) {
    const account = JSON.parse(req.headers.account as string) as Account;

    const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body ?? {};
    const payload = CreateProductOrderSchema.parse(body);

    const productIds = Array.from(
        new Set(payload.items.map((item) => item.productId))
    );

    const products = await prisma.productosVender.findMany({
        where: {
            id: {
                in: productIds,
            },
        },
    });

    if (products.length !== productIds.length) {
        throw new createHttpError.BadRequest(
            "Algunos productos no están disponibles"
        );
    }

    const productsMap = new Map(products.map((product) => [product.id, product]));

    const itemsPayload = payload.items.map((item) => {
        const product = productsMap.get(item.productId);
        if (!product)
            throw new createHttpError.BadRequest(
                "No pudimos encontrar uno de los productos seleccionados"
            );
        const unitPrice = product.precioVenta;
        return {
            productId: product.id,
            productName: product.producto,
            productCode: product.codigo,
            presentation: product.presentacion,
            unitPrice,
            quantity: item.quantity,
            subtotal: unitPrice * item.quantity,
        };
    });

    const total = itemsPayload.reduce((acc, item) => acc + item.subtotal, 0);

    const order = await prisma.productOrder.create({
        data: {
            name: payload.name,
            address: payload.address,
            phone: payload.phone,
            accountId: account.id,
            total,
            products: {
                create: itemsPayload,
            },
        },
    });

    res.status(201).json(ProductOrderSchema.parse(order));
}

export default apiHandler({
    POST: withAuth(createProductOrder),
});
