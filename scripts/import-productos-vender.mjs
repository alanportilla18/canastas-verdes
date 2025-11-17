#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';

export const EXCEL_BASENAME = 'bD_canastasVerdes.xlsx';
export const EXCEL_FULL_PATH = path.join(process.cwd(), EXCEL_BASENAME);
const COLUMNS = {
    item: 'Ítems',
    code: 'Código',
    city: 'Municipio',
    category: 'Categoría',
    product: 'Producto',
    presentation: 'Presentación',
    cost: 'Costo Pcc',
    logistics: '% Logística',
    transport: '%Transporte',
    suggested: 'Precio Sugerido',
    sale: 'Precio de Venta'
};

const sanitizeNumber = (value) => {
    if (value === null || value === undefined || value === '') {
        return 0;
    }
    if (typeof value === 'number') {
        return value;
    }
    const cleaned = String(value).replace(/[^0-9.-]/g, '');
    const parsed = Number(cleaned);
    if (Number.isNaN(parsed)) {
        throw new Error(`No se pudo convertir "${value}" a número.`);
    }
    return parsed;
};

const sanitizeText = (value) => {
    if (value === null || value === undefined) {
        return '';
    }
    return String(value).trim();
};

export async function importProductosVender({ filePath = EXCEL_FULL_PATH, quiet = false } = {}) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`No se encontró el archivo ${EXCEL_BASENAME} en ${process.cwd()}`);
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

    const mappedRows = rows
        .map((row, index) => {
            const codigo = sanitizeText(row[COLUMNS.code]);
            return {
                itemNumber: row[COLUMNS.item] ? Number(row[COLUMNS.item]) : index + 1,
                codigo,
                municipio: sanitizeText(row[COLUMNS.city]),
                categoria: sanitizeText(row[COLUMNS.category]),
                producto: sanitizeText(row[COLUMNS.product]),
                presentacion: sanitizeText(row[COLUMNS.presentation]),
                costoPcc: sanitizeNumber(row[COLUMNS.cost]),
                porcentajeLogistica: sanitizeNumber(row[COLUMNS.logistics]),
                porcentajeTransporte: sanitizeNumber(row[COLUMNS.transport] ?? row['% Transporte']),
                precioSugerido: sanitizeNumber(row[COLUMNS.suggested]),
                precioVenta: sanitizeNumber(row[COLUMNS.sale])
            };
        })
        .filter((row) => row.codigo.length > 0);

    if (mappedRows.length === 0) {
        if (!quiet) {
            console.warn('No se encontraron filas con datos válidos en el Excel.');
        }
        return 0;
    }

    const prisma = new PrismaClient();
    try {
        if (!quiet) {
            console.info(`Importando ${mappedRows.length} productos desde ${EXCEL_BASENAME}...`);
        }
        await prisma.productosVender.deleteMany();
        await prisma.productosVender.createMany({ data: mappedRows });
        if (!quiet) {
            console.info('Datos importados correctamente.');
        }
    }
    finally {
        await prisma.$disconnect();
    }

    return mappedRows.length;
}

const isDirectRun = process.argv[1]
    ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
    : false;

if (isDirectRun) {
    importProductosVender()
        .catch((error) => {
            console.error('Error importando productos:', error);
            process.exitCode = 1;
        });
}
