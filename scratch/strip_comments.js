import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const filesToProcess = [
  'server/index.ts',
  'server/supabaseAdmin.ts',
  'server/middleware/requireAuth.ts',
  'server/middleware/validateEnv.ts',
  'server/routes/admin.ts',
  'server/routes/auth.ts',
  'server/utils/crypto.ts',
  'src/App.tsx',
  'src/main.tsx',
  'src/types.ts',
  'src/supabase.ts',
  'src/lib/apiClient.ts',
  'src/data/mockData.ts',
  'src/components/Header.tsx',
  'src/components/Sidebar.tsx',
  'src/screens/AdminConsoleScreen.tsx',
  'src/screens/DashboardScreen.tsx',
  'src/screens/FacturacionScreen.tsx',
  'src/screens/HabitacionesScreen.tsx',
  'src/screens/HuespedesScreen.tsx',
  'src/screens/LoginScreen.tsx',
  'src/screens/NuevaReservaWizard.tsx',
  'src/screens/PosScreen.tsx',
  'src/screens/ReportesScreen.tsx',
  'src/screens/ReservasScreen.tsx',
  'src/screens/RoomRackScreen.tsx'
];

function removeComments(sourceCode, isJsx) {
  const result = ts.transpileModule(sourceCode, {
    compilerOptions: {
      removeComments: true,
      target: ts.ScriptTarget.ESNext,
      jsx: isJsx ? ts.JsxEmit.Preserve : undefined,
      module: ts.ModuleKind.ESNext
    }
  });
  return result.outputText;
}

console.log('Script initialized.');
