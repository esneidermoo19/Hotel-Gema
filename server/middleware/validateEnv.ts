export function validateEnv(): void {
  const required: Record<string, string> = {
    VITE_SUPABASE_URL:
      'URL del proyecto Supabase (Dashboard → Project Settings → API → Project URL)',
    SUPABASE_SERVICE_ROLE_KEY:
      'Clave service_role (Dashboard → Project Settings → API → service_role)',
  };

  const missing: string[] = [];

  for (const [key, description] of Object.entries(required)) {
    if (!process.env[key]) {
      missing.push(`  ${key}: ${description}`);
    }
  }

  if (missing.length > 0) {
    console.error('\n❌ [Hotel Gema API] Faltan variables de entorno requeridas:\n');
    missing.forEach((m) => console.error(m));
    console.error('\nAgrega estas variables a tu archivo .env y reinicia el servidor.\n');
    process.exit(1);
  }

  if (process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
    console.error(
      '\n⚠️  [ADVERTENCIA DE SEGURIDAD] Se detectó VITE_SUPABASE_SERVICE_ROLE_KEY.\n' +
        '   Las variables con prefijo VITE_ son inyectadas en el bundle del navegador por Vite.\n' +
        '   La service_role key NUNCA debe tener el prefijo VITE_.\n' +
        '   Renómbrala a SUPABASE_SERVICE_ROLE_KEY en tu .env inmediatamente.\n'
    );
  }
}
