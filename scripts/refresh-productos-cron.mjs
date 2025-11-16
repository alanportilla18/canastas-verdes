#!/usr/bin/env node
import process from 'node:process';
import cron from 'node-cron';
import { importProductosVender } from './import-productos-vender.mjs';

const DEFAULT_CRON = '0 3 * * *'; // Ejecución diaria a las 3:00 AM
const expression = process.env.PRODUCTOS_CRON_EXPRESSION ?? DEFAULT_CRON;
let running = false;
let rerun = false;

const runImport = async (source) => {
    if (running) {
        rerun = true;
        console.info(`[${new Date().toISOString()}] Ejecución en curso. Se reagendará tras finalizar.`);
        return;
    }

    running = true;
    try {
        const total = await importProductosVender();
        console.info(`[${new Date().toISOString()}] Refresco (${source}) completado: ${total} productos.`);
    }
    catch (error) {
        console.error(`[${new Date().toISOString()}] Error refrescando (${source}):`, error);
    }
    finally {
        running = false;
        if (rerun) {
            rerun = false;
            runImport('pendiente');
        }
    }
};

console.info(`Cron de productos iniciado con expresión "${expression}".`);
runImport('inicio');

cron.schedule(expression, () => runImport('cron'));

process.on('SIGINT', () => {
    console.info('Cron detenido por señal SIGINT.');
    process.exit(0);
});
