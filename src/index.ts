import type { Core } from '@strapi/strapi';
const fs = require('fs-extra');
const path = require('path');

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Importar datos exportados en el primer arranque
    await importExportedDataOnBootstrap(strapi);
  },
};

async function importExportedDataOnBootstrap(strapi: Core.Strapi) {
  try {
    const shouldImportData = await isFirstRun(strapi);

    if (shouldImportData) {
      console.log('📦 Importando datos exportados...');
      const dataPath = path.join(__dirname, '..', 'data', 'exported-data.json');

      if (!(await fs.pathExists(dataPath))) {
        console.log('ℹ️  No se encontró archivo de datos exportados. Omitiendo importación.');
        return;
      }

      const exportedData = await fs.readJson(dataPath);
      let totalImported = 0;

      // Importar cada tipo de contenido
      for (const [contentType, entries] of Object.entries(exportedData)) {
        try {
          if (Array.isArray(entries) && entries.length > 0) {
            console.log(`  Importando ${contentType}...`);
            let imported = 0;

            for (const entry of entries) {
              try {
                // Crear una copia limpia del entry
                const cleanedEntry = { ...entry };

                // Eliminar campos internos de Strapi que se regeneran
                delete cleanedEntry.id;
                delete cleanedEntry.createdAt;
                delete cleanedEntry.updatedAt;
                delete cleanedEntry.publishedAt;

                const uid = `api::${contentType}.${contentType}`;
                await strapi.db.query(uid).create({
                  data: cleanedEntry,
                });
                imported++;
              } catch (entryError: any) {
                if (process.env.NODE_ENV === 'development') {
                  console.error(
                    `    ✗ Error importando registro en ${contentType}:`,
                    entryError.message
                  );
                }
              }
            }

            if (imported > 0) {
              console.log(`  ✓ ${imported}/${entries.length} registros de ${contentType} importados`);
              totalImported += imported;
            }
          }
        } catch (error: any) {
          console.error(`  Error procesando ${contentType}:`, error.message);
        }
      }

      if (totalImported > 0) {
        console.log(`✓ Importación completada. Total: ${totalImported} registros\n`);
      }
    }
  } catch (error) {
    console.error('Error durante la importación de datos en bootstrap:', error);
  }
}

async function isFirstRun(strapi: Core.Strapi) {
  try {
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'type',
      name: 'setup',
    });
    const hasRun = await pluginStore.get({ key: 'dataExportedImportHasRun' });
    await pluginStore.set({ key: 'dataExportedImportHasRun', value: true });
    return !hasRun;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error checking first run:', error);
    }
    return false; // Si hay error, no intenta importar
  }
}
