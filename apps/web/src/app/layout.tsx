import './globals.css';
import type { ReactNode } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

export const metadata = {
  title: 'Evaluación de Desempeño',
  description: 'Plataforma administrativa corporativa para RRHH',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">
        <div className="flex min-h-screen bg-sand">
          {/* Navegación Fija Módular */}
          <Sidebar />

          {/* Contenedor Principal (Margen a la izquierda compensando ancho del Sidebar) */}
          <div className="flex flex-1 flex-col pl-64 transition-all pb-12">
            <Header />
            <main className="mx-auto w-full max-w-6xl px-8 py-8 animate-fade-in">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
