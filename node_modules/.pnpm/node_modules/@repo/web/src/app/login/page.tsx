'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response: any = await api.post('/auth/login', { email, password });
      
      if (response.accessToken) {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        // Force a small delay for UX polish
        setTimeout(() => {
          router.push('/');
        }, 300);
      } else {
        setError('Respuesta inválida del servidor.');
      }
    } catch (err: any) {
      console.error(err);
      setError(`Error: ${err.message === 'Failed to fetch' ? 'No se pudo conectar al servidor (Revisa si la API está encendida)' : 'Credenciales inválidas. Verifica tu correo y contraseña.'}`);
    } finally {
      if (!error) setLoading(false); 
      // If success, keep loading true to prevent fast flashes before redirect
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand px-4">
      <div className="max-w-md w-full animate-fade-in">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-2">Evaluación de Desempeño</h1>
            <p className="text-sm text-slate-500">Inicia sesión en tu cuenta para continuar</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-start">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Correo corporativo
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@acme.com"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                <span>Contraseña</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-400">
            Credenciales de prueba: <br />
            <strong>rrhh@acme.com</strong> | <strong>ricardo@acme.com</strong><br />
            Contraseña: <strong>Modopack123!</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
