import React from 'react';
import Link from 'next/link';

export function Sidebar() {
  const menuItems = [
    { name: 'Panel General', href: '/', icon: '📊' },
    { name: 'Mi Desempeño', href: '/mi-desempeno', icon: '🎯' },
  ];

  const adminItems = [{ name: 'Gestión Ciclos RRHH', href: '/rrhh/ciclos/nuevo', icon: '⚙️' }];

  return (
    <aside className="fixed bottom-0 left-0 top-0 flex w-64 flex-col border-r border-border bg-white shadow-sm">
      <div className="flex h-16 items-center border-b border-border px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white shadow-sm">
            E
          </div>
          <span className="text-lg font-bold text-ink">EvalPro</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Personal
        </p>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-ink transition-colors"
          >
            <span className="mr-3 text-base">{item.icon}</span>
            {item.name}
          </Link>
        ))}

        <div className="mt-8">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Administración
          </p>
          {adminItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-ink transition-colors"
            >
              <span className="mr-3 text-base">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-2 border border-slate-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
            R
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-ink">Ricardo</span>
            <span className="text-xs text-slate-500">Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
