export default function MiDesempenoPage() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-ink">Mi desempeno</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-ink">Mis OKR</h2>
          <p className="mt-2 text-sm text-slate-600">0 objetivos activos.</p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-ink">Mis feedbacks</h2>
          <p className="mt-2 text-sm text-slate-600">Bandeja vacia.</p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-ink">Mis evaluaciones</h2>
          <p className="mt-2 text-sm text-slate-600">Sin evaluaciones pendientes.</p>
        </div>
      </div>
    </section>
  );
}
