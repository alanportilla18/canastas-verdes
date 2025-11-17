import type { NextApiRequest, NextApiResponse } from "next";
import createHttpError from "http-errors";

import { apiHandler, withAuth } from "@/lib/api";
import { prisma } from "@/lib/db";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";
import { ProductOrderAndItems } from "@/types/ProductOrderAndItems";
import { ProductOrderAndItemsSchema } from "@/types/ProductOrderAndItems";
import { UpdateStatusOrderSchema } from "@/types/Order";

async function getProductOrder(
    req: NextApiRequest,
    res: NextApiResponse<ProductOrderAndItems | ErrorResponse>
) {
    const account = JSON.parse(req.headers.account as string) as Account;
    const { id } = req.query;

    const order = await prisma.productOrder.findFirst({
        where: {
            id: id as string,
            accountId: account.id,
        },
        include: {
            products: true,
        },
    });

    if (!order) {
        throw new createHttpError.NotFound("No encontramos este pedido");
    }

    res.status(200).json(ProductOrderAndItemsSchema.parse(order));
}

async function updateProductOrder(
    req: NextApiRequest,
    res: NextApiResponse<{ update: true } | ErrorResponse>
) {
    const account = JSON.parse(req.headers.account as string) as Account;
    const { id } = req.query;

    const payload = UpdateStatusOrderSchema.parse(
        typeof req.body === "string" ? JSON.parse(req.body) : req.body
    );

    const updated = await prisma.productOrder.updateMany({
        where: {
            id: id as string,
            accountId: account.id,
        },
        data: {
            status: payload.status,
            deletedAt: payload.status === "canceled" ? new Date() : null,
        },
    });

    if (updated.count === 0) {
        throw new createHttpError.NotFound("No encontramos este pedido");
    }

    res.status(200).json({ update: true });
}

export default apiHandler({
    GET: withAuth(getProductOrder),
    PUT: withAuth(updateProductOrder),
});
