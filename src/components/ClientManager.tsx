import React, { useState } from 'react';
import { ClientProfile, ClientDocument, SellLetterDocument, VehicleInventoryItem, ShowroomSettings } from '../types';
import { ClientProfileModal } from './ClientProfileModal';
import { 
  Users, 
  UserPlus, 
  Search, 
  Phone, 
  MapPin, 
  CreditCard, 
  FileText, 
  Trash2, 
  ShieldCheck,
  Building,
  Upload,
  Eye,
  Clock,
  ArrowRight
} from 'lucide-react';

interface ClientManagerProps {
  clients: ClientProfile[];
  letters: SellLetterDocument[];
  inventory: VehicleInventoryItem[];
  showroom?: ShowroomSettings;
  onAddClient: (client: Omit<ClientProfile, 'id' | 'createdAt' | 'totalTransactions' | 'totalVolume'>) => void;
  onUpdateClient: (updated: ClientProfile) => void;
  onDeleteClient: (id: string) => void;
  onAddDocument: (clientId: string, doc: { title: string; type: ClientDocument['type']; fileUrl: string; fileName: string }) => void;
  onDeleteDocument: (clientId: string, docId: string) => void;
  onSelectLetterForPrint?: (letter: SellLetterDocument) => void;
}

export const ClientManager: React.FC<ClientManagerProps> = ({
  clients,
  letters,
  inventory,
  showroom,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  onAddDocument,
  onDeleteDocument,
  onSelectLetterForPrint
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'purchaser' | 'seller'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClientForProfile, setSelectedClientForProfile] = useState<ClientProfile | null>(null);

  const [newClient, setNewClient] = useState({
    name: '',
    fatherName: '',
    cnic: '',
    phone: '',
    phone2: '',
    address: '',
    role: 'both' as 'purchaser' | 'seller' | 'both'
  });

  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cnic.includes(searchTerm) ||
      c.phone.includes(searchTerm) ||
      (c.phone2 && c.phone2.includes(searchTerm)) ||
      c.fatherName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || c.role === roleFilter || c.role === 'both';
    return matchesSearch && matchesRole;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.cnic) {
      alert("Name and CNIC are required");
      return;
    }
    onAddClient(newClient);
    setShowAddModal(false);
    setNewClient({
      name: '',
      fatherName: '',
      cnic: '',
      phone: '',
      phone2: '',
      address: '',
      role: 'both'
    });
  };

  return (
    <div className="space-y-6 text-white">
      {/* Top Header */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" /> Client Directory &amp; Ledger Records
          </div>
          <h1 className="text-xl font-bold font-serif text-white">
            Buyers &amp; Sellers Account Ledgers (CRM)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Individual client accounts, transaction ledger histories, CNIC front/back document attachments, and contact directories.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          id="btn-add-client-modal"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Add New Client
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by Name, CNIC, Phone or Father Name..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-800 rounded-xl bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as any)}
            className="px-3 py-1.5 text-xs border border-slate-800 rounded-xl bg-slate-950 text-white font-medium focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">All Clients ({clients.length})</option>
            <option value="purchaser">Purchasers (Buyers)</option>
            <option value="seller">Sellers</option>
          </select>
        </div>
      </div>

      {/* Grid of Clients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => {
          const docCount = client.documents?.length || 0;
          return (
            <div 
              key={client.id} 
              className="bg-slate-900 rounded-2xl border border-slate-800 shadow-md p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {client.role === 'both' ? 'Buyer & Seller' : client.role}
                    </span>
                    <h3 className="text-base font-bold text-white font-serif mt-1.5">
                      {client.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      S/O: {client.fatherName || 'N/A'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Remove client ${client.name}?`)) {
                        onDeleteClient(client.id);
                      }
                    }}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Delete Client"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400 flex-none" />
                    <span className="font-mono font-bold text-amber-400">{client.cnic}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500 flex-none" />
                    <span>
                      {client.phone || 'No phone'}
                      {client.phone2 ? ` · ${client.phone2}` : ''}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 flex-none mt-0.5" />
                    <span className="text-[11px] text-slate-400 leading-tight">
                      {client.address || 'No address recorded'}
                    </span>
                  </div>
                </div>

                {/* Summary Badges */}
                <div className="pt-2 flex items-center justify-between text-[11px] bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Total Deals</span>
                    <span className="font-bold text-white">{client.totalTransactions || 0} Vehicle(s)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Volume</span>
                    <span className="font-bold text-indigo-300">
                      Rs. {((client.totalVolume || 0) / 100000).toFixed(1)} Lakh
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">CNIC / Docs</span>
                    <span className="font-bold text-amber-400 flex items-center gap-1 justify-end">
                      <Upload className="w-3 h-3" /> {docCount} Attached
                    </span>
                  </div>
                </div>
              </div>

              {/* View Profile / Ledger Button */}
              <button
                onClick={() => setSelectedClientForProfile(client)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-700/60"
              >
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> View Ledger &amp; Documents <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* ADD CLIENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-bold font-serif text-white border-b border-slate-800 pb-2">
              Add New Client to CRM Directory
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Muhammad Ali Raza"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Father&apos;s Name (S/O)</label>
                <input
                  type="text"
                  value={newClient.fatherName}
                  onChange={e => setNewClient({ ...newClient, fatherName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Tariq Mahmood"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">CNIC Number</label>
                <input
                  type="text"
                  value={newClient.cnic}
                  onChange={e => setNewClient({ ...newClient, cnic: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-400 font-mono font-bold focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. 41304-1234567-1"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone 1 (Primary)</label>
                  <input
                    type="text"
                    value={newClient.phone}
                    onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. 0300-9876543"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone 2 (Secondary)</label>
                  <input
                    type="text"
                    value={newClient.phone2}
                    onChange={e => setNewClient({ ...newClient, phone2: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. 0312-3456789"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Residential Address</label>
                <textarea
                  rows={2}
                  value={newClient.address}
                  onChange={e => setNewClient({ ...newClient, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Wadhu Wah Road, Hyderabad"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Role Type</label>
                <select
                  value={newClient.role}
                  onChange={e => setNewClient({ ...newClient, role: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="both">Both Purchaser &amp; Seller</option>
                  <option value="purchaser">Purchaser Only</option>
                  <option value="seller">Seller Only</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-save-new-client"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-md cursor-pointer"
                >
                  Save Client Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLIENT PROFILE & LEDGER MODAL */}
      {selectedClientForProfile && (
        <ClientProfileModal
          client={selectedClientForProfile}
          letters={letters}
          inventory={inventory}
          showroom={showroom}
          onClose={() => setSelectedClientForProfile(null)}
          onUpdateClient={(updated) => {
            onUpdateClient(updated);
            setSelectedClientForProfile(updated);
          }}
          onAddDocument={(clientId, doc) => {
            onAddDocument(clientId, doc);
            // Refresh modal client
            const fresh = clients.find(c => c.id === clientId);
            if (fresh) setSelectedClientForProfile(fresh);
          }}
          onDeleteDocument={(clientId, docId) => {
            onDeleteDocument(clientId, docId);
            const fresh = clients.find(c => c.id === clientId);
            if (fresh) setSelectedClientForProfile(fresh);
          }}
          onSelectLetterForPrint={onSelectLetterForPrint}
        />
      )}
    </div>
  );
};
