'use strict';

const fs = require('fs-extra');
const path = require('path');

async function importExportedData() {
  const shouldImportData = await isFirstRun();

  if (shouldImportData) {
    try {
      console.log('Importando datos exportados a PostgreSQL...');
      const dataPath = path.join(__dirname, '..', 'data', 'exported-data.json');

      if (!(await fs.pathExists(dataPath))) {
        console.log('No se encontró archivo de datos exportados. Omitiendo importación.');
        return;
      }

      const exportedData = await fs.readJson(dataPath);
      let totalImported = 0;

      // Importar cada tipo de contenido
      for (const [contentType, entries] of Object.entries(exportedData)) {
        try {
          if (Array.isArray(entries) && entries.length > 0) {
            console.log(`Importando ${contentType}...`);
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

                await strapi.documents(`api::${contentType}.${contentType}`).create({
                  data: cleanedEntry,
                });
                imported++;
              } catch (entryError) {
                console.error(`  Error importando registro en ${contentType}:`, entryError.message);
              }
            }

            console.log(`  ✓ ${imported}/${entries.length} registros importados`);
            totalImported += imported;
          }
        } catch (error) {
          console.error(`Error procesando ${contentType}:`, error.message);
        }
      }

      console.log(`\n✓ Importación completada. Total: ${totalImported} registros`);
    } catch (error) {
      console.log('Error durante la importación de datos');
      console.error(error);
    }
  } else {
    console.log(
      'Los datos ya han sido importados. Limpia la base de datos si deseas reimportar.'
    );
  }
}

async function isFirstRun() {
  try {
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'type',
      name: 'setup',
    });
    const hasRun = await pluginStore.get({ key: 'dataImportHasRun' });
    await pluginStore.set({ key: 'dataImportHasRun', value: true });
    return !hasRun;
  } catch (error) {
    console.error('Error checking first run:', error);
    return true; // En caso de error, intenta importar
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  await importExportedData();
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
