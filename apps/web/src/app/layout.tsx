import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Evaluacion de Desempeno',
  description: 'Plataforma de evaluacion de desempeno',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="min-h-screen bg-sand">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <div className="text-lg font-semibold text-ink">Evaluacion de Desempeno</div>
              <nav className="text-sm text-slate-600">
                <a className="mr-4 hover:text-ink" href="/rrhh/ciclos/nuevo">
                  RRHH
                </a>
                <a className="hover:text-ink" href="/mi-desempeno">
                  Mi desempeno
                </a>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
