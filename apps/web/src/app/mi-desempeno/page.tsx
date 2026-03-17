import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export default function MiDesempenoPage() {
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Resumen Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ink">Mi Desempeño</h2>
          <p className="mt-1 text-slate-500">
            Revisa tus objetivos, evaluaciones y feedback continuo.
          </p>
        </div>
        <Button variant="primary">Solicitar Feedback</Button>
      </div>

      {/* Grid de Contenido Principal */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Columna Izquierda: OKRs */}
        <div className="space-y-6">
          <Card className="h-full">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Objetivos y Resultados (OKRs)</h3>
              <Badge variant="info">Q3 Actual</Badge>
            </div>

            <div className="space-y-6">
              {[
                { obj: 'Lanzar nuevo portal cautivo', pct: 80, status: 'success' },
                { obj: 'Reducir latencia en endpoints', pct: 45, status: 'warning' },
                { obj: 'Contratar 2 desarrolladores Senior', pct: 10, status: 'danger' },
              ].map((item, i) => (
                <div key={i} className="group cursor-pointer rounded-lg border border-border p-4 transition-colors hover:border-accent hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-ink">{item.obj}</p>
                    <span className="text-sm font-semibold">{item.pct}%</span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full ${
                        item.status === 'success'
                          ? 'bg-success'
                          : item.status === 'warning'
                          ? 'bg-warning'
                          : 'bg-danger'
                      }`}
                      style={{ width: `${item.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">Ver todos los OKRs</Button>
            </div>
          </Card>
        </div>

        {/* Columna Derecha: Feedback & Evaluaciones */}
        <div className="space-y-6">
          <Card>
             <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-ink">Evaluaciones Activas</h3>
              </div>
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="warning" className="mb-2">Autoevaluación Pendiente</Badge>
                    <p className="font-bold text-yellow-800">Evaluación Q2 - Mitad de año</p>
                    <p className="text-sm text-yellow-700">Vence: 30 de Septiembre</p>
                  </div>
                  <Button variant="primary" size="sm">Comenzar</Button>
                </div>
              </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Feedback Reciente</h3>
              <span className="text-sm text-accent cursor-pointer hover:underline">Ver muro completo</span>
            </div>
            <div className="space-y-4">
              {[
                { from: 'Sofía R.', text: 'Excelente liderazgo en el último sprint crítico. Nos salvaste el release.', date: '3 días ago' },
                { from: 'Miguel T.', text: 'Tus code reviews son muy constructivos, aprendo mucho.', date: '1 semana ago' }
              ].map((fb, i) => (
                <div key={i} className="rounded-lg bg-slate-50 p-4 border border-slate-100">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-ink">{fb.from}</span>
                    <span className="text-xs text-slate-400">{fb.date}</span>
                  </div>
                  <p className="text-sm text-slate-600 italic">"{fb.text}"</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
