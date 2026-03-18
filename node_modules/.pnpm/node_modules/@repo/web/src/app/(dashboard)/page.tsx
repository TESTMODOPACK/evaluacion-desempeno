'use client';

import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { api, CURRENT_USER_EMAIL } from '../../lib/api';

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('Usuario');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const email = user?.email || CURRENT_USER_EMAIL;
        
        if (user && user.firstName) {
            setFirstName(user.firstName);
        }

        const result = await api.get(`/employees/${email}/dashboard`);
        setData(result);
      } catch (err: any) {
        console.error('Failed to load dashboard:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border-l-4 border-danger bg-red-50 p-8 text-black shadow-lg">
          <h2 className="text-xl font-bold">Error cargando el Dashboard</h2>
          <p className="mt-2 text-slate-700">{error}</p>
          <p className="mt-2 text-sm text-slate-500">Asegúrate de que la API NestJS esté corriendo y accesible.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!data) return null;

  const { metrics, recentActivity } = data;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner de Bienvenida */}
      <div className="rounded-2xl bg-gradient-to-r from-ink to-slate-800 p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold">¡Hola, {firstName}! 👋</h2>
        <p className="mt-2 text-slate-300">
          Este es el resumen de tu desempeño y tareas pendientes para hoy.
        </p>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="flex flex-col">
          <span className="text-sm font-medium text-slate-500">Evaluaciones Pendientes</span>
          <span className="mt-2 text-3xl font-bold text-ink">{metrics?.pendingEvaluations || 0}</span>
          <div className="mt-4 flex items-center text-sm">
            {metrics?.pendingEvaluations > 0 ? (
              <Badge variant="warning">Requiere acción</Badge>
            ) : (
              <Badge variant="success">Todo al día</Badge>
            )}
          </div>
        </Card>

        <Card className="flex flex-col">
          <span className="text-sm font-medium text-slate-500">Feedback Recibido (Mes)</span>
          <span className="mt-2 text-3xl font-bold text-ink">{metrics?.feedbackCount || 0}</span>
          <div className={`mt-4 flex items-center text-sm font-medium ${metrics?.feedbackGrowth >= 0 ? 'text-success' : 'text-danger'}`}>
            {metrics?.feedbackGrowth >= 0 ? `↗ +${metrics?.feedbackGrowth || 0}` : `↘ ${metrics?.feedbackGrowth}`} desde el mes pasado
          </div>
        </Card>

        <Card className="flex flex-col">
          <span className="text-sm font-medium text-slate-500">Progreso de OKRs</span>
          <span className="mt-2 text-3xl font-bold text-ink">{metrics?.avgOkrProgress || 0}%</span>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${metrics?.avgOkrProgress || 0}%` }}></div>
          </div>
        </Card>
      </div>

      {/* Actividad Reciente */}
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-ink">Actividad Reciente</h3>
        <div className="space-y-4">
          {(!recentActivity || recentActivity.length === 0) && (
            <p className="text-slate-500 italic">No hay actividad reciente para mostrar.</p>
          )}
          {recentActivity?.map((item: any, i: number) => (
            <div key={item.id || i} className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
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
              <div className="ml-auto text-xs text-slate-400">
                {new Date(item.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
