import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Banner de Bienvenida */}
      <div className="rounded-2xl bg-gradient-to-r from-ink to-slate-800 p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold">¡Hola, Ricardo! 👋</h2>
        <p className="mt-2 text-slate-300">
          Este es el resumen de tu desempeño y tareas pendientes para hoy.
        </p>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="flex flex-col">
          <span className="text-sm font-medium text-slate-500">Evaluaciones Pendientes</span>
          <span className="mt-2 text-3xl font-bold text-ink">3</span>
          <div className="mt-4 flex items-center text-sm">
            <Badge variant="warning">Requiere acción</Badge>
          </div>
        </Card>

        <Card className="flex flex-col">
          <span className="text-sm font-medium text-slate-500">Feedback Recibido (Mes)</span>
          <span className="mt-2 text-3xl font-bold text-ink">12</span>
          <div className="mt-4 flex items-center text-sm text-success font-medium">
            ↗ +2 desde el mes pasado
          </div>
        </Card>

        <Card className="flex flex-col">
          <span className="text-sm font-medium text-slate-500">Progreso de OKRs</span>
          <span className="mt-2 text-3xl font-bold text-ink">65%</span>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-accent" style={{ width: '65%' }}></div>
          </div>
        </Card>
      </div>

      {/* Actividad Reciente */}
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-ink">Actividad Reciente</h3>
        <div className="space-y-4">
          {[
            {
              title: 'Nueva evaluación 360 asignada',
              desc: 'Debes evaluar a Carlos Mendoza antes del viernes.',
              time: 'Hace 2 horas',
              type: 'eval',
            },
            {
              title: 'Feedback positivo recibido',
              desc: 'Ana López te ha dejado un comentario sobre el proyecto Alfa.',
              time: 'Ayer',
              type: 'feedback',
            },
            {
              title: 'Cierre de ciclo Q2',
              desc: 'Los resultados han sido publicados por RRHH.',
              time: 'Hace 3 días',
              type: 'system',
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                  item.type === 'eval'
                    ? 'bg-yellow-100 text-yellow-600'
                    : item.type === 'feedback'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-indigo-100 text-indigo-600'
                }`}
              >
                {item.type === 'eval' ? '📝' : item.type === 'feedback' ? '💬' : '⚙️'}
              </div>
              <div>
                <p className="font-medium text-ink">{item.title}</p>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
              <div className="ml-auto text-xs text-slate-400">{item.time}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
