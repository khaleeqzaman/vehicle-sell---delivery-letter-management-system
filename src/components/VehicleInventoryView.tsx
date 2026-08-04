import React, { useState } from 'react';
import { VehicleInventoryItem, ClientProfile, SellLetterDocument } from '../types';
import { 
  Car, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  Eye, 
  FileText, 
  DollarSign, 
  ShieldCheck, 
  Tag, 
  X, 
  Upload,
  ExternalLink,
  ChevronRight,
  Gauge,
  Fuel,
  Info
} from 'lucide-react';

interface VehicleInventoryViewProps {
  inventory: VehicleInventoryItem[];
  clients: ClientProfile[];
  letters: SellLetterDocument[];
  onAddVehicle: (vehicle: Omit<VehicleInventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateVehicle: (vehicle: VehicleInventoryItem) => void;
  onDeleteVehicle: (id: string) => void;
  onCreateLetterForVehicle: (vehicle: VehicleInventoryItem) => void;
}

export const VehicleInventoryView: React.FC<VehicleInventoryViewProps> = ({
  inventory,
  clients,
  letters,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
  onCreateLetterForVehicle
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Reserved' | 'Sold'>('All');
  const [makeFilter, setMakeFilter] = useState<string>('All');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleInventoryItem | null>(null);
  const [viewingVehicle, setViewingVehicle] = useState<VehicleInventoryItem | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<VehicleInventoryItem>>({
    make: 'Toyota',
    model: 'Corolla',
    variant: '1.6 Altis Grand',
    registrationNo: 'LEA-20-8812',
    registrationCity: 'Lahore',
    modelYear: 2022,
    registrationYear: 2022,
    colour: 'Super White',
    engineNo: '1ZR-889102',
    chassisNo: 'NZE170-998120',
    engineCapacity: '1600 cc',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    mileageKm: 25000,
    assembly: 'Local (CKD)',
    smartCardStatus: 'Original Available',
    biometricStatus: 'Available',
    tokenTaxPaidTill: 'June 2026',
    originalPlatesAvailable: true,
    fileStatus: 'Complete Original File',
    conditionRating: 'Grade A (Excellent)',
    paintDetails: 'Bumper to Bumper Original',
    costPrice: 4800000,
    demandPrice: 5200000,
    status: 'Available',
    images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80'],
    notes: ''
  });

  // Unique makes in inventory
  const uniqueMakes = Array.from(new Set(inventory.map(i => i.make)));

  // Filtered List
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.variant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.chassisNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.stockId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesMake = makeFilter === 'All' || item.make === makeFilter;

    return matchesSearch && matchesStatus && matchesMake;
  });

  // Calculate Metrics
  const totalStock = inventory.length;
  const availableStock = inventory.filter(i => i.status === 'Available').length;
  const reservedStock = inventory.filter(i => i.status === 'Reserved').length;
  const soldStock = inventory.filter(i => i.status === 'Sold').length;

  const totalDemandValue = inventory
    .filter(i => i.status === 'Available' || i.status === 'Reserved')
    .reduce((acc, curr) => acc + (curr.demandPrice || 0), 0);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.make || !formData.model || !formData.registrationNo) {
      alert('Make, Model, and Registration Number are required.');
      return;
    }

    if (editingVehicle) {
      onUpdateVehicle({
        ...editingVehicle,
        ...formData
      } as VehicleInventoryItem);
      setEditingVehicle(null);
    } else {
      const stockId = `STK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      onAddVehicle({
        stockId,
        make: formData.make || 'Toyota',
        model: formData.model || 'Corolla',
        variant: formData.variant || '',
        registrationNo: formData.registrationNo || '',
        registrationCity: formData.registrationCity || 'Karachi',
        modelYear: formData.modelYear || new Date().getFullYear(),
        registrationYear: formData.registrationYear || new Date().getFullYear(),
        colour: formData.colour || 'White',
        engineNo: formData.engineNo || '',
        chassisNo: formData.chassisNo || '',
        engineCapacity: formData.engineCapacity || '1800 cc',
        transmission: formData.transmission || 'Automatic',
        fuelType: formData.fuelType || 'Petrol',
        mileageKm: formData.mileageKm || 0,
        assembly: formData.assembly || 'Local (CKD)',
        smartCardStatus: formData.smartCardStatus || 'Original Available',
        biometricStatus: formData.biometricStatus || 'Available',
        tokenTaxPaidTill: formData.tokenTaxPaidTill || 'June 2026',
        originalPlatesAvailable: formData.originalPlatesAvailable ?? true,
        fileStatus: formData.fileStatus || 'Complete Original File',
        conditionRating: formData.conditionRating || 'Grade A (Excellent)',
        paintDetails: formData.paintDetails || 'Bumper to Bumper Genuine',
        costPrice: formData.costPrice || 0,
        demandPrice: formData.demandPrice || 0,
        status: formData.status || 'Available',
        images: formData.images || ['https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80'],
        notes: formData.notes || ''
      });
    }

    setShowAddModal(false);
  };

  const openEditModal = (item: VehicleInventoryItem) => {
    setEditingVehicle(item);
    setFormData(item);
    setShowAddModal(true);
  };

  const handleDeleteWithArchiveWarning = (item: VehicleInventoryItem) => {
    const isLinkedToLetter = letters.some(l => l.vehicle.registrationNo === item.registrationNo || l.inventoryVehicleId === item.id);

    let message = `Are you sure you want to delete ${item.make} ${item.model} (${item.registrationNo}) from Active Showroom Inventory?`;
    if (isLinkedToLetter) {
      message += `\n\nNote: Sell Letters created for this vehicle will REMAIN 100% SAFE and intact in the Sell Letters Archive with full original vehicle particulars preserved.`;
    }

    if (confirm(message)) {
      onDeleteVehicle(item.id);
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Car className="w-3.5 h-3.5" /> Used Vehicles Stock &amp; Inventory Manager (Pakistani Market)
          </div>
          <h1 className="text-2xl font-bold font-serif text-white">
            Showroom Vehicle Inventory
          </h1>
          <p className="text-slate-400 text-xs mt-1 max-w-2xl">
            Manage Pakistani market used cars stock, Smart Card &amp; Biometric status, paint condition, purchase cost vs demand price, and quick sell letter integration.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingVehicle(null);
            setFormData({
              make: 'Honda',
              model: 'Civic',
              variant: '1.8 Oriel',
              registrationNo: 'BAD-102',
              registrationCity: 'Hyderabad',
              modelYear: 2021,
              colour: 'Taffeta White',
              engineNo: 'R18Z1-998201',
              chassisNo: 'FC1-889021',
              engineCapacity: '1800 cc',
              transmission: 'Automatic',
              fuelType: 'Petrol',
              mileageKm: 32000,
              assembly: 'Local (CKD)',
              smartCardStatus: 'Original Available',
              biometricStatus: 'Available',
              tokenTaxPaidTill: 'June 2026',
              originalPlatesAvailable: true,
              fileStatus: 'Complete Original File',
              conditionRating: 'Grade A (Excellent)',
              paintDetails: 'Bumper-to-Bumper Original',
              costPrice: 5100000,
              demandPrice: 5550000,
              status: 'Available',
              images: ['https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80']
            });
            setShowAddModal(true);
          }}
          id="btn-add-inventory-car"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Vehicle to Stock
        </button>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Cars in Stock</span>
          <span className="text-2xl font-black text-white mt-1 block">{totalStock} Units</span>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Available for Sale</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">{availableStock} Vehicles</span>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Reserved / Token Advance</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">{reservedStock} Units</span>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Active Stock Demanded Value</span>
          <span className="text-xl font-black text-indigo-300 mt-1 block">
            Rs. {(totalDemandValue / 100000).toFixed(1)} Lakh
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by Make, Reg No, Chassis, Stock ID..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:border-indigo-500 focus:outline-none"
            >
              <option value="All">All Status ({inventory.length})</option>
              <option value="Available">Available ({availableStock})</option>
              <option value="Reserved">Reserved ({reservedStock})</option>
              <option value="Sold">Sold ({soldStock})</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Make:</span>
            <select
              value={makeFilter}
              onChange={e => setMakeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:border-indigo-500 focus:outline-none"
            >
              <option value="All">All Makes</option>
              {uniqueMakes.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Vehicles Inventory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInventory.map((item) => (
          <div 
            key={item.id} 
            className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image & Status Header */}
              <div className="h-48 bg-slate-950 relative overflow-hidden group">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80'}
                  alt={`${item.make} ${item.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur-xs text-white border border-slate-700">
                    {item.stockId}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs border ${
                    item.status === 'Available' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    item.status === 'Reserved' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    'bg-slate-500/20 text-slate-300 border-slate-500/30'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500 text-slate-950 shadow-md">
                    {item.registrationNo}
                  </span>
                </div>
              </div>

              {/* Title & Key Specs */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-base font-bold text-white font-serif">
                    {item.make} {item.model} <span className="text-xs font-normal text-slate-400">({item.modelYear})</span>
                  </h3>
                  <p className="text-xs text-indigo-400 font-semibold mt-0.5">
                    {item.variant}
                  </p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.mileageKm.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.fuelType} | {item.transmission}</span>
                  </div>
                  <div className="col-span-2 text-slate-400 text-[10px]">
                    City: <span className="text-slate-200 font-semibold">{item.registrationCity}</span> | Color: <span className="text-slate-200 font-semibold">{item.colour}</span>
                  </div>
                </div>

                {/* Pakistani Documents Badges */}
                <div className="space-y-1.5 text-[11px] border-t border-slate-800/80 pt-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Smart Card / Book:</span>
                    <span className="font-semibold text-emerald-400">{item.smartCardStatus}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Biometric Status:</span>
                    <span className="font-semibold text-amber-400">{item.biometricStatus}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Token Tax Paid:</span>
                    <span className="font-semibold text-slate-200">{item.tokenTaxPaidTill}</span>
                  </div>
                </div>

                {/* Pricing Box */}
                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Demanded Price</span>
                    <span className="text-base font-black text-amber-400">
                      Rs. {(item.demandPrice / 100000).toFixed(2)} Lakh
                    </span>
                  </div>
                  {item.costPrice > 0 && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Cost Price</span>
                      <span className="text-xs font-semibold text-slate-400">
                        Rs. {(item.costPrice / 100000).toFixed(2)} Lakh
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => onCreateLetterForVehicle(item)}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="Create Vehicle Sell / Delivery Letter"
              >
                <FileText className="w-3.5 h-3.5" /> Sell Letter
              </button>

              <button
                onClick={() => setViewingVehicle(item)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="View Full Details"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={() => openEditModal(item)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Edit Vehicle"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDeleteWithArchiveWarning(item)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Delete from Active Inventory"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW VEHICLE MODAL */}
      {viewingVehicle && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-2xl w-full p-6 space-y-5 text-white my-auto shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  {viewingVehicle.stockId}
                </span>
                <h2 className="text-xl font-bold font-serif text-white">
                  {viewingVehicle.make} {viewingVehicle.model} {viewingVehicle.variant}
                </h2>
                <p className="text-xs text-amber-400 font-mono font-semibold">
                  Reg No: {viewingVehicle.registrationNo} ({viewingVehicle.registrationCity})
                </p>
              </div>

              <button
                onClick={() => setViewingVehicle(null)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photos */}
            {viewingVehicle.images?.[0] && (
              <div className="h-56 rounded-xl bg-slate-950 overflow-hidden border border-slate-800">
                <img
                  src={viewingVehicle.images[0]}
                  alt="Vehicle Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Specifications Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">Chassis No</span>
                <span className="font-mono font-bold text-slate-200">{viewingVehicle.chassisNo}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Engine No</span>
                <span className="font-mono font-bold text-slate-200">{viewingVehicle.engineNo}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Engine Capacity</span>
                <span className="font-bold text-slate-200">{viewingVehicle.engineCapacity}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Mileage</span>
                <span className="font-bold text-slate-200">{viewingVehicle.mileageKm.toLocaleString()} km</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Assembly Type</span>
                <span className="font-bold text-slate-200">{viewingVehicle.assembly}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Color</span>
                <span className="font-bold text-slate-200">{viewingVehicle.colour}</span>
              </div>
            </div>

            {/* Pakistani Legal Docs & Transfer Status */}
            <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800 text-xs">
              <h4 className="font-bold text-indigo-400 uppercase text-[10px] tracking-wider">
                Pakistani Verification &amp; Documents Checklist
              </h4>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>• Smart Card: <strong className="text-white">{viewingVehicle.smartCardStatus}</strong></div>
                <div>• Biometric: <strong className="text-amber-400">{viewingVehicle.biometricStatus}</strong></div>
                <div>• Token Tax Paid: <strong className="text-white">{viewingVehicle.tokenTaxPaidTill}</strong></div>
                <div>• File Status: <strong className="text-white">{viewingVehicle.fileStatus}</strong></div>
                <div>• Original Number Plates: <strong className="text-emerald-400">{viewingVehicle.originalPlatesAvailable ? 'Available' : 'Missing'}</strong></div>
                <div>• Body Condition: <strong className="text-white">{viewingVehicle.conditionRating}</strong></div>
              </div>
              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800">
                Paint Details: <span className="text-white font-medium">{viewingVehicle.paintDetails}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  const v = viewingVehicle;
                  setViewingVehicle(null);
                  onCreateLetterForVehicle(v);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" /> Create Delivery Letter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT VEHICLE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 max-w-3xl w-full p-6 space-y-4 text-white my-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold font-serif text-white">
                {editingVehicle ? 'Edit Inventory Vehicle' : 'Add New Vehicle to Showroom Inventory'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Make (Manufacturer)</label>
                  <input
                    type="text"
                    value={formData.make}
                    onChange={e => setFormData({ ...formData, make: e.target.value })}
                    placeholder="e.g. Toyota, Honda, Suzuki, Kia"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Model Name</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g. Corolla, Civic, Alto"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Variant / Grade</label>
                  <input
                    type="text"
                    value={formData.variant}
                    onChange={e => setFormData({ ...formData, variant: e.target.value })}
                    placeholder="e.g. 1.8 Altis Grande, Oriel 1.5"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Registration No</label>
                  <input
                    type="text"
                    value={formData.registrationNo}
                    onChange={e => setFormData({ ...formData, registrationNo: e.target.value })}
                    placeholder="e.g. LEA-21-4902"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-400 font-mono font-bold focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Registration City</label>
                  <input
                    type="text"
                    value={formData.registrationCity}
                    onChange={e => setFormData({ ...formData, registrationCity: e.target.value })}
                    placeholder="e.g. Karachi, Lahore, Islamabad, Hyderabad"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Model Year</label>
                  <input
                    type="number"
                    value={formData.modelYear}
                    onChange={e => setFormData({ ...formData, modelYear: parseInt(e.target.value) || 2022 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Chassis Number</label>
                  <input
                    type="text"
                    value={formData.chassisNo}
                    onChange={e => setFormData({ ...formData, chassisNo: e.target.value })}
                    placeholder="Chassis / Frame No"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-mono text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Engine Number</label>
                  <input
                    type="text"
                    value={formData.engineNo}
                    onChange={e => setFormData({ ...formData, engineNo: e.target.value })}
                    placeholder="Engine Block No"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-mono text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Engine Displacement</label>
                  <input
                    type="text"
                    value={formData.engineCapacity}
                    onChange={e => setFormData({ ...formData, engineCapacity: e.target.value })}
                    placeholder="e.g. 1800 cc, 660 cc"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Transmission</label>
                  <select
                    value={formData.transmission}
                    onChange={e => setFormData({ ...formData, transmission: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fuel Type</label>
                  <select
                    value={formData.fuelType}
                    onChange={e => setFormData({ ...formData, fuelType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Diesel">Diesel</option>
                    <option value="EV">EV</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mileage (km)</label>
                  <input
                    type="number"
                    value={formData.mileageKm}
                    onChange={e => setFormData({ ...formData, mileageKm: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Color</label>
                  <input
                    type="text"
                    value={formData.colour}
                    onChange={e => setFormData({ ...formData, colour: e.target.value })}
                    placeholder="e.g. White, Black"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Showroom Cost Price (PKR)</label>
                  <input
                    type="number"
                    value={formData.costPrice}
                    onChange={e => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="Purchased price"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Demanded / Selling Price (PKR)</label>
                  <input
                    type="number"
                    value={formData.demandPrice}
                    onChange={e => setFormData({ ...formData, demandPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="Asking price"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-400 font-bold focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stock Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Biometric Status</label>
                  <select
                    value={formData.biometricStatus}
                    onChange={e => setFormData({ ...formData, biometricStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="In Process">In Process</option>
                    <option value="Open Letter">Open Letter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Smart Card Status</label>
                  <select
                    value={formData.smartCardStatus}
                    onChange={e => setFormData({ ...formData, smartCardStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Original Available">Original Available</option>
                    <option value="Duplicate Book">Duplicate Book</option>
                    <option value="Applied / Pending">Applied / Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Paint Condition &amp; Body Details</label>
                <input
                  type="text"
                  value={formData.paintDetails}
                  onChange={e => setFormData({ ...formData, paintDetails: e.target.value })}
                  placeholder="e.g. Bumper-to-Bumper Original / 2 Pieces Spray Touchup"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-save-vehicle-inventory"
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg cursor-pointer"
                >
                  Save Vehicle Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
