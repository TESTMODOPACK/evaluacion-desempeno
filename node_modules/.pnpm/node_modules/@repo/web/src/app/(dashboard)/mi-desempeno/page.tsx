'use client';

import { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { api, CURRENT_USER_EMAIL } from '../../../lib/api';

export default function MiDesempenoPage() {
  const [profile, setProfile] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const email = user?.email || CURRENT_USER_EMAIL;

        const profileRes = await api.get(`/employees/${email}/profile`);
        setProfile(profileRes);
        
        if (profileRes && profileRes.id) {
          const [goalsRes, feedbackRes, dashRes] = await Promise.all([
            api.get(`/goals/employee/${profileRes.id}`),
            api.get(`/feedback/inbox/${profileRes.id}`),
            api.get(`/employees/${email}/dashboard`)
          ]);
          setGoals(goalsRes as any[]);
          setFeedback(feedbackRes as any[]);
          setDashboardData(dashRes as any);
        }
      } catch (err) {
        console.error('Failed to load mi-desempeno data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
     return (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
     );
  }

  // Evaluaciones activas sacadas del dashboardData recentActivity para simplificar en MVP
  const activeEvals = dashboardData?.recentActivity?.filter((a: any) => a.type === 'eval') || [];

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
              {goals.length === 0 && (
                <p className="text-sm text-slate-500">No hay objetivos asignados activos.</p>
              )}
              {goals.map((item: any) => (
                <div key={item.id} className="group cursor-pointer rounded-lg border border-border p-4 transition-colors hover:border-accent hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-ink">{item.title}</p>
                    <span className="text-sm font-semibold">{item.progress}%</span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full ${
                        item.progress >= 75
                          ? 'bg-success'
                          : item.progress >= 40
                          ? 'bg-warning'
                          : 'bg-danger'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {goals.length > 0 && (
                <Button variant="outline" className="w-full mt-4">Ver todos los OKRs</Button>
              )}
            </div>
          </Card>
        </div>

        {/* Columna Derecha: Feedback & Evaluaciones */}
        <div className="space-y-6">
          <Card>
             <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-ink">Evaluaciones Activas</h3>
              </div>
              
              {activeEvals.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No tienes evaluaciones pendientes.</p>
              ) : (
                <div className="space-y-4">
                  {activeEvals.map((ev: any) => (
                    <div key={ev.id} className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge variant="warning" className="mb-2">Autoevaluación Pendiente</Badge>
                          <p className="font-bold text-yellow-800">{ev.title}</p>
                          <p className="text-sm text-yellow-700">Asignada: {new Date(ev.date).toLocaleDateString()}</p>
                        </div>
                        <Button variant="primary" size="sm">Comenzar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Feedback Reciente</h3>
              <span className="text-sm text-accent cursor-pointer hover:underline">Ver muro completo</span>
            </div>
            
            {feedback.length === 0 ? (
              <p className="text-sm text-slate-500 italic">Aún no has recibido feedback.</p>
            ) : (
              <div className="space-y-4">
                {feedback.slice(0, 3).map((fb: any) => (
                  <div key={fb.id} className="rounded-lg bg-slate-50 p-4 border border-slate-100">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-ink">{fb.from.firstName} {fb.from.lastName}</span>
                      <span className="text-xs text-slate-400">{new Date(fb.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-600 italic">"{fb.content}"</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
