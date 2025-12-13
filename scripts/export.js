'use strict';

const fs = require('fs-extra');
const path = require('path');

async function exportData() {
  try {
    console.log('Iniciando exportación de datos desde PostgreSQL...');

    // Obtener todos los tipos de contenido disponibles
    const contentTypes = [
      'about',
      'category',
      'company',
      'global',
      'home-page',
      'location-page',
      'product',
      'product-page',
      'testimonial',
      'testimonial-page',
    ];

    const exportedData = {};

    for (const contentType of contentTypes) {
      try {
        console.log(`Exportando ${contentType}...`);
        const uid = `api::${contentType}.${contentType}`;
        const entries = await strapi.db.query(uid).findMany({
          populate: true,
        });
        
        if (entries && entries.length > 0) {
          exportedData[contentType] = entries;
          console.log(`  ✓ ${entries.length} registros exportados`);
        } else {
          console.log(`  - Sin registros para exportar`);
          exportedData[contentType] = [];
        }
      } catch (error) {
        console.log(`  ✗ Error exportando ${contentType}:`, error.message);
        exportedData[contentType] = [];
      }
    }

    // Guardar los datos en un archivo JSON
    const outputPath = path.join(__dirname, '..', 'data', 'exported-data.json');
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeJson(outputPath, exportedData, { spaces: 2 });

    console.log(`\n✓ Datos exportados exitosamente a: ${outputPath}`);
  } catch (error) {
    console.error('Error durante la exportación:', error);
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  await exportData();
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
