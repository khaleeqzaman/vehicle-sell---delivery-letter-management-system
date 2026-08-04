import React, { useState } from 'react';
import { ClientProfile, ClientDocument, SellLetterDocument, VehicleInventoryItem, ShowroomSettings } from '../types';
import { 
  X, 
  CreditCard, 
  Phone, 
  MapPin, 
  FileText, 
  Upload, 
  Trash2, 
  Eye, 
  Plus, 
  Car, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  Download,
  Printer,
  Copy,
  Check,
  Building,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

interface ClientProfileModalProps {
  client: ClientProfile;
  letters: SellLetterDocument[];
  inventory: VehicleInventoryItem[];
  showroom?: ShowroomSettings;
  onClose: () => void;
  onUpdateClient: (updated: ClientProfile) => void;
  onAddDocument: (clientId: string, doc: { title: string; type: ClientDocument['type']; fileUrl: string; fileName: string }) => void;
  onDeleteDocument: (clientId: string, docId: string) => void;
  onSelectLetterForPrint?: (letter: SellLetterDocument) => void;
}

export const ClientProfileModal: React.FC<ClientProfileModalProps> = ({
  client,
  letters,
  inventory,
  showroom,
  onClose,
  onUpdateClient,
  onAddDocument,
  onDeleteDocument,
  onSelectLetterForPrint
}) => {
  const [activeTab, setActiveTab] = useState<'ledger' | 'documents' | 'edit'>('ledger');
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // New Document Upload State
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<ClientDocument['type']>('cnic_front');
  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // Edit Client State
  const [editForm, setEditForm] = useState({
    name: client.name,
    fatherName: client.fatherName,
    cnic: client.cnic,
    phone: client.phone,
    phone2: client.phone2 || '',
    address: client.address,
    role: client.role,
    notes: client.notes || ''
  });

  // Calculate Client Ledger Transactions
  const boughtLetters = letters.filter(l => l.purchaser.cnic === client.cnic);
  const soldLetters = letters.filter(l => l.seller.cnic === client.cnic);

  const totalBoughtAmount = boughtLetters.reduce((acc, curr) => acc + (curr.payment.sumInDigits || 0), 0);
  const totalSoldAmount = soldLetters.reduce((acc, curr) => acc + (curr.payment.sumInDigits || 0), 0);
  const totalPendingBalance = [...boughtLetters, ...soldLetters].reduce((acc, curr) => acc + (curr.payment.balance || 0), 0);

  // Combine and sort ledger entries by date
  const ledgerEntries = [
    ...boughtLetters.map(l => ({
      id: l.id,
      date: l.date,
      type: 'BOUGHT' as const,
      role: 'Purchaser (Buyer)',
      vehicleReg: l.vehicle.registrationNo,
      vehicleMakeModel: `${l.vehicle.make} ${l.vehicle.model}`,
      amount: l.payment.sumInDigits,
      balance: l.payment.balance,
      serialNo: l.serialNo,
      letterObj: l
    })),
    ...soldLetters.map(l => ({
      id: l.id,
      date: l.date,
      type: 'SOLD' as const,
      role: 'Seller',
      vehicleReg: l.vehicle.registrationNo,
      vehicleMakeModel: `${l.vehicle.make} ${l.vehicle.model}`,
      amount: l.payment.sumInDigits,
      balance: l.payment.balance,
      serialNo: l.serialNo,
      letterObj: l
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 1. Export CSV Handler
  const handleExportCSV = () => {
    const headers = ["Date", "Transaction Type", "Vehicle Particulars", "Reg No", "Serial No", "Amount (PKR)", "Outstanding Balance (PKR)"];
    const rows = ledgerEntries.map(e => [
      `"${e.date}"`,
      `"${e.role}"`,
      `"${e.vehicleMakeModel.replace(/"/g, '""')}"`,
      `"${e.vehicleReg}"`,
      `"${e.serialNo}"`,
      e.amount || 0,
      e.balance || 0
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + 
      `Client Ledger Statement: ${client.name} (CNIC: ${client.cnic})\n` +
      `Phone 1: ${client.phone} | Phone 2: ${client.phone2 || 'N/A'}\n` +
      `Address: ${client.address || 'N/A'}\n\n` +
      [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Ledger_${client.name.replace(/\s+/g, '_')}_${client.cnic}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Copy Ledger Summary to Clipboard
  const handleCopySummary = () => {
    let summaryText = `===================================\n`;
    summaryText += `SHOWROOM CLIENT LEDGER STATEMENT\n`;
    summaryText += `Client Name: ${client.name}\n`;
    summaryText += `S/O: ${client.fatherName || 'N/A'}\n`;
    summaryText += `CNIC: ${client.cnic}\n`;
    summaryText += `Primary Phone: ${client.phone}\n`;
    if (client.phone2) summaryText += `Secondary Phone: ${client.phone2}\n`;
    summaryText += `Address: ${client.address || 'N/A'}\n`;
    summaryText += `-----------------------------------\n`;
    summaryText += `SUMMARY:\n`;
    summaryText += `Total Deals: ${ledgerEntries.length} Vehicle(s)\n`;
    summaryText += `Total Purchased: PKR ${totalBoughtAmount.toLocaleString('en-PK')}\n`;
    summaryText += `Total Sold: PKR ${totalSoldAmount.toLocaleString('en-PK')}\n`;
    summaryText += `Outstanding Balance: PKR ${totalPendingBalance.toLocaleString('en-PK')}\n`;
    summaryText += `-----------------------------------\n`;
    summaryText += `DEAL HISTORY:\n`;
    
    ledgerEntries.forEach((e, idx) => {
      summaryText += `${idx + 1}. [${e.date}] ${e.type} - ${e.vehicleMakeModel} (${e.vehicleReg}) | Price: PKR ${e.amount.toLocaleString('en-PK')} | Bal: PKR ${e.balance.toLocaleString('en-PK')} | Serial: ${e.serialNo}\n`;
    });
    summaryText += `===================================`;

    navigator.clipboard.writeText(summaryText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (!docTitle) {
        const cleanTitle = file.name.split('.')[0].replace(/[-_]/g, ' ');
        setDocTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileBase64) {
      alert('Please select a file or document photo first.');
      return;
    }
    setIsUploading(true);
    onAddDocument(client.id, {
      title: docTitle || 'Client Document Scan',
      type: docType,
      fileUrl: fileBase64,
      fileName: fileName || 'document.jpg'
    });

    // Reset upload state
    setDocTitle('');
    setFileBase64('');
    setFileName('');
    setIsUploading(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateClient({
      ...client,
      ...editForm
    });
    alert('Client profile updated successfully!');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden text-white my-auto flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xl">
              {client.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-serif">{client.name}</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {client.role === 'both' ? 'Buyer & Seller' : client.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                S/O: <span className="text-slate-200">{client.fatherName || 'N/A'}</span> | 
                CNIC: <span className="font-mono font-semibold text-amber-400 ml-1">{client.cnic}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Contact & Info Bar */}
        <div className="bg-slate-900/80 border-b border-slate-800 px-6 py-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2 sm:col-span-2">
            <Phone className="w-3.5 h-3.5 text-indigo-400 flex-none" />
            <span>
              <strong className="text-slate-400">Primary:</strong> {client.phone || 'N/A'}
              {client.phone2 && <span className="ml-3"><strong className="text-slate-400">Secondary:</strong> {client.phone2}</span>}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-none" />
            <span className="truncate">{client.address || 'No address recorded'}</span>
          </div>
        </div>

        {/* Ledger & Stats Header Cards */}
        <div className="p-6 bg-slate-950/40 grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-slate-800">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total Deals</span>
            <span className="text-lg font-bold text-white mt-0.5 block">{ledgerEntries.length} Vehicles</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-emerald-400 font-semibold uppercase block flex items-center gap-1">
              <ArrowDownLeft className="w-3 h-3" /> Purchased (Bought)
            </span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
              Rs. {(totalBoughtAmount / 100000).toFixed(2)} Lakh ({boughtLetters.length})
            </span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-indigo-400 font-semibold uppercase block flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> Vehicles Sold
            </span>
            <span className="text-sm font-bold text-indigo-300 mt-0.5 block">
              Rs. {(totalSoldAmount / 100000).toFixed(2)} Lakh ({soldLetters.length})
            </span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-amber-400 font-semibold uppercase block">Documents Attached</span>
            <span className="text-lg font-bold text-amber-400 mt-0.5 block">
              {client.documents?.length || 0} File(s)
            </span>
          </div>
        </div>

        {/* Tabs Switcher */}
        <div className="flex items-center space-x-2 px-6 pt-4 border-b border-slate-800 bg-slate-900">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'ledger'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800/80'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" /> Client Ledger / Account History
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'documents'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800/80'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Client CNIC &amp; Documents ({client.documents?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'edit'
                ? 'border-indigo-500 text-indigo-400 bg-slate-800/80'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" /> Edit Profile Info
          </button>
        </div>

        {/* Modal Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: LEDGER & ACCOUNT HISTORY */}
          {activeTab === 'ledger' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white font-serif flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" /> Vehicle Purchase &amp; Sale History Ledger
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Complete record of all sell letters and vehicle transactions for {client.name}.
                  </p>
                </div>

                {/* EXPORT LEDGER BUTTON GROUP */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    title="Export Ledger to Excel CSV File"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> CSV Excel
                  </button>

                  <button
                    onClick={handleCopySummary}
                    title="Copy Ledger Text Statement to Clipboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold text-xs transition-colors cursor-pointer"
                  >
                    {copiedNotification ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Summary
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowPrintModal(true)}
                    title="Print Formal Ledger Statement PDF"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Statement
                  </button>
                </div>
              </div>

              {ledgerEntries.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/50 rounded-2xl border border-slate-800 text-slate-400">
                  <Car className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                  <p className="text-xs font-medium">No vehicle delivery letter recorded yet for this client.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Type / Role</th>
                        <th className="px-4 py-3">Vehicle Particulars</th>
                        <th className="px-4 py-3">Serial No</th>
                        <th className="px-4 py-3">Amount (PKR)</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {ledgerEntries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 py-3 font-mono text-slate-300">
                            {entry.date}
                          </td>
                          <td className="px-4 py-3">
                            {entry.type === 'BOUGHT' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                                <ArrowDownLeft className="w-3 h-3" /> BOUGHT (Buyer)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold text-[10px]">
                                <ArrowUpRight className="w-3 h-3" /> SOLD (Seller)
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-white block">{entry.vehicleMakeModel}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-mono font-bold inline-block mt-0.5">
                              {entry.vehicleReg}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono font-semibold text-slate-300">
                            {entry.serialNo}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-white block">
                              Rs. {entry.amount ? entry.amount.toLocaleString('en-PK') : '0'}
                            </span>
                            {entry.balance > 0 ? (
                              <span className="text-[10px] text-amber-400 font-semibold">
                                Bal: Rs. {entry.balance.toLocaleString('en-PK')}
                              </span>
                            ) : (
                              <span className="text-[10px] text-emerald-400 font-semibold">Fully Cleared</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {onSelectLetterForPrint && (
                              <button
                                onClick={() => {
                                  onSelectLetterForPrint(entry.letterObj);
                                  onClose();
                                }}
                                className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                View Letter
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CLIENT CNIC & DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              {/* Document Upload Form */}
              <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white font-serif flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-400" /> Upload New Document (CNIC, Biometric, Driving License, etc.)
                </h3>

                <form onSubmit={handleUploadSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Document Title</label>
                    <input
                      type="text"
                      value={docTitle}
                      onChange={e => setDocTitle(e.target.value)}
                      placeholder="e.g. CNIC Front Side"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Document Category</label>
                    <select
                      value={docType}
                      onChange={e => setDocType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="cnic_front">CNIC Front Copy</option>
                      <option value="cnic_back">CNIC Back Copy</option>
                      <option value="biometric_slip">NADRA Biometric Slip</option>
                      <option value="license">Driving License</option>
                      <option value="agreement_scan">Sale Agreement Scan</option>
                      <option value="other">Other Document</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Select File / Take Photo</label>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div className="sm:col-span-3 flex items-center justify-end pt-2 border-t border-slate-800/80">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Attach Document to Client
                    </button>
                  </div>
                </form>
              </div>

              {/* Uploaded Documents Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Attached Client Documents ({client.documents?.length || 0})
                </h3>

                {(!client.documents || client.documents.length === 0) ? (
                  <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800/80 text-slate-500 text-xs">
                    No documents uploaded yet. Use the upload box above to add CNIC scans or biometric slips.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {client.documents.map((doc) => (
                      <div key={doc.id} className="bg-slate-950 rounded-xl border border-slate-800 p-3 space-y-3 relative group">
                        <div className="h-36 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center relative">
                          {doc.fileUrl.startsWith('data:image') || doc.fileUrl.startsWith('http') ? (
                            <img
                              src={doc.fileUrl}
                              alt={doc.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <FileText className="w-12 h-12 text-slate-600" />
                          )}

                          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedImageModal(doc.fileUrl)}
                              className="p-2 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-indigo-500 cursor-pointer"
                            >
                              <Eye className="w-4 h-4" /> View
                            </button>
                          </div>
                        </div>

                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 block w-fit mb-1">
                              {doc.type.replace('_', ' ')}
                            </span>
                            <h4 className="font-bold text-white text-xs truncate max-w-[160px]">{doc.title}</h4>
                            <span className="text-[10px] text-slate-500 block">
                              {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Uploaded'}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              if (confirm(`Delete document "${doc.title}"?`)) {
                                onDeleteDocument(client.id, doc.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: EDIT PROFILE INFO */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Father&apos;s Name (S/O)</label>
                <input
                  type="text"
                  value={editForm.fatherName}
                  onChange={e => setEditForm({ ...editForm, fatherName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">CNIC Number</label>
                <input
                  type="text"
                  value={editForm.cnic}
                  onChange={e => setEditForm({ ...editForm, cnic: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-400 font-mono font-bold focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone 1 (Primary)</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. 0300-9876543"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone 2 (Secondary)</label>
                  <input
                    type="text"
                    value={editForm.phone2}
                    onChange={e => setEditForm({ ...editForm, phone2: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. 0312-3456789"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Residential Address</label>
                <textarea
                  rows={2}
                  value={editForm.address}
                  onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Role Type</label>
                <select
                  value={editForm.role}
                  onChange={e => setEditForm({ ...editForm, role: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="both">Both Purchaser &amp; Seller</option>
                  <option value="purchaser">Purchaser Only</option>
                  <option value="seller">Seller Only</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="e.g. VIP client, prefers bank transfer..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg transition-colors cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Lightbox Image Preview Modal */}
      {selectedImageModal && (
        <div className="fixed inset-0 bg-black/90 z-60 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-2">
            <button
              onClick={() => setSelectedImageModal(null)}
              className="absolute top-4 right-4 p-2 bg-slate-950 text-white rounded-full hover:bg-slate-800 cursor-pointer shadow-lg z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImageModal}
              alt="Document Full View"
              className="max-w-full max-h-[85vh] object-contain mx-auto rounded-xl"
            />
          </div>
        </div>
      )}

      {/* FORMAL PRINTABLE LEDGER STATEMENT MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-70 flex items-center justify-center p-2 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full p-8 space-y-6 my-auto print:shadow-none print:p-0 print:max-w-none print:w-full print:rounded-none">
            
            {/* Modal Controls Bar (Hidden in Print) */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-indigo-600" />
                <span className="font-bold text-sm text-slate-800">Printable Client Ledger Statement</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Print / Save PDF
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE DOCUMENT BODY */}
            <div className="space-y-6 font-sans">
              {/* Showroom Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <div className="flex items-center gap-4">
                  {showroom?.logoUrl ? (
                    <img src={showroom.logoUrl} alt="Showroom Logo" className="w-16 h-16 object-cover rounded-xl border border-slate-300" />
                  ) : (
                    <div className="w-16 h-16 bg-slate-900 text-amber-400 font-serif font-black text-2xl flex items-center justify-center rounded-xl">
                      IM
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-black font-serif uppercase tracking-tight text-slate-900">
                      {showroom?.name || "INFINITY MOTORS"}
                    </h1>
                    <p className="text-xs font-semibold text-slate-600">{showroom?.tagline || "Trusted Deals · Verified Vehicles"}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{showroom?.addressLine1}, {showroom?.addressLine2}</p>
                    <p className="text-[11px] text-slate-500 font-mono">Contact: {showroom?.contactNo || "0313-3356592"}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 bg-slate-900 text-amber-400 text-xs font-bold uppercase rounded-lg inline-block">
                    Official Statement
                  </span>
                  <p className="text-xs font-bold text-slate-700 mt-2">Statement Date:</p>
                  <p className="text-xs font-mono font-semibold text-slate-900">{new Date().toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Statement Title */}
              <div className="text-center py-2 bg-slate-100 rounded-xl border border-slate-200">
                <h2 className="text-base font-bold font-serif uppercase tracking-wider text-slate-900">
                  CLIENT ACCOUNT LEDGER STATEMENT
                </h2>
              </div>

              {/* Client Profile Header */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800">
                <div className="space-y-1">
                  <p><strong>Client Name:</strong> <span className="font-bold text-slate-900">{client.name}</span></p>
                  <p><strong>Father&apos;s Name (S/O):</strong> {client.fatherName || 'N/A'}</p>
                  <p><strong>CNIC Number:</strong> <span className="font-mono font-bold text-indigo-700">{client.cnic}</span></p>
                  <p><strong>Account Category:</strong> <span className="uppercase font-semibold text-slate-700">{client.role}</span></p>
                </div>
                <div className="space-y-1">
                  <p><strong>Primary Phone 1:</strong> <span className="font-semibold">{client.phone || 'N/A'}</span></p>
                  <p><strong>Secondary Phone 2:</strong> <span className="font-semibold">{client.phone2 || 'N/A'}</span></p>
                  <p><strong>Residential Address:</strong> {client.address || 'N/A'}</p>
                </div>
              </div>

              {/* Metrics Summary Grid */}
              <div className="grid grid-cols-4 gap-3 text-center text-xs">
                <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Deals</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{ledgerEntries.length} Vehicles</span>
                </div>
                <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">Purchased Volume</span>
                  <span className="font-bold text-emerald-800 text-sm mt-0.5 block">PKR {totalBoughtAmount.toLocaleString('en-PK')}</span>
                </div>
                <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-200">
                  <span className="text-[10px] uppercase font-bold text-indigo-700 block">Sold Volume</span>
                  <span className="font-bold text-indigo-800 text-sm mt-0.5 block">PKR {totalSoldAmount.toLocaleString('en-PK')}</span>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-amber-700 block">Outstanding Balance</span>
                  <span className="font-bold text-amber-800 text-sm mt-0.5 block">PKR {totalPendingBalance.toLocaleString('en-PK')}</span>
                </div>
              </div>

              {/* Transactions Ledger Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Itemized Vehicle Transactions History
                </h3>

                <table className="w-full text-left text-xs border border-slate-300 rounded-lg overflow-hidden">
                  <thead className="bg-slate-900 text-white text-[10px] uppercase font-bold tracking-wider">
                    <tr>
                      <th className="p-2.5 border-b border-slate-300">Date</th>
                      <th className="p-2.5 border-b border-slate-300">Type</th>
                      <th className="p-2.5 border-b border-slate-300">Vehicle Description</th>
                      <th className="p-2.5 border-b border-slate-300">Reg No</th>
                      <th className="p-2.5 border-b border-slate-300">Serial No</th>
                      <th className="p-2.5 border-b border-slate-300 text-right">Price (PKR)</th>
                      <th className="p-2.5 border-b border-slate-300 text-right">Balance (PKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {ledgerEntries.map((e, idx) => (
                      <tr key={e.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        <td className="p-2.5 font-mono text-slate-700">{e.date}</td>
                        <td className="p-2.5 font-bold">
                          {e.type === 'BOUGHT' ? (
                            <span className="text-emerald-700">PURCHASE</span>
                          ) : (
                            <span className="text-indigo-700">SALE</span>
                          )}
                        </td>
                        <td className="p-2.5 font-semibold text-slate-900">{e.vehicleMakeModel}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-900">{e.vehicleReg}</td>
                        <td className="p-2.5 font-mono text-slate-600">{e.serialNo}</td>
                        <td className="p-2.5 font-bold text-right">Rs. {e.amount.toLocaleString('en-PK')}</td>
                        <td className="p-2.5 font-bold text-right text-amber-800">
                          {e.balance > 0 ? `Rs. ${e.balance.toLocaleString('en-PK')}` : 'CLEARED'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Declaration Note & Signatures */}
              <div className="pt-6 space-y-8 border-t border-slate-200">
                <p className="text-[11px] text-slate-500 italic text-center">
                  &quot;This account statement is computer-generated from the official sales letter archives of {showroom?.name || "Infinity Motors"} and accurately lists all recorded vehicle sell contracts.&quot;
                </p>

                <div className="flex items-center justify-between pt-8 text-xs font-bold text-slate-800">
                  <div className="text-center w-48 border-t border-slate-400 pt-1">
                    <p>Client Signature</p>
                    <p className="text-[10px] font-normal text-slate-500">({client.name})</p>
                  </div>
                  <div className="text-center w-48 border-t border-slate-400 pt-1">
                    <p>Showroom Manager Signature</p>
                    <p className="text-[10px] font-normal text-slate-500">({showroom?.name || "Infinity Motors"})</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
