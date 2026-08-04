import React, { useState } from 'react';
import { SellLetterDocument } from '../types';
import { 
  FileText, 
  Search, 
  Printer, 
  Edit, 
  Trash2, 
  PlusCircle, 
  Filter, 
  Copy, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface LetterListProps {
  letters: SellLetterDocument[];
  onSelectLetter: (letter: SellLetterDocument) => void;
  onEditLetter: (letter: SellLetterDocument) => void;
  onDeleteLetter: (id: string) => void;
  onNewLetter: () => void;
}

export const LetterList: React.FC<LetterListProps> = ({
  letters,
  onSelectLetter,
  onEditLetter,
  onDeleteLetter,
  onNewLetter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLetters = letters.filter(l => {
    const matchesSearch = 
      l.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.vehicle.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.purchaser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.purchaser.cnic.includes(searchTerm) ||
      l.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.seller.cnic.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-white">
      {/* Header & Controls */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" /> Sell &amp; Delivery Letters Archives
          </div>
          <h1 className="text-xl font-bold font-serif text-white">
            Delivery Letters Records &amp; Archives
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable archives of all issued vehicle sell letters with complete snapshot history.
          </p>
        </div>
        <button
          onClick={onNewLetter}
          id="btn-archive-create-new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Create New Letter
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
            placeholder="Search by Reg No, Serial, CNIC, Buyer/Seller Name..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-800 rounded-xl bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-800 rounded-xl bg-slate-950 text-white font-medium focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses ({letters.length})</option>
            <option value="completed">Completed / Fully Paid</option>
            <option value="pending_balance">Pending Balance</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Letters Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
        {filteredLetters.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <FileText className="w-12 h-12 mx-auto text-slate-700" />
            <p className="text-sm font-semibold text-slate-300">No Delivery Letters Found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No vehicle sell letters match your search criteria. Try clearing search filters or create a new letter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Serial &amp; Reg No</th>
                  <th className="px-4 py-3">Vehicle Info</th>
                  <th className="px-4 py-3">Purchaser (Buyer)</th>
                  <th className="px-4 py-3">Seller</th>
                  <th className="px-4 py-3">Amount &amp; Balance</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredLetters.map((letter) => (
                  <tr key={letter.id} className="hover:bg-slate-950/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-white block">{letter.serialNo}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold font-mono inline-block mt-0.5 uppercase">
                        {letter.vehicle.registrationNo || 'UNREGISTERED'}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {letter.date}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-white block">
                        {letter.vehicle.make} {letter.vehicle.model}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Color: {letter.vehicle.colour} | {letter.vehicle.engineCapacity}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block">
                        Chassis: {letter.vehicle.chassisNo || 'N/A'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-200 block">
                        {letter.purchaser.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        CNIC: {letter.purchaser.cnic}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Ph: {letter.purchaser.phone}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-slate-200 block">
                        {letter.seller.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        CNIC: {letter.seller.cnic}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-white block text-sm">
                        Rs. {letter.payment.sumInDigits ? letter.payment.sumInDigits.toLocaleString('en-PK') : '0'}
                      </span>
                      {letter.payment.balance > 0 ? (
                        <span className="text-[10px] text-amber-400 font-bold block">
                          Bal: Rs. {letter.payment.balance.toLocaleString('en-PK')}
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-bold block">
                          Fully Paid
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      {letter.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold">
                          <AlertCircle className="w-3 h-3" /> Pending Bal
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => onSelectLetter(letter)}
                        id={`btn-list-print-${letter.id}`}
                        title="Print 2-Page Letter"
                        className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors inline-block cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEditLetter(letter)}
                        id={`btn-list-edit-${letter.id}`}
                        title="Edit Letter Data"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors inline-block cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete delivery letter ${letter.serialNo}?`)) {
                            onDeleteLetter(letter.id);
                          }
                        }}
                        id={`btn-list-delete-${letter.id}`}
                        title="Delete Letter"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-400 transition-colors inline-block cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
