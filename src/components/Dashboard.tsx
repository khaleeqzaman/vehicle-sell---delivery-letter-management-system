import React from 'react';
import { SellLetterDocument, ShowroomSettings, VehicleInventoryItem } from '../types';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  PlusCircle, 
  Printer, 
  Building2, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Car,
  Package,
  Gauge,
  Fuel,
  Plus
} from 'lucide-react';

interface DashboardProps {
  letters: SellLetterDocument[];
  inventory?: VehicleInventoryItem[];
  showroom: ShowroomSettings;
  onNavigate: (tab: string) => void;
  onSelectLetter: (letter: SellLetterDocument) => void;
  onCreateLetterForVehicle?: (vehicle: VehicleInventoryItem) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  letters,
  inventory = [],
  showroom,
  onNavigate,
  onSelectLetter,
  onCreateLetterForVehicle
}) => {
  const totalLetters = letters.length;
  const totalVolume = letters.reduce((acc, curr) => acc + (curr.payment?.sumInDigits || 0), 0);
  const pendingLetters = letters.filter(l => l.status === 'pending_balance');
  const pendingAmount = pendingLetters.reduce((acc, curr) => acc + (curr.payment?.balance || 0), 0);

  // Inventory stats
  const totalCars = inventory.length;
  const availableCars = inventory.filter(i => i.status === 'Available').length;
  const reservedCars = inventory.filter(i => i.status === 'Reserved').length;
  const activeStockValue = inventory
    .filter(i => i.status === 'Available' || i.status === 'Reserved')
    .reduce((sum, curr) => sum + (curr.demandPrice || 0), 0);

  return (
    <div className="space-y-6 text-white">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Showroom Management System (MVC Architecture)
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
            Welcome to {showroom.name || 'INFINITY MOTORS'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            {showroom.tagline || 'Trusted Deals · Verified Vehicles'} — Complete vehicle sell &amp; delivery letter generator, showroom vehicle inventory manager, and client CRM ledger.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('inventory')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all cursor-pointer"
          >
            <Car className="w-4 h-4 text-indigo-400" /> Manage Inventory ({totalCars})
          </button>
          <button
            onClick={() => onNavigate('new-letter')}
            id="btn-dash-create-letter"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> New Delivery Letter
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Stat 1: Vehicles in Stock */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Showroom Stock</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white block">{totalCars} Units</span>
          <span className="text-[11px] text-emerald-400 font-medium mt-1 block">
            {availableCars} Available | {reservedCars} Reserved
          </span>
        </div>

        {/* Stat 2: Active Stock Value */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Stock Value</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl font-black text-amber-400 block">
            Rs. {(activeStockValue / 100000).toFixed(1)} Lakh
          </span>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            Total Demanded Value
          </span>
        </div>

        {/* Stat 3: Total Sell Letters */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Archived Letters</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-white block">{totalLetters}</span>
          <span className="text-[11px] text-emerald-400 font-medium mt-1 block">
            All Letters Preserved
          </span>
        </div>

        {/* Stat 4: Transaction Volume */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deals Volume</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl font-black text-white block">
            Rs. {(totalVolume / 100000).toFixed(1)} Lakh
          </span>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            Letters Sales Total
          </span>
        </div>

        {/* Stat 5: Pending Balances */}
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-md col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Pending Balances</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-amber-400 block">{pendingLetters.length}</span>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            Rs. {(pendingAmount / 100000).toFixed(1)} L Outstanding
          </span>
        </div>
      </div>

      {/* VEHICLES INVENTORY QUICK PREVIEW ON DASHBOARD */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white font-serif flex items-center gap-2">
              <Car className="w-4 h-4 text-indigo-400" /> Showroom Vehicles Inventory
            </h2>
            <p className="text-xs text-slate-400">
              Active cars in stock with Pakistani Smart Card &amp; Biometric status.
            </p>
          </div>
          <button
            onClick={() => onNavigate('inventory')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            Full Inventory ({inventory.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventory.slice(0, 3).map((item) => (
            <div key={item.id} className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      {item.stockId}
                    </span>
                    <h3 className="text-sm font-bold text-white font-serif">
                      {item.make} {item.model} ({item.modelYear})
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {item.variant}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                    {item.registrationNo}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span>{item.colour}</span>
                  <span>•</span>
                  <span>{item.transmission}</span>
                  <span>•</span>
                  <span>{item.mileageKm.toLocaleString()} km</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Demanded Price:</span>
                  <span className="font-bold text-amber-400">
                    Rs. {(item.demandPrice / 100000).toFixed(2)} Lakh
                  </span>
                </div>
              </div>

              {onCreateLetterForVehicle && (
                <button
                  onClick={() => onCreateLetterForVehicle(item)}
                  className="w-full mt-2 py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" /> Create Sell Letter
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Delivery Letters (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white font-serif">
                Recent Vehicle Delivery Letters (Archived)
              </h2>
              <p className="text-xs text-slate-400">
                Click any letter to open high-fidelity 2-page print layout.
              </p>
            </div>
            <button
              onClick={() => onNavigate('letters-archive')}
              id="btn-view-all-letters"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              View All ({letters.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-3 py-2.5">Serial / Reg No</th>
                  <th className="px-3 py-2.5">Vehicle Particulars</th>
                  <th className="px-3 py-2.5">Purchaser</th>
                  <th className="px-3 py-2.5">Amount / Balance</th>
                  <th className="px-3 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {letters.slice(0, 5).map((letItem) => (
                  <tr key={letItem.id} className="hover:bg-slate-950/60 transition-colors">
                    <td className="px-3 py-3">
                      <span className="font-bold text-white block">{letItem.serialNo}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold inline-block mt-0.5 font-mono">
                        {letItem.vehicle.registrationNo}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-semibold text-white block">
                        {letItem.vehicle.make} {letItem.vehicle.model}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Color: {letItem.vehicle.colour} | {letItem.vehicle.engineCapacity}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-semibold text-slate-200 block">
                        {letItem.purchaser.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        CNIC: {letItem.purchaser.cnic}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-bold text-white block">
                        Rs. {letItem.payment.sumInDigits ? letItem.payment.sumInDigits.toLocaleString('en-PK') : '0'}
                      </span>
                      {letItem.payment.balance > 0 ? (
                        <span className="text-[10px] text-amber-400 font-bold">
                          Bal: Rs. {letItem.payment.balance.toLocaleString('en-PK')}
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-bold">Fully Paid</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => onSelectLetter(letItem)}
                        id={`btn-dash-print-${letItem.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        <Printer className="w-3 h-3 text-amber-400" /> Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panel: Quick Actions & Showroom Header Card */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" /> Showroom Header Branding
            </h3>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-3">
                {showroom.logoUrl && (
                  <img
                    src={showroom.logoUrl}
                    alt="Logo"
                    className="w-10 h-10 rounded-full border border-amber-500 object-cover"
                  />
                )}
                <div>
                  <span className="font-bold text-white block font-serif text-sm">
                    {showroom.name}
                  </span>
                  <span className="text-amber-400 font-semibold text-[10px]">
                    {showroom.tagline}
                  </span>
                </div>
              </div>
              <p className="text-slate-400 pt-1 text-[11px]">
                {showroom.addressLine1}, {showroom.addressLine2}
              </p>
              <div className="text-[11px] font-semibold text-slate-300">
                Contact: {showroom.contactNo}
              </div>

              <button
                onClick={() => onNavigate('settings')}
                id="btn-dash-edit-showroom"
                className="w-full mt-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer border border-slate-700"
              >
                Customize Logo &amp; Letterhead
              </button>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-white">
            <h3 className="text-sm font-bold text-amber-400 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> 2-Page Urdu Undertaking Included
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every generated letter comes complete with Page 1 Vehicle Particulars + Page 2 Purchaser 9-Point Urdu Undertaking and Thumb Impression Boxes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
