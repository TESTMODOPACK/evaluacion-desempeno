export default function NuevoCicloPage() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-ink">Nuevo ciclo</h1>
      <p className="mt-2 text-slate-600">Wizard de creacion de ciclos.</p>
      <ol className="mt-6 space-y-3 text-sm text-slate-700">
        <li className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          1. Plantilla
        </li>
        <li className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          2. Poblacion
        </li>
        <li className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          3. Ventanas
        </li>
        <li className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          4. Settings
        </li>
      </ol>
    </section>
  );
}
