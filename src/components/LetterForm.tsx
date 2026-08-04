import React, { useState, useEffect } from 'react';
import { SellLetterDocument, ClientProfile, ShowroomSettings, VehicleInventoryItem } from '../types';
import { numberToPakistaniRupees } from '../utils/numberToWords';
import { 
  Car, 
  User, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle, 
  Save, 
  ArrowLeft,
  Search,
  CheckSquare,
  Package
} from 'lucide-react';

interface LetterFormProps {
  initialData?: SellLetterDocument | null;
  clients: ClientProfile[];
  inventory?: VehicleInventoryItem[];
  showroom: ShowroomSettings;
  onSave: (letter: SellLetterDocument) => void;
  onCancel: () => void;
}

export const LetterForm: React.FC<LetterFormProps> = ({
  initialData,
  clients,
  inventory = [],
  showroom,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<SellLetterDocument>>(() => {
    if (initialData) return initialData;

    const todayStr = new Date().toISOString().split('T')[0];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayDay = days[new Date().getDay()];

    return {
      id: `let_${Date.now()}`,
      serialNo: `INF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      cplcOperatorNo: showroom.cplcOperatorDefault || "CPLC-HYD-9042",
      date: todayStr,
      time: "04:30 PM",
      vehicle: {
        registrationNo: "",
        make: "Toyota",
        model: "",
        colour: "",
        registrationName: "",
        ownerCnic: "",
        chassisNo: "",
        engineNo: "",
        engineCapacity: "1600 cc",
        bookNo: ""
      },
      delivery: {
        date: todayStr,
        day: todayDay,
        time: "05:00 PM"
      },
      payment: {
        sumInWords: "",
        sumInDigits: 0,
        advance: 0,
        balance: 0,
        dateOfBalance: todayStr,
        specialNote: "Balance amount to be cleared via pay order on transfer verification.",
        hasCheque: false
      },
      cheque: {
        bankName: "Meezan Bank Ltd",
        chequeNo: "",
        amount: 0,
        dated: todayStr
      },
      verificationDate: todayStr,
      purchaser: {
        cnic: "",
        name: "",
        fatherName: "",
        phone: "",
        address: "",
        witnessName: "",
        witnessCnic: "",
        originalNumberPlateReceived: true
      },
      seller: {
        cnic: "",
        name: "",
        fatherName: "",
        phone: "",
        address: "",
        witnessName: "",
        witnessCnic: "",
        sellerBiometricAvailable: true
      },
      status: "completed"
    };
  });

  // Auto-calculate word rupees and balance when digits change
  const handleDigitChange = (val: number) => {
    const words = numberToPakistaniRupees(val);
    const advance = formData.payment?.advance || 0;
    const balance = Math.max(0, val - advance);
    setFormData(prev => ({
      ...prev,
      payment: {
        ...prev.payment!,
        sumInDigits: val,
        sumInWords: words,
        balance,
      }
    }));
  };

  const handleAdvanceChange = (adv: number) => {
    const digits = formData.payment?.sumInDigits || 0;
    const balance = Math.max(0, digits - adv);
    setFormData(prev => ({
      ...prev,
      payment: {
        ...prev.payment!,
        advance: adv,
        balance
      }
    }));
  };

  // Select vehicle from inventory
  const handleSelectInventoryVehicle = (vehicleId: string) => {
    const item = inventory.find(i => i.id === vehicleId);
    if (!item) return;

    const words = numberToPakistaniRupees(item.demandPrice || 0);
    const advance = formData.payment?.advance || 0;
    const balance = Math.max(0, (item.demandPrice || 0) - advance);

    setFormData(prev => ({
      ...prev,
      inventoryVehicleId: item.id,
      vehicle: {
        registrationNo: item.registrationNo,
        make: item.make,
        model: `${item.model} ${item.variant}`.trim(),
        colour: item.colour,
        chassisNo: item.chassisNo,
        engineNo: item.engineNo,
        engineCapacity: item.engineCapacity,
        registrationName: prev.vehicle?.registrationName || '',
        ownerCnic: prev.vehicle?.ownerCnic || '',
        bookNo: prev.vehicle?.bookNo || ''
      },
      payment: {
        ...prev.payment!,
        sumInDigits: item.demandPrice || 0,
        sumInWords: words,
        balance
      }
    }));
  };

  // Select existing Purchaser from CRM
  const handleSelectPurchaser = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    setFormData(prev => ({
      ...prev,
      purchaser: {
        ...prev.purchaser!,
        id: client.id,
        cnic: client.cnic,
        name: client.name,
        fatherName: client.fatherName,
        phone: client.phone,
        phone2: client.phone2 || '',
        address: client.address
      }
    }));
  };

  // Select existing Seller from CRM
  const handleSelectSeller = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    setFormData(prev => ({
      ...prev,
      seller: {
        ...prev.seller!,
        id: client.id,
        cnic: client.cnic,
        name: client.name,
        fatherName: client.fatherName,
        phone: client.phone,
        phone2: client.phone2 || '',
        address: client.address
      },
      vehicle: {
        ...prev.vehicle!,
        registrationName: client.name,
        ownerCnic: client.cnic
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicle?.registrationNo) {
      alert("Please enter Vehicle Registration Number");
      return;
    }
    if (!formData.purchaser?.name || !formData.seller?.name) {
      alert("Please enter Purchaser & Seller Name");
      return;
    }

    const finalStatus = (formData.payment?.balance || 0) > 0 ? "pending_balance" : "completed";
    onSave({
      ...formData,
      status: finalStatus
    } as SellLetterDocument);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-12 text-slate-100">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold font-serif text-white">
              {initialData ? 'Edit Delivery Letter' : 'Generate Vehicle Sell & Delivery Letter'}
            </h1>
            <p className="text-xs text-amber-400 font-mono">
              Serial No: {formData.serialNo}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="btn-save-letter"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save &amp; Generate Print Preview
          </button>
        </div>
      </div>

      {/* 1. DOCUMENT META */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Calendar className="w-4 h-4 text-indigo-400" /> Header Meta Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Serial Number</label>
            <input
              type="text"
              value={formData.serialNo}
              onChange={e => setFormData({ ...formData, serialNo: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-bold text-amber-400 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">CPLC Operator #</label>
            <input
              type="text"
              value={formData.cplcOperatorNo}
              onChange={e => setFormData({ ...formData, cplcOperatorNo: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Time</label>
            <input
              type="text"
              value={formData.time}
              onChange={e => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. 04:30 PM"
              required
            />
          </div>
        </div>
      </div>

      {/* 2. VEHICLE PARTICULAR DETAILS WITH INVENTORY PICKER */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Car className="w-4 h-4 text-indigo-400" /> Vehicle Particulars
          </h2>
          {inventory.length > 0 && (
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-slate-400 font-semibold">Import From Inventory:</span>
              <select
                onChange={e => handleSelectInventoryVehicle(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="">-- Choose Stock Vehicle --</option>
                {inventory.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.make} {i.model} ({i.registrationNo}) - Rs. {(i.demandPrice / 100000).toFixed(1)} L
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Registration No.</label>
            <input
              type="text"
              value={formData.vehicle?.registrationNo}
              onChange={e => setFormData({
                ...formData,
                vehicle: { ...formData.vehicle!, registrationNo: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-mono font-bold text-amber-400 uppercase focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. BAD-342"
              required
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Make (Brand)</label>
            <input
              type="text"
              value={formData.vehicle?.make}
              onChange={e => setFormData({
                ...formData,
                vehicle: { ...formData.vehicle!, make: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Toyota"
              required
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Model &amp; Variant</label>
            <input
              type="text"
              value={formData.vehicle?.model}
              onChange={e => setFormData({
                ...formData,
                vehicle: { ...formData.vehicle!, model: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Corolla 1.6 Altis (2022)"
              required
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Colour</label>
            <input
              type="text"
              value={formData.vehicle?.colour}
              onChange={e => setFormData({
                ...formData,
                vehicle: { ...formData.vehicle!, colour: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Super White"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-300 font-semibold mb-1">Registration Name (Owner Name on Excise Book)</label>
            <input
              type="text"
              value={formData.vehicle?.registrationName}
              onChange={e => setFormData({
                ...formData,
                vehicle: { ...formData.vehicle!, registrationName: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Syed Owais Ahmed"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-slate-300 font-semibold mb-1">Owner CNIC Number</label>
            <input
              type="text"
              value={formData.vehicle?.ownerCnic}
              onChange={e => setFormData({
                ...formData,
                vehicle: { ...formData.vehicle!, ownerCnic: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-400 font-mono focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. 41303-9876543-2"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Chassis No.</label>
            <input
              type="text"
              value={formData.vehicle?.chassisNo}
              onChange={e => setFormData({
                ...formData,
                vehicle: { ...formData.vehicle!, chassisNo: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white uppercase font-mono focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. NZE170-9087123"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Engine No.</label>
            <input
              type="text"
              value={formData.vehicle?.engineNo}
              onChange={e => setFormData({
                ...formData,
                vehicle: { ...formData.vehicle!, engineNo: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white uppercase font-mono focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. 1ZR-7823901"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Engine Capacity</label>
            <input
              type="text"
              value={formData.vehicle?.engineCapacity}
              onChange={e => setFormData({
                ...formData,
                vehicle: { ...formData.vehicle!, engineCapacity: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. 1600 cc"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Book No.</label>
            <input
              type="text"
              value={formData.vehicle?.bookNo}
              onChange={e => setFormData({
                ...formData,
                vehicle: { ...formData.vehicle!, bookNo: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. BK-HYD-99821"
            />
          </div>
        </div>
      </div>

      {/* 3. DELIVERY SCHEDULE */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Calendar className="w-4 h-4 text-indigo-400" /> Delivery Schedule
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Delivery Date</label>
            <input
              type="date"
              value={formData.delivery?.date}
              onChange={e => setFormData({
                ...formData,
                delivery: { ...formData.delivery!, date: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Delivery Day</label>
            <input
              type="text"
              value={formData.delivery?.day}
              onChange={e => setFormData({
                ...formData,
                delivery: { ...formData.delivery!, day: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Tuesday"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Delivery Time</label>
            <input
              type="text"
              value={formData.delivery?.time}
              onChange={e => setFormData({
                ...formData,
                delivery: { ...formData.delivery!, time: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. 05:00 PM"
            />
          </div>
        </div>
      </div>

      {/* 4. PAYMENT & CHEQUE DETAILS */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <CreditCard className="w-4 h-4 text-indigo-400" /> Payment &amp; Financial Transaction Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Sum of Rupees (in Digits)</label>
            <input
              type="number"
              value={formData.payment?.sumInDigits || ''}
              onChange={e => handleDigitChange(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-bold text-amber-400 text-sm focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. 5250000"
              required
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Advance Amount</label>
            <input
              type="number"
              value={formData.payment?.advance || ''}
              onChange={e => handleAdvanceChange(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-bold text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. 2500000"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Remaining Balance</label>
            <input
              type="number"
              value={formData.payment?.balance || 0}
              readOnly
              className="w-full px-3 py-2 border border-slate-800 bg-slate-950 font-black text-amber-400 rounded-lg"
            />
          </div>
        </div>

        <div className="text-xs space-y-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Sum of Rupees (in Words - Auto Generated)</label>
            <input
              type="text"
              value={formData.payment?.sumInWords || ''}
              onChange={e => setFormData({
                ...formData,
                payment: { ...formData.payment!, sumInWords: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 focus:outline-none font-medium text-slate-200"
              placeholder="e.g. Fifty-Two Lakh Fifty Thousand Rupees Only"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Date of Balance Payment</label>
              <input
                type="date"
                value={formData.payment?.dateOfBalance}
                onChange={e => setFormData({
                  ...formData,
                  payment: { ...formData.payment!, dateOfBalance: e.target.value }
                })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Special Note / Terms</label>
              <input
                type="text"
                value={formData.payment?.specialNote}
                onChange={e => setFormData({
                  ...formData,
                  payment: { ...formData.payment!, specialNote: e.target.value }
                })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                placeholder="e.g. Balance amount to be cleared via pay order on transfer verification."
              />
            </div>
          </div>
        </div>

        {/* CHEQUE DETAILS ACCORDION / TOGGLE */}
        <div className="border-t border-slate-800 pt-3">
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
            <input
              type="checkbox"
              checked={formData.payment?.hasCheque || false}
              onChange={e => setFormData({
                ...formData,
                payment: { ...formData.payment!, hasCheque: e.target.checked }
              })}
              className="w-4 h-4 rounded text-indigo-500 border-slate-800 bg-slate-950"
            />
            Include Cheque / Pay Order Details in Contract
          </label>

          {formData.payment?.hasCheque && (
            <div className="mt-3 p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bank Name</label>
                <input
                  type="text"
                  value={formData.cheque?.bankName}
                  onChange={e => setFormData({
                    ...formData,
                    cheque: { ...formData.cheque!, bankName: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-800 bg-slate-900 text-white rounded-lg"
                  placeholder="e.g. Meezan Bank Ltd"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cheque No.</label>
                <input
                  type="text"
                  value={formData.cheque?.chequeNo}
                  onChange={e => setFormData({
                    ...formData,
                    cheque: { ...formData.cheque!, chequeNo: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-800 bg-slate-900 text-white rounded-lg"
                  placeholder="e.g. MEZ-88991204"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cheque Amount</label>
                <input
                  type="number"
                  value={formData.cheque?.amount || 0}
                  onChange={e => setFormData({
                    ...formData,
                    cheque: { ...formData.cheque!, amount: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-slate-800 bg-slate-900 text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cheque Dated</label>
                <input
                  type="date"
                  value={formData.cheque?.dated}
                  onChange={e => setFormData({
                    ...formData,
                    cheque: { ...formData.cheque!, dated: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-800 bg-slate-900 text-white rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. VERIFICATION NOTE */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <ShieldCheck className="w-4 h-4 text-indigo-400" /> Section 2: Excise &amp; CPLC Verification Note
        </h2>
        <div className="text-xs space-y-2">
          <label className="block text-slate-300 font-semibold">Verification Date</label>
          <input
            type="date"
            value={formData.verificationDate}
            onChange={e => setFormData({ ...formData, verificationDate: e.target.value })}
            className="max-w-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
          />
          <p className="text-[11px] text-slate-400 italic">
            This date will be automatically filled into: &quot;Note: This vehicle has been verified and confirmed from the Excise Department &amp; CPLC by the purchaser, and found correct in all respects, dated...&quot;
          </p>
        </div>
      </div>

      {/* 6. PURCHASER DETAILS */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" /> Purchaser Information
          </h2>
          {clients.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Select Saved Client:</span>
              <select
                onChange={e => handleSelectPurchaser(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="">-- Pick from Directory --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.cnic})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Purchaser Name</label>
            <input
              type="text"
              value={formData.purchaser?.name}
              onChange={e => setFormData({
                ...formData,
                purchaser: { ...formData.purchaser!, name: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-bold focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Muhammad Ali Raza"
              required
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">S/O (Father&apos;s Name)</label>
            <input
              type="text"
              value={formData.purchaser?.fatherName}
              onChange={e => setFormData({
                ...formData,
                purchaser: { ...formData.purchaser!, fatherName: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Tariq Mahmood"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">CNIC Number</label>
            <input
              type="text"
              value={formData.purchaser?.cnic}
              onChange={e => setFormData({
                ...formData,
                purchaser: { ...formData.purchaser!, cnic: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-400 font-mono focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. 41304-1234567-1"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Primary Phone 1</label>
            <input
              type="text"
              value={formData.purchaser?.phone}
              onChange={e => setFormData({
                ...formData,
                purchaser: { ...formData.purchaser!, phone: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. 0300-9876543"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Secondary Phone 2</label>
            <input
              type="text"
              value={formData.purchaser?.phone2 || ''}
              onChange={e => setFormData({
                ...formData,
                purchaser: { ...formData.purchaser!, phone2: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. 0321-1234567"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-slate-300 font-semibold mb-1">Residential Address</label>
            <input
              type="text"
              value={formData.purchaser?.address}
              onChange={e => setFormData({
                ...formData,
                purchaser: { ...formData.purchaser!, address: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. House 45, Auto Bhan Road, Latifabad, Hyderabad"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Witness Name</label>
            <input
              type="text"
              value={formData.purchaser?.witnessName}
              onChange={e => setFormData({
                ...formData,
                purchaser: { ...formData.purchaser!, witnessName: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Kamran Khan"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Witness CNIC</label>
            <input
              type="text"
              value={formData.purchaser?.witnessCnic}
              onChange={e => setFormData({
                ...formData,
                purchaser: { ...formData.purchaser!, witnessCnic: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-400 font-mono focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. 41304-6677889-3"
            />
          </div>
          <div className="flex items-center pt-5">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
              <input
                type="checkbox"
                checked={formData.purchaser?.originalNumberPlateReceived || false}
                onChange={e => setFormData({
                  ...formData,
                  purchaser: { ...formData.purchaser!, originalNumberPlateReceived: e.target.checked }
                })}
                className="w-4 h-4 rounded text-indigo-500 border-slate-800 bg-slate-950"
              />
              Original Number Plate Received (Yes)
            </label>
          </div>
        </div>
      </div>

      {/* 7. SELLER DETAILS */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" /> Seller Information
          </h2>
          {clients.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Select Saved Client:</span>
              <select
                onChange={e => handleSelectSeller(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="">-- Pick from Directory --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.cnic})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Seller Name</label>
            <input
              type="text"
              value={formData.seller?.name}
              onChange={e => setFormData({
                ...formData,
                seller: { ...formData.seller!, name: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-bold focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Syed Owais Ahmed"
              required
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">S/O (Father&apos;s Name)</label>
            <input
              type="text"
              value={formData.seller?.fatherName}
              onChange={e => setFormData({
                ...formData,
                seller: { ...formData.seller!, fatherName: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Syed Farooq Ahmed"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">CNIC Number</label>
            <input
              type="text"
              value={formData.seller?.cnic}
              onChange={e => setFormData({
                ...formData,
                seller: { ...formData.seller!, cnic: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-400 font-mono focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. 41303-9876543-2"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Primary Phone 1</label>
            <input
              type="text"
              value={formData.seller?.phone}
              onChange={e => setFormData({
                ...formData,
                seller: { ...formData.seller!, phone: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. 0312-3456789"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Secondary Phone 2</label>
            <input
              type="text"
              value={formData.seller?.phone2 || ''}
              onChange={e => setFormData({
                ...formData,
                seller: { ...formData.seller!, phone2: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. 0333-7654321"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-slate-300 font-semibold mb-1">Residential Address</label>
            <input
              type="text"
              value={formData.seller?.address}
              onChange={e => setFormData({
                ...formData,
                seller: { ...formData.seller!, address: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Citizen Colony, Qasimabad, Hyderabad"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Witness Name</label>
            <input
              type="text"
              value={formData.seller?.witnessName}
              onChange={e => setFormData({
                ...formData,
                seller: { ...formData.seller!, witnessName: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Zubair Siddiqui"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Witness CNIC</label>
            <input
              type="text"
              value={formData.seller?.witnessCnic}
              onChange={e => setFormData({
                ...formData,
                seller: { ...formData.seller!, witnessCnic: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-400 font-mono focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. 41303-1144556-7"
            />
          </div>
          <div className="flex items-center pt-5">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
              <input
                type="checkbox"
                checked={formData.seller?.sellerBiometricAvailable || false}
                onChange={e => setFormData({
                  ...formData,
                  seller: { ...formData.seller!, sellerBiometricAvailable: e.target.checked }
                })}
                className="w-4 h-4 rounded text-indigo-500 border-slate-800 bg-slate-950"
              />
              Seller Biometric Available (Yes)
            </label>
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          id="btn-bottom-save-letter"
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save &amp; Generate Print Preview
        </button>
      </div>
    </form>
  );
};
