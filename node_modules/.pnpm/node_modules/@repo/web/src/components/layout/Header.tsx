'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  // Función simple para derivar el título dinámico desde la ruta
  const getPageTitle = () => {
    if (pathname === '/') return 'Panel General';
    if (pathname.includes('/mi-desempeno')) return 'Mi Desempeño';
    if (pathname.includes('/rrhh/ciclos/nuevo')) return 'Nuevo Ciclo de Evaluación';
    if (pathname.includes('/rrhh/ciclos')) return 'Gestión de Ciclos';
    return 'Evaluación de Desempeño';
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-white/80 px-8 backdrop-blur-md">
      <div>
        <h1 className="text-xl font-semibold text-ink">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar empleados..."
            className="h-9 w-64 rounded-full border border-border bg-slate-50 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
          />
        </div>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-slate-500 hover:bg-slate-50 hover:text-ink transition-colors">
          🔔
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  );
}
