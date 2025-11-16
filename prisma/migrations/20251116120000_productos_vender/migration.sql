-- CreateTable
CREATE TABLE "productos_vender" (
    "id" SERIAL PRIMARY KEY,
    "itemNumber" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "producto" TEXT NOT NULL,
    "presentacion" TEXT NOT NULL,
    "costoPcc" DOUBLE PRECISION NOT NULL,
    "porcentajeLogistica" DOUBLE PRECISION NOT NULL,
    "porcentajeTransporte" DOUBLE PRECISION NOT NULL,
    "precioSugerido" DOUBLE PRECISION NOT NULL,
    "precioVenta" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "productos_vender_codigo_key" ON "productos_vender" ("codigo");
