import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

// Initialize Google Gen AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// JSON Database Setup
const DATA_DIR = path.join(process.cwd(), ".data");
const RESERVATIONS_FILE = path.join(DATA_DIR, "reservations.json");

function initDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(RESERVATIONS_FILE)) {
    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify([], null, 2));
  }
}

async function startServer() {
  initDB();

  const app = express();
  app.use(express.json());

  // API: Get all reservations
  app.get("/api/reservations", (req, res) => {
    try {
      const data = fs.readFileSync(RESERVATIONS_FILE, "utf-8");
      const reservations = JSON.parse(data);
      res.json({ success: true, reservations });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API: Create reservation
  app.post("/api/reservations", (req, res) => {
    try {
      const { name, email, phone, date, time, guests, seating, specialRequests } = req.body;
      
      if (!name || !email || !phone || !date || !time || !guests || !seating) {
        return res.status(400).json({ success: false, error: "Missing required booking details." });
      }

      const data = fs.readFileSync(RESERVATIONS_FILE, "utf-8");
      const reservations = JSON.parse(data);

      // Generate custom code (e.g., MN-8392-X)
      const codeNum = Math.floor(1000 + Math.random() * 9000);
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
      const code = `MN-${codeNum}-${randomChar}`;

      const newReservation = {
        id: Math.random().toString(36).substring(2, 11),
        code,
        name,
        email,
        phone,
        date,
        time,
        guests: Number(guests),
        seating,
        specialRequests: specialRequests || "",
        createdAt: new Date().toISOString(),
        status: "confirmed"
      };

      reservations.push(newReservation);
      fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2));

      res.json({ success: true, reservation: newReservation });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API: Cancel reservation
  app.post("/api/reservations/cancel", (req, res) => {
    try {
      const { code, email } = req.body;
      if (!code) {
        return res.status(400).json({ success: false, error: "Reservation code is required." });
      }

      const data = fs.readFileSync(RESERVATIONS_FILE, "utf-8");
      let reservations = JSON.parse(data);

      let found = false;
      reservations = reservations.map((resv: any) => {
        const matchesCode = resv.code.toLowerCase() === code.trim().toLowerCase();
        const matchesEmail = !email || resv.email.toLowerCase() === email.trim().toLowerCase();
        
        if (matchesCode && matchesEmail && resv.status === "confirmed") {
          found = true;
          return { ...resv, status: "cancelled" };
        }
        return resv;
      });

      if (!found) {
        return res.status(404).json({ success: false, error: "No confirmed reservation found matching these details." });
      }

      fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2));
      res.json({ success: true, message: "Your reservation has been successfully cancelled." });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // API: AI Concierge chat route
  app.post("/api/concierge", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ success: false, error: "Valid message history is required." });
      }

      const systemInstruction = `You are Chef Julien Renard, the visionary Executive Chef behind MAISON NOIR, a world-renowned fine-dining temple of modern gastronomy.
Your communication style is incredibly sophisticated, elite, hospitable, and deeply passionate about culinary excellence.
Use elegant, evocative words. You write in English. Avoid overly enthusiastic or casual phrasing. Maintain an aura of mysterious intensity combined with supreme, warm hospitality.

Key information about MAISON NOIR:
- Philosophy: "A Symphony of Shadows & Light", focusing on minimal-intensity aesthetics, bold contrasts, and seasonal purity.
- Location: 14 Rue de la Paix, Paris, France (understated luxury black stone facade).
- Opening Hours: Wednesday to Sunday, 18:00 - 23:30. Strictly Reservation-Only.
- Seating Venues:
  1. Main Dining Room: Dramatic dark atmosphere, glowing custom fiber-optic starlight constellations, and black obsidian tables.
  2. Chef's Counter: Front-row view of the culinary workshop, seating strictly limited to 8 guests. Interactive chef dialogue.
  3. Private Salon: Whisper-quiet bespoke chamber, hosting up to 12 guests, featuring customized menus and dedicated sommelier service.
- The Seasonal Menu (Maison Noir Signature):
  * Appetizers:
    - Oysters & Mignonette: Fine de Claire No. 2, champagne-infused vinegar mignonette, ice crystals. ($48)
    - Wagyu Beef Tartare: A5 Wagyu, cured egg yolk, cured mustard seeds, black truffle shaving. ($65)
    - White Asparagus: Steamed in sea salt, served with hollandaise foam, toasted pine nut dust. ($44)
  * Main Courses:
    - Lobster Thermidor: Native lobster with wild cognac cream, Gruyère crust, fine sea herbs. ($95)
    - Dry-Aged Duck Breast: Spiced honey glaze, roasted organic fig, parsnip emulsion. ($88)
    - Venison Wellington: Encased in delicate puff pastry with wild mushroom duxelles, red currant reduction. ($110)
    - Truffle Infused Risotto (Course III): Acquerello rice, aged Parmigiano-Reggiano, fresh black autumn truffles. ($75)
    - Wagyu A5 Filet (Course V): Charred over binchotan wood, parsnip mousse, natural jus reduction. ($135)
  * Desserts:
    - Gold Leaf Ganache: Grand Cru dark chocolate, edible gold foil, sea salt crunch. ($38)
    - Tahitian Vanilla Soufflé: Light soufflé with grand marnier drizzle, Madagascar vanilla bean ice cream. ($35)
  * Wine Pairing Packages:
    - Sommelier's Curated Flight: Handpicked rare vintage alignments ($120 per guest).
    - Prestige Bordeaux Pour: Classic, legendary left-bank vintages ($250 per guest).

If guests ask questions about pairings, recommend Prestige Bordeaux with Venison Wellington or Wagyu, and Sommelier's Flight or a crisp French white with the seafood.
If they ask about allergies, assure them that our kitchen can adapt almost any course with 48 hours' notice, and they should detail it in their reservation.
Keep answers relatively concise (2-4 elegant paragraphs or clean bullets) so they stay readable in a chat panel. Do not include pricing if not asked, unless describing a dish naturally. Let's make guests feel incredibly welcomed into a realm of luxury.`;

      const contents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          success: true,
          text: "Greetings. I am Chef Julien Renard. Currently, my AI interface is in preview mode (missing API key). However, I can assure you that our physical kitchen is fully operational at 14 Rue de la Paix. Please browse our menu or proceed to secure your table through our reservation system."
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.85,
          topP: 0.95
        }
      });

      res.json({ success: true, text: response.text });
    } catch (err: any) {
      console.error("Gemini Error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite Middleware for Full Stack
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
    console.log(`Maison Noir server running on http://localhost:${PORT}`);
  });
}

startServer();
