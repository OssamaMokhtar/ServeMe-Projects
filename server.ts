import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Mock POS Data Store ---
// In a real app, this would be a database or a direct call to a POS like Toast/Clover.
let tables = {
  "T12": {
    id: "T12",
    items: [
      { id: "i1", name: "Margherita Pizza", price: 18.50, paid: false },
      { id: "i2", name: "Truffle Fries", price: 9.00, paid: false },
      { id: "i3", name: "Classic Negroni", price: 14.00, paid: false },
      { id: "i4", name: "San Pellegrino", price: 6.50, paid: false },
      { id: "i5", name: "Calimari Fritti", price: 12.00, paid: false },
    ]
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // GET /api/check/:table_id
  app.get("/api/check/:table_id", (req, res) => {
    const { table_id } = req.params;
    const table = tables[table_id as keyof typeof tables];
    
    if (!table) {
      return res.status(404).json({ error: "Table not found or check closed." });
    }
    
    res.json(table);
  });

  // POST /api/split-payment
  // Simulates creating a payment session and locking items
  app.post("/api/split-payment", (req, res) => {
    const { table_id, item_ids } = req.body;
    const table = tables[table_id as keyof typeof tables];

    if (!table) return res.status(404).json({ error: "Table not found" });

    // Validate items are not already paid
    const itemsToPay = table.items.filter(i => item_ids.includes(i.id));
    if (itemsToPay.some(i => i.paid)) {
      return res.status(400).json({ error: "One or more items already paid" });
    }

    // In a real flow, you'd generate a Stripe Checkout URL here
    res.json({ 
      success: true, 
      payment_url: "/payment-success-mock", // Simulation redirect
      total: itemsToPay.reduce((sum, i) => sum + i.price, 0)
    });
  });

  // POST /api/payment-webhook (Simulated)
  app.post("/api/payment-webhook", (req, res) => {
    const { table_id, item_ids } = req.body;
    const table = tables[table_id as keyof typeof tables];

    if (table) {
      table.items = table.items.map(item => 
        item_ids.includes(item.id) ? { ...item, paid: true } : item
      );
      
      // If all items paid, we could clear the table
      const allPaid = table.items.every(i => i.paid);
      if (allPaid) {
        console.log(`Table ${table_id} fully paid and closed.`);
      }
    }

    res.json({ received: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ServeMe API running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
