import React, { useState, useEffect } from 'react';
import { 
  ShowroomSettings, 
  SellLetterDocument, 
  ClientProfile, 
  MVCModule,
  VehicleInventoryItem,
  ClientDocument
} from './types';
import { 
  defaultShowroomSettings, 
  sampleClients, 
  sampleLetters, 
  sampleMVCModules,
  sampleInventory
} from './data/initialData';

import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { LetterForm } from './components/LetterForm';
import { LetterList } from './components/LetterList';
import { PrintDocumentView } from './components/PrintDocumentView';
import { ClientManager } from './components/ClientManager';
import { VehicleInventoryView } from './components/VehicleInventoryView';
import { ShowroomSettingsView } from './components/ShowroomSettingsView';
import { MVCArchitectureView } from './components/MVCArchitectureView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showroom, setShowroom] = useState<ShowroomSettings>(defaultShowroomSettings);
  const [letters, setLetters] = useState<SellLetterDocument[]>(sampleLetters);
  const [clients, setClients] = useState<ClientProfile[]>(sampleClients);
  const [inventory, setInventory] = useState<VehicleInventoryItem[]>(sampleInventory);
  const [modules, setModules] = useState<MVCModule[]>(sampleMVCModules);

  const [selectedLetterForPrint, setSelectedLetterForPrint] = useState<SellLetterDocument | null>(null);
  const [editingLetter, setEditingLetter] = useState<SellLetterDocument | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial data from Express backend
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [showRes, letRes, cliRes, invRes, modRes] = await Promise.all([
          fetch('/api/showroom').then(r => r.json()),
          fetch('/api/letters').then(r => r.json()),
          fetch('/api/clients').then(r => r.json()),
          fetch('/api/inventory').then(r => r.json()),
          fetch('/api/modules').then(r => r.json())
        ]);

        if (showRes.success && showRes.data) setShowroom(showRes.data);
        if (letRes.success && letRes.data) setLetters(letRes.data);
        if (cliRes.success && cliRes.data) setClients(cliRes.data);
        if (invRes.success && invRes.data) setInventory(invRes.data);
        if (modRes.success && modRes.data) setModules(modRes.data);
      } catch (err) {
        console.warn("Backend API not reachable, using local storage state:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBackendData();
  }, []);

  // Save / Update Letter
  const handleSaveLetter = async (letter: SellLetterDocument) => {
    const isExisting = letters.some(l => l.id === letter.id);
    
    try {
      if (isExisting) {
        await fetch(`/api/letters/${letter.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(letter)
        });
        setLetters(prev => prev.map(l => l.id === letter.id ? letter : l));
      } else {
        const res = await fetch('/api/letters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(letter)
        }).then(r => r.json());
        
        const created = res.data || letter;
        setLetters(prev => [created, ...prev]);
      }
    } catch (err) {
      console.error("Error persisting letter:", err);
      if (isExisting) {
        setLetters(prev => prev.map(l => l.id === letter.id ? letter : l));
      } else {
        setLetters(prev => [letter, ...prev]);
      }
    }

    // Refresh client list & inventory stats
    try {
      const [cliRes, invRes] = await Promise.all([
        fetch('/api/clients').then(r => r.json()),
        fetch('/api/inventory').then(r => r.json())
      ]);
      if (cliRes.success && cliRes.data) setClients(cliRes.data);
      if (invRes.success && invRes.data) setInventory(invRes.data);
    } catch (e) {
      // ignore
    }

    setSelectedLetterForPrint(letter);
    setEditingLetter(null);
    setActiveTab('print-view');
  };

  // Delete Letter
  const handleDeleteLetter = async (id: string) => {
    try {
      await fetch(`/api/letters/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error("Error deleting letter:", err);
    }
    setLetters(prev => prev.filter(l => l.id !== id));
  };

  // Inventory Management Handlers
  const handleAddVehicle = async (vehicleData: Omit<VehicleInventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData)
      }).then(r => r.json());

      if (res.success && res.data) {
        setInventory(prev => [res.data, ...prev]);
      }
    } catch (err) {
      console.error("Error adding vehicle to inventory:", err);
      const newVeh: VehicleInventoryItem = {
        ...vehicleData,
        id: `veh_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setInventory(prev => [newVeh, ...prev]);
    }
  };

  const handleUpdateVehicle = async (vehicle: VehicleInventoryItem) => {
    try {
      await fetch(`/api/inventory/${vehicle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicle)
      });
      setInventory(prev => prev.map(v => v.id === vehicle.id ? vehicle : v));
    } catch (err) {
      console.error("Error updating vehicle:", err);
      setInventory(prev => prev.map(v => v.id === vehicle.id ? vehicle : v));
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error("Error deleting vehicle:", err);
    }
    setInventory(prev => prev.filter(v => v.id !== id));
  };

  // Quick action: Create sell letter pre-filled for an inventory vehicle
  const handleCreateLetterForVehicle = (vehicle: VehicleInventoryItem) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayDay = days[new Date().getDay()];

    const prefilled: SellLetterDocument = {
      id: `let_${Date.now()}`,
      serialNo: `INF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      cplcOperatorNo: showroom.cplcOperatorDefault || "CPLC-HYD-9042",
      date: todayStr,
      time: "04:30 PM",
      inventoryVehicleId: vehicle.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      vehicle: {
        registrationNo: vehicle.registrationNo,
        make: vehicle.make,
        model: `${vehicle.model} ${vehicle.variant}`.trim(),
        colour: vehicle.colour,
        chassisNo: vehicle.chassisNo,
        engineNo: vehicle.engineNo,
        engineCapacity: vehicle.engineCapacity,
        registrationName: "",
        ownerCnic: "",
        bookNo: ""
      },
      delivery: {
        date: todayStr,
        day: todayDay,
        time: "05:00 PM"
      },
      payment: {
        sumInWords: "",
        sumInDigits: vehicle.demandPrice || 0,
        advance: 0,
        balance: vehicle.demandPrice || 0,
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
        originalNumberPlateReceived: vehicle.originalPlatesAvailable
      },
      seller: {
        cnic: "",
        name: "",
        fatherName: "",
        phone: "",
        address: "",
        witnessName: "",
        witnessCnic: "",
        sellerBiometricAvailable: vehicle.biometricStatus === 'Available'
      },
      status: "pending_balance"
    };

    setEditingLetter(prefilled);
    setActiveTab('new-letter');
  };

  // Client Management Handlers
  const handleAddClient = async (clientData: Omit<ClientProfile, 'id' | 'createdAt' | 'totalTransactions' | 'totalVolume'>) => {
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      }).then(r => r.json());

      if (res.success && res.data) {
        setClients(prev => [res.data, ...prev]);
      }
    } catch (err) {
      console.error("Error adding client:", err);
      const newCli: ClientProfile = {
        ...clientData,
        id: `cli_${Date.now()}`,
        totalTransactions: 0,
        totalVolume: 0,
        createdAt: new Date().toISOString(),
        documents: []
      };
      setClients(prev => [newCli, ...prev]);
    }
  };

  const handleUpdateClient = async (updated: ClientProfile) => {
    try {
      await fetch(`/api/clients/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
    } catch (err) {
      console.error("Error updating client:", err);
      setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await fetch(`/api/clients/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error("Error deleting client:", err);
    }
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const handleAddDocument = async (clientId: string, doc: { title: string; type: ClientDocument['type']; fileUrl: string; fileName: string }) => {
    try {
      const res = await fetch(`/api/clients/${clientId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc)
      }).then(r => r.json());

      if (res.success && res.data) {
        setClients(prev => prev.map(c => c.id === clientId ? res.data : c));
      }
    } catch (err) {
      console.error("Error adding client document:", err);
    }
  };

  const handleDeleteDocument = async (clientId: string, docId: string) => {
    try {
      const res = await fetch(`/api/clients/${clientId}/documents/${docId}`, {
        method: 'DELETE'
      }).then(r => r.json());

      if (res.success && res.data) {
        setClients(prev => prev.map(c => c.id === clientId ? res.data : c));
      }
    } catch (err) {
      console.error("Error deleting client document:", err);
    }
  };

  // Save Showroom Settings
  const handleSaveShowroom = async (updated: ShowroomSettings) => {
    setShowroom(updated);
    try {
      await fetch('/api/showroom', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error("Error saving showroom settings:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Navbar (Hidden in Print Mode) */}
      {activeTab !== 'print-view' && (
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setEditingLetter(null);
            setActiveTab(tab);
          }}
          showroomName={showroom.name}
        />
      )}

      {/* Main Container */}
      <main className={activeTab === 'print-view' ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}>
        {/* PRINT VIEW */}
        {activeTab === 'print-view' && selectedLetterForPrint && (
          <PrintDocumentView
            letter={selectedLetterForPrint}
            showroom={showroom}
            onBack={() => setActiveTab('letters-archive')}
            onEdit={() => {
              setEditingLetter(selectedLetterForPrint);
              setActiveTab('new-letter');
            }}
          />
        )}

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <Dashboard
            letters={letters}
            inventory={inventory}
            showroom={showroom}
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectLetter={(letItem) => {
              setSelectedLetterForPrint(letItem);
              setActiveTab('print-view');
            }}
            onCreateLetterForVehicle={handleCreateLetterForVehicle}
          />
        )}

        {/* VEHICLE INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <VehicleInventoryView
            inventory={inventory}
            clients={clients}
            letters={letters}
            onAddVehicle={handleAddVehicle}
            onUpdateVehicle={handleUpdateVehicle}
            onDeleteVehicle={handleDeleteVehicle}
            onCreateLetterForVehicle={handleCreateLetterForVehicle}
          />
        )}

        {/* NEW / EDIT LETTER FORM */}
        {activeTab === 'new-letter' && (
          <LetterForm
            initialData={editingLetter}
            clients={clients}
            inventory={inventory}
            showroom={showroom}
            onSave={handleSaveLetter}
            onCancel={() => {
              setEditingLetter(null);
              setActiveTab('letters-archive');
            }}
          />
        )}

        {/* LETTERS ARCHIVE LIST */}
        {activeTab === 'letters-archive' && (
          <LetterList
            letters={letters}
            onSelectLetter={(letItem) => {
              setSelectedLetterForPrint(letItem);
              setActiveTab('print-view');
            }}
            onEditLetter={(letItem) => {
              setEditingLetter(letItem);
              setActiveTab('new-letter');
            }}
            onDeleteLetter={handleDeleteLetter}
            onNewLetter={() => {
              setEditingLetter(null);
              setActiveTab('new-letter');
            }}
          />
        )}

        {/* CLIENTS CRM & LEDGERS */}
        {activeTab === 'clients' && (
          <ClientManager
            clients={clients}
            letters={letters}
            inventory={inventory}
            showroom={showroom}
            onAddClient={handleAddClient}
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
            onSelectLetterForPrint={(letter) => {
              setSelectedLetterForPrint(letter);
              setActiveTab('print-view');
            }}
          />
        )}

        {/* SHOWROOM SETTINGS */}
        {activeTab === 'settings' && (
          <ShowroomSettingsView
            settings={showroom}
            onSave={handleSaveShowroom}
          />
        )}

        {/* MVC ARCHITECTURE */}
        {activeTab === 'mvc-architecture' && (
          <MVCArchitectureView modules={modules} />
        )}
      </main>
    </div>
  );
}
