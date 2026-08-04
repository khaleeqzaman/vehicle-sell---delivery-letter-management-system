import React from 'react';
import { MVCModule } from '../types';
import { Layers, Server, Database, Layout, Code2, PlusCircle, CheckCircle2, Cpu } from 'lucide-react';

interface MVCArchitectureViewProps {
  modules: MVCModule[];
}

export const MVCArchitectureView: React.FC<MVCArchitectureViewProps> = ({ modules }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" /> Pluggable MVC Architecture Registry
        </div>
        <h1 className="text-2xl font-bold font-serif text-white">
          System MVC Modular Framework &amp; API Blueprint
        </h1>
        <p className="text-slate-300 text-xs leading-relaxed max-w-3xl">
          This system is constructed following strict Model-View-Controller (MVC) modular architecture guidelines. Each business domain (Delivery Letters, CRM Clients, Showroom Branding, Stock) operates as an isolated MVC module registered cleanly into the backend route handlers.
        </p>
      </div>

      {/* Diagram Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Model */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-serif">1. Model Layer</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Encapsulates database schemas, JSON persistent file storage, data validations, and auto-calculations (e.g. Rupee digit-to-word conversion and balance calculations).
          </p>
          <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
            db_storage.json &amp; /src/types/index.ts
          </div>
        </div>

        {/* View */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Layout className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-serif">2. View Layer</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tailwind CSS responsive admin components and high-fidelity 2-page print templates matching exact legal delivery letter layouts.
          </p>
          <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
            /src/components/*
          </div>
        </div>

        {/* Controller */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-serif">3. Controller &amp; API Routes</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Express HTTP endpoints serving structured REST JSON responses for delivery letters, client CRM directory, and showroom settings.
          </p>
          <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
            server.ts API Routes
          </div>
        </div>
      </div>

      {/* Module Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif">
              Registered MVC System Modules
            </h2>
            <p className="text-xs text-slate-500">
              Active and pluggable modules currently bound to the system kernel.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-900 rounded-full">
            {modules.length} Modules Loaded
          </span>
        </div>

        <div className="space-y-4">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className={`p-4 rounded-xl border transition-all ${
                mod.status === 'active'
                  ? 'bg-slate-50/60 border-slate-200'
                  : 'bg-slate-100/50 border-slate-200 opacity-75'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-slate-900 text-sm">{mod.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    v{mod.version}
                  </span>
                </div>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  mod.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {mod.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-1">
                {mod.description}
              </p>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono bg-white p-2.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 font-sans block text-[10px]">REST API Routes:</span>
                  <span className="text-slate-800 font-bold">{mod.routes.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans block text-[10px]">Views &amp; Components:</span>
                  <span className="text-slate-700">{mod.views.join(', ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extensibility Guide Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-slate-900 space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-amber-700" /> How to Add a New MVC Module to this System
        </h3>
        <p className="text-xs text-slate-700 leading-relaxed">
          Because of the clean separation of concerns, adding a new module (e.g., <code>Vehicle Inventory / Stock Module</code> or <code>Showroom Expenses Module</code>) requires just 3 steps:
        </p>
        <ol className="list-decimal list-inside text-xs text-slate-800 space-y-1.5 font-medium">
          <li><strong>Define Types / Model:</strong> Add interface schemas to <code>/src/types/index.ts</code>.</li>
          <li><strong>Add Controller API Routes:</strong> Register <code>app.get(&apos;/api/your_module&apos;, ...)</code> in <code>server.ts</code>.</li>
          <li><strong>Mount View Component:</strong> Create a component in <code>/src/components/YourModuleView.tsx</code> and add a tab to <code>Navbar.tsx</code>.</li>
        </ol>
      </div>
    </div>
  );
};
