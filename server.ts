import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { defaultShowroomSettings, sampleClients, sampleLetters, sampleInventory, sampleMVCModules } from "./src/data/initialData.js";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Persistent DB File Path
const DB_FILE = path.join(process.cwd(), "db_storage.json");

// Helper DB structure
interface DBStructure {
  showroom: typeof defaultShowroomSettings;
  clients: typeof sampleClients;
  inventory: typeof sampleInventory;
  letters: typeof sampleLetters;
  modules: typeof sampleMVCModules;
}

function loadDB(): DBStructure {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return {
        showroom: parsed.showroom || defaultShowroomSettings,
        clients: parsed.clients || sampleClients,
        inventory: parsed.inventory || sampleInventory,
        letters: parsed.letters || sampleLetters,
        modules: parsed.modules || sampleMVCModules
      };
    }
  } catch (err) {
    console.error("Error reading database storage file:", err);
  }
  
  // Return default if file doesn't exist or failed
  const initial: DBStructure = {
    showroom: defaultShowroomSettings,
    clients: sampleClients,
    inventory: sampleInventory,
    letters: sampleLetters,
    modules: sampleMVCModules
  };
  saveDB(initial);
  return initial;
}

function saveDB(data: DBStructure) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to database storage file:", err);
  }
}

// Global DB instance
let db = loadDB();

// ==================== MVC API ROUTES ==================== //

// 1. SHOWROOM SETTINGS MODULE
app.get("/api/showroom", (req, res) => {
  res.json({ success: true, data: db.showroom });
});

app.put("/api/showroom", (req, res) => {
  db.showroom = { ...db.showroom, ...req.body };
  saveDB(db);
  res.json({ success: true, data: db.showroom });
});

// 2. CLIENT MANAGEMENT MODULE
app.get("/api/clients", (req, res) => {
  res.json({ success: true, data: db.clients });
});

app.post("/api/clients", (req, res) => {
  const newClient = {
    id: `cli_${Date.now()}`,
    createdAt: new Date().toISOString(),
    totalTransactions: 0,
    totalVolume: 0,
    role: req.body.role || "both",
    ...req.body
  };
  db.clients.unshift(newClient);
  saveDB(db);
  res.status(201).json({ success: true, data: newClient });
});

app.put("/api/clients/:id", (req, res) => {
  const index = db.clients.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    db.clients[index] = { ...db.clients[index], ...req.body };
    saveDB(db);
    return res.json({ success: true, data: db.clients[index] });
  }
  res.status(404).json({ success: false, message: "Client not found" });
});

app.delete("/api/clients/:id", (req, res) => {
  db.clients = db.clients.filter(c => c.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, message: "Client deleted" });
});

// Client Document Attachment Endpoint
app.post("/api/clients/:id/documents", (req, res) => {
  const client = db.clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ success: false, message: "Client not found" });
  }

  const newDoc = {
    id: `doc_${Date.now()}`,
    title: req.body.title || "Document Scan",
    type: req.body.type || "other",
    fileUrl: req.body.fileUrl,
    fileName: req.body.fileName || "scan.jpg",
    uploadedAt: new Date().toISOString()
  };

  if (!client.documents) client.documents = [];
  client.documents.push(newDoc);
  saveDB(db);
  res.status(201).json({ success: true, data: newDoc, client });
});

app.delete("/api/clients/:id/documents/:docId", (req, res) => {
  const client = db.clients.find(c => c.id === req.params.id);
  if (!client) {
    return res.status(404).json({ success: false, message: "Client not found" });
  }

  if (client.documents) {
    client.documents = client.documents.filter(d => d.id !== req.params.docId);
    saveDB(db);
  }
  res.json({ success: true, message: "Document deleted" });
});

// 3. VEHICLE INVENTORY MODULE
app.get("/api/inventory", (req, res) => {
  res.json({ success: true, data: db.inventory });
});

app.get("/api/inventory/:id", (req, res) => {
  const item = db.inventory.find(i => i.id === req.params.id);
  if (item) {
    return res.json({ success: true, data: item });
  }
  res.status(404).json({ success: false, message: "Inventory item not found" });
});

app.post("/api/inventory", (req, res) => {
  const newItem = {
    id: req.body.id || `inv_${Date.now()}`,
    stockId: req.body.stockId || `STK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    status: req.body.status || "Available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...req.body
  };
  db.inventory.unshift(newItem);
  saveDB(db);
  res.status(201).json({ success: true, data: newItem });
});

app.put("/api/inventory/:id", (req, res) => {
  const index = db.inventory.findIndex(i => i.id === req.params.id);
  if (index !== -1) {
    db.inventory[index] = {
      ...db.inventory[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    saveDB(db);
    return res.json({ success: true, data: db.inventory[index] });
  }
  res.status(404).json({ success: false, message: "Inventory item not found" });
});

app.delete("/api/inventory/:id", (req, res) => {
  // CRITICAL REQUIREMENT: Deleting an inventory vehicle DOES NOT alter or delete sell letters archive!
  // Sell letters retain their own frozen copy of vehicle details.
  db.inventory = db.inventory.filter(i => i.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, message: "Vehicle removed from current inventory. Historical sell letter archives remain intact." });
});

// 4. VEHICLE DELIVERY LETTER MODULE
app.get("/api/letters", (req, res) => {
  res.json({ success: true, data: db.letters });
});

app.get("/api/letters/:id", (req, res) => {
  const letter = db.letters.find(l => l.id === req.params.id);
  if (letter) {
    return res.json({ success: true, data: letter });
  }
  res.status(404).json({ success: false, message: "Letter not found" });
});

app.post("/api/letters", (req, res) => {
  const letterData = req.body;
  const newLetter = {
    id: letterData.id || `let_${Date.now()}`,
    serialNo: letterData.serialNo || `INF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...letterData
  };
  
  db.letters.unshift(newLetter);

  // Auto upsert Purchasers & Sellers into Clients table if CNIC exists!
  if (newLetter.purchaser?.cnic) {
    const existingP = db.clients.find(c => c.cnic === newLetter.purchaser.cnic);
    if (!existingP) {
      db.clients.push({
        id: `cli_${Date.now()}_p`,
        cnic: newLetter.purchaser.cnic,
        name: newLetter.purchaser.name,
        fatherName: newLetter.purchaser.fatherName,
        phone: newLetter.purchaser.phone,
        phone2: newLetter.purchaser.phone2 || "",
        address: newLetter.purchaser.address,
        role: "purchaser",
        totalTransactions: 1,
        totalVolume: newLetter.payment?.sumInDigits || 0,
        createdAt: new Date().toISOString()
      });
    } else {
      existingP.totalTransactions += 1;
      existingP.totalVolume += (newLetter.payment?.sumInDigits || 0);
      if (newLetter.purchaser.phone2 && !existingP.phone2) {
        existingP.phone2 = newLetter.purchaser.phone2;
      }
    }
  }

  if (newLetter.seller?.cnic) {
    const existingS = db.clients.find(c => c.cnic === newLetter.seller.cnic);
    if (!existingS) {
      db.clients.push({
        id: `cli_${Date.now()}_s`,
        cnic: newLetter.seller.cnic,
        name: newLetter.seller.name,
        fatherName: newLetter.seller.fatherName,
        phone: newLetter.seller.phone,
        phone2: newLetter.seller.phone2 || "",
        address: newLetter.seller.address,
        role: "seller",
        totalTransactions: 1,
        totalVolume: newLetter.payment?.sumInDigits || 0,
        createdAt: new Date().toISOString()
      });
    } else {
      existingS.totalTransactions += 1;
      existingS.totalVolume += (newLetter.payment?.sumInDigits || 0);
      if (newLetter.seller.phone2 && !existingS.phone2) {
        existingS.phone2 = newLetter.seller.phone2;
      }
    }
  }

  saveDB(db);
  res.status(201).json({ success: true, data: newLetter });
});

app.put("/api/letters/:id", (req, res) => {
  const index = db.letters.findIndex(l => l.id === req.params.id);
  if (index !== -1) {
    db.letters[index] = {
      ...db.letters[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    saveDB(db);
    return res.json({ success: true, data: db.letters[index] });
  }
  res.status(404).json({ success: false, message: "Letter not found" });
});

app.delete("/api/letters/:id", (req, res) => {
  db.letters = db.letters.filter(l => l.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, message: "Letter deleted" });
});

// 4. SYSTEM STATS MODULE
app.get("/api/stats", (req, res) => {
  const totalLetters = db.letters.length;
  const totalVolume = db.letters.reduce((acc, curr) => acc + (curr.payment?.sumInDigits || 0), 0);
  const pendingBalanceCount = db.letters.filter(l => l.status === "pending_balance").length;
  const pendingBalanceAmount = db.letters.reduce((acc, curr) => acc + (curr.payment?.balance || 0), 0);
  const totalClients = db.clients.length;

  const totalInventoryCount = db.inventory.length;
  const availableInventoryCount = db.inventory.filter(i => i.status === "Available").length;
  const reservedInventoryCount = db.inventory.filter(i => i.status === "Reserved").length;
  const soldInventoryCount = db.inventory.filter(i => i.status === "Sold").length;
  const inventoryStockValue = db.inventory
    .filter(i => i.status === "Available" || i.status === "Reserved")
    .reduce((acc, curr) => acc + (curr.demandPrice || 0), 0);

  res.json({
    success: true,
    data: {
      totalLetters,
      totalVolume,
      pendingBalanceCount,
      pendingBalanceAmount,
      totalClients,
      totalInventoryCount,
      availableInventoryCount,
      reservedInventoryCount,
      soldInventoryCount,
      inventoryStockValue,
      modulesCount: db.modules.length
    }
  });
});

// 5. MVC MODULE REGISTRY
app.get("/api/modules", (req, res) => {
  res.json({ success: true, data: db.modules });
});

// Start Express Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
