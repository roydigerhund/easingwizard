import { readFileSync } from 'fs';
import { join } from 'path';

export async function loader() {
  try {
    // Read the generated OpenAPI spec dynamically
    const specPath = join(process.cwd(), 'app/generated/openapi.json');
    const openApiSpec = JSON.parse(readFileSync(specPath, 'utf8'));
    
    return new Response(JSON.stringify(openApiSpec, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to load OpenAPI specification:', error);
    return new Response(
      JSON.stringify({ error: 'OpenAPI specification not found' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
