import React, { useState } from 'react';
import { ShowroomSettings } from '../types';
import { Settings, Save, Building, Phone, Globe, Image, FileText, CheckCircle2, Shield } from 'lucide-react';

interface ShowroomSettingsViewProps {
  settings: ShowroomSettings;
  onSave: (updated: ShowroomSettings) => void;
}

export const ShowroomSettingsView: React.FC<ShowroomSettingsViewProps> = ({
  settings,
  onSave
}) => {
  const [formData, setFormData] = useState<ShowroomSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleRuleChange = (index: number, text: string) => {
    const updatedRules = [...formData.urduUndertakingRules];
    updatedRules[index] = text;
    setFormData({ ...formData, urduUndertakingRules: updatedRules });
  };

  const handleAddRule = () => {
    setFormData({
      ...formData,
      urduUndertakingRules: [...formData.urduUndertakingRules, "نئی ہدایت درج کریں"]
    });
  };

  const handleRemoveRule = (index: number) => {
    const updated = formData.urduUndertakingRules.filter((_, i) => i !== index);
    setFormData({ ...formData, urduUndertakingRules: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-12 text-white">
      {/* Top Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Settings className="w-3.5 h-3.5" /> Showroom Header &amp; Branding Config
          </div>
          <h1 className="text-xl font-bold font-serif text-white flex items-center gap-2">
            Showroom &amp; Letterhead Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Dynamically customize Showroom Name, Logo, Address Lines, Contacts, CPLC default, and Page 2 Urdu Undertaking terms.
          </p>
        </div>
        <button
          type="submit"
          id="btn-save-showroom-settings"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Showroom settings saved successfully! All newly generated delivery letters will use these dynamic header details.
        </div>
      )}

      {/* 1. BRANDING & HEADER DETAILS */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Building className="w-4 h-4 text-indigo-400" /> Showroom Branding &amp; Logo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Showroom Title / Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-bold font-serif text-sm text-white focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={e => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-medium text-amber-400 focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Trusted Deals · Verified Vehicles"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
              <span>Header Logo Image URL or Base64 Data</span>
              <span className="text-[10px] text-slate-500 font-normal">Displayed inside the 23mm header circle</span>
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={formData.logoUrl}
                onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-[11px] focus:border-indigo-500 focus:outline-none"
                placeholder="https://..."
              />
              {formData.logoUrl && (
                <div className="w-10 h-10 rounded-full border-2 border-amber-500 overflow-hidden flex-none">
                  <img src={formData.logoUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONTACTS & LOCATION */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Phone className="w-4 h-4 text-indigo-400" /> Address &amp; Contact Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Address Line 1 (Main Road / Landmark)</label>
            <input
              type="text"
              value={formData.addressLine1}
              onChange={e => setFormData({ ...formData, addressLine1: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Main Wadhu Wah Road"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Address Line 2 (City / Area)</label>
            <input
              type="text"
              value={formData.addressLine2}
              onChange={e => setFormData({ ...formData, addressLine2: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Near Wadhu Wah Gate, Hyderabad, Sindh, Pakistan"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Showroom Contact Phone Number(s)</label>
            <input
              type="text"
              value={formData.contactNo}
              onChange={e => setFormData({ ...formData, contactNo: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. 0313-3356592"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Website Domain / Email</label>
            <input
              type="text"
              value={formData.website}
              onChange={e => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. www.infinitymotors.pk"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Default CPLC Operator Code</label>
            <input
              type="text"
              value={formData.cplcOperatorDefault}
              onChange={e => setFormData({ ...formData, cplcOperatorDefault: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. CPLC-HYD-9042"
            />
          </div>
        </div>
      </div>

      {/* 3. URDU UNDERTAKING RULES MANAGEMENT */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" /> Page 2: Urdu Undertaking Instructions
          </h2>
          <button
            type="button"
            onClick={handleAddRule}
            className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            + Add Instruction Line
          </button>
        </div>

        <div className="space-y-3">
          {formData.urduUndertakingRules.map((rule, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className="w-6 font-bold text-amber-400 text-right">{idx + 1}.</span>
              <input
                type="text"
                value={rule}
                onChange={e => handleRuleChange(idx, e.target.value)}
                dir="rtl"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-serif text-white text-sm focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemoveRule(idx)}
                className="p-2 text-slate-500 hover:text-red-400 transition-colors cursor-pointer text-lg font-bold"
                title="Remove Line"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
