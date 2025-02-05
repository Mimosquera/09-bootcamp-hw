import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../db/db.json');
const API_KEY = process.env.OPENWEATHER_API_KEY;

// Utility function to read from db.json
const readDatabase = (): any[] => {
  if (!fs.existsSync(dbPath)) return [];
  const data = fs.readFileSync(dbPath, 'utf-8');
  return data ? JSON.parse(data) : [];
};

// Utility function to write to db.json
const writeDatabase = (data: any[]): void => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// GET /api/weather/history
router.get('/history', (_req: Request, res: Response) => {
  try {
    const history = readDatabase();
    return res.json(history);
  } catch (error) {
    return res.status(500).json({ message: 'Error reading history', error });
  }
});

// POST /api/weather
router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ message: 'City name is required' });
  }

  try {
    const history = readDatabase();
    const newCity = { id: uuidv4(), name: city };
    history.push(newCity);
    writeDatabase(history);

    // Get coordinates for the city
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );

    if (geoResponse.data.length === 0) {
      return res.status(404).json({ message: 'City not found' });
    }

    const { lat, lon } = geoResponse.data[0];

    // Get weather data
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    return res.json({ city: newCity, weather: weatherResponse.data });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching weather data', error });
  }
});

// BONUS: DELETE /api/weather/history/:id
router.delete('/history/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    let history = readDatabase();
    const newHistory = history.filter((city) => city.id !== id);

    if (history.length === newHistory.length) {
      return res.status(404).json({ message: 'City not found' });
    }

    writeDatabase(newHistory);
    return res.json({ message: 'City deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting city', error });
  }
});

export default router;