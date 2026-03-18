import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Evaluación de Desempeño',
  description: 'Plataforma administrativa corporativa para RRHH',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased bg-sand text-slate-800">
        {children}
      </body>
    </html>
  );
}
