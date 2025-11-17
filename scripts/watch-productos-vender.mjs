#!/usr/bin/env node
import process from 'node:process';
import chokidar from 'chokidar';
import { importProductosVender, EXCEL_FULL_PATH } from './import-productos-vender.mjs';

const DEBOUNCE_MS = 2000;
let timeoutId = null;
let running = false;
let pendingReason = null;

const log = (message) => {
    console.info(`[${new Date().toISOString()}] ${message}`);
};

const scheduleImport = (reason) => {
    if (running) {
        pendingReason = reason;
        return;
    }
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(async () => {
        running = true;
        timeoutId = null;
        try {
            const total = await importProductosVender({ filePath: EXCEL_FULL_PATH, quiet: true });
            log(`Actualización (${reason}). Productos importados: ${total}.`);
        }
        catch (error) {
            console.error(`[${new Date().toISOString()}] Error actualizando productos (${reason})`, error);
        }
        finally {
            running = false;
            if (pendingReason) {
                const retryReason = pendingReason;
                pendingReason = null;
                scheduleImport(retryReason);
            }
        }
    }, DEBOUNCE_MS);
};

const watcher = chokidar.watch(EXCEL_FULL_PATH, {
    ignoreInitial: false,
    awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100,
    },
});

watcher.on('ready', () => {
    log(`Monitoreando cambios en ${EXCEL_FULL_PATH}`);
    scheduleImport('inicio');
});

watcher.on('change', () => scheduleImport('cambio en archivo'));
watcher.on('add', () => scheduleImport('archivo agregado'));

process.on('SIGINT', async () => {
    log('Deteniendo watcher de productos...');
    await watcher.close();
    process.exit(0);
});
