'use client';

import React, { useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Badge } from '../../../../components/ui/Badge';

export default function NuevoCicloPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: 'Información General' },
    { id: 2, title: 'Plantilla y Competencias' },
    { id: 3, title: 'Población a Evaluar' },
    { id: 4, title: 'Fechas y Ventanas' },
  ];

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h2 className="text-2xl font-bold text-ink">Crear Nuevo Ciclo</h2>
          <p className="mt-1 text-slate-500">Configura los parámetros para la próxima ronda de evaluaciones.</p>
        </div>
      </div>

      {/* Navegador de Pasos (Wizard Stepper) */}
      <div className="relative">
        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-slate-200"></div>
        <div
          className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-accent transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>
        
        <ul className="relative flex justify-between">
          {steps.map((step) => (
            <li key={step.id} className="flex flex-col items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition-colors ${
                  currentStep >= step.id
                    ? 'border-accent bg-accent text-white'
                    : 'border-slate-300 bg-white text-slate-400'
                }`}
              >
                {currentStep > step.id ? '✓' : step.id}
              </div>
              <span className={`text-xs font-medium ${currentStep >= step.id ? 'text-ink' : 'text-slate-400'}`}>
                {step.title}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Contenido Dinámico por Paso */}
      <Card className="min-h-[400px]">
        {currentStep === 1 && (
          <div className="space-y-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-ink">Paso 1: Información General</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Input label="Nombre del Ciclo" placeholder="Ej: Evaluación Q4 2026" />
              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium text-slate-700">Tipo de Evaluación</label>
                <select className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent">
                  <option>360 Grados (Líder, Pares, Directos)</option>
                  <option>180 Grados (Líder y Autoevaluación)</option>
                  <option>90 Grados (Solo Líder hacia Directos)</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="mb-1.5 text-sm font-medium text-slate-700">Descripción (Opcional)</label>
                <textarea 
                  className="flex w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent" 
                  rows={4}
                  placeholder="Instrucciones generales que verán los empleados..."
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-slide-up">
             <h3 className="text-lg font-semibold text-ink">Paso 2: Plantilla a utilizar</h3>
             <div className="grid gap-4 md:grid-cols-2">
                {[
                  { name: 'Competencias Core 2026', tags: ['Liderazgo', 'Innovación', 'Valores'] },
                  { name: 'Evaluación Técnica IT', tags: ['Desarrollo', 'Arquitectura'] },
                  { name: 'Desempeño Ventas', tags: ['Metas Comerciales', 'Atención'] },
                  { name: 'Nueva Plantilla en Blanco', tags: [] }
                ].map((tpl, i) => (
                  <div key={i} className={`cursor-pointer rounded-lg border p-4 transition-all ${i === 0 ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-border hover:border-slate-400'}`}>
                    <div className="flex items-center justify-between mb-2">
                       <span className="font-semibold text-ink">{tpl.name}</span>
                       {i === 0 && <span className="text-accent">✓</span>}
                    </div>
                    <div className="flex gap-2">
                      {tpl.tags.map(tag => <Badge key={tag} variant="default">{tag}</Badge>)}
                      {tpl.tags.length === 0 && <span className="text-xs text-slate-500">Crear desde cero</span>}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex h-[300px] flex-col items-center justify-center space-y-4 text-center animate-slide-up">
             <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl">👥</div>
             <div>
               <h3 className="text-lg font-semibold text-ink">Seleccionar Población</h3>
               <p className="mt-1 max-w-sm text-slate-500">Por defecto este ciclo aplicará a todos los empleados activos (245 personas).</p>
             </div>
             <div className="flex gap-4">
               <Button variant="outline">Filtrar por Departamento</Button>
               <Button variant="outline">Subir CSV específico</Button>
             </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-ink">Paso 4: Ventanas de Tiempo</h3>
            <div className="space-y-4">
               <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 border border-slate-100">
                  <div className="w-48 font-medium">1. Autoevaluación</div>
                  <Input type="date" />
                  <span className="text-slate-400">al</span>
                  <Input type="date" />
               </div>
               <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 border border-slate-100">
                  <div className="w-48 font-medium">2. Evaluación de Pares</div>
                  <Input type="date" />
                  <span className="text-slate-400">al</span>
                  <Input type="date" />
               </div>
               <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 border border-slate-100">
                  <div className="w-48 font-medium">3. Evaluación de Líder</div>
                  <Input type="date" />
                  <span className="text-slate-400">al</span>
                  <Input type="date" />
               </div>
            </div>
          </div>
        )}

      </Card>

      {/* Controles del Footer */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1}>
          Atrás
        </Button>
        <div className="flex gap-4">
          <Button variant="outline">Guardar Borrador</Button>
          <Button variant="primary" onClick={handleNext}>
            {currentStep === 4 ? 'Publicar Ciclo' : 'Continuar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
