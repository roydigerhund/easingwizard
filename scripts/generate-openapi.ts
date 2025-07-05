import fs from 'fs';
import { generateOpenAPIDocument } from '~/validations/openapi-schemas';

function main() {
  console.log('Generating OpenAPI specification...');

  const openApiSpec = generateOpenAPIDocument();

  const outputPath = './app/generated/openapi.json';
  fs.writeFileSync(outputPath, JSON.stringify(openApiSpec, null, 2), 'utf8');

  console.log(`✅ OpenAPI specification generated at ${outputPath}`);
}

main();
