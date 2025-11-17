import type { NextApiRequest, NextApiResponse } from "next";

import { apiHandler, withAuth } from "@/lib/api";
import { prisma } from "@/lib/db";
import { ProductOrder, ProductOrdersSchema } from "@/types/ProductOrder";
import { ErrorResponse } from "@/types/ErrorResponse";
import { Account } from "@/types/Account";

async function getMyProductOrders(
    req: NextApiRequest,
    res: NextApiResponse<ProductOrder[] | ErrorResponse>
) {
    const account = JSON.parse(req.headers.account as string) as Account;

    const orders = await prisma.productOrder.findMany({
        where: {
            accountId: account.id,
            deletedAt: null,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    res.status(200).json(ProductOrdersSchema.parse(orders));
}

export default apiHandler({
    GET: withAuth(getMyProductOrders),
});
