import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

const router = Router(); // Create an instance of the Express Router
const dbPath = path.join(process.cwd(), 'db', 'db.json'); // Path to the db.json file for storing search history

// API key and base URL for OpenWeather API
const API_KEY = process.env.OPENWEATHER_API_KEY || 'MISSING_API_KEY';
const BASE_URL = process.env.API_BASE_URL || 'https://api.openweathermap.org/data/2.5';
console.log('Using API Key:', API_KEY); // Debug log to verify API key loading

// Utility function to read from db.json
const readDatabase = (): any[] => {
  if (!fs.existsSync(dbPath)) return []; // Return an empty array if db.json doesn't exist
  const data = fs.readFileSync(dbPath, 'utf-8'); // Read file content as a string
  return data ? JSON.parse(data) : []; // Parse JSON if data exists, otherwise return an empty array
};

// Utility function to write data to db.json
const writeDatabase = (data: any[]): void => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2)); // Write data to db.json with formatted JSON
};

// GET /api/weather/history - Fetches the search history from db.json
router.get('/history', (_req: Request, res: Response) => {
  try {
    const history = readDatabase(); // Read search history from db.json
    return res.json(history); // Return the history as JSON
  } catch (error) {
    return res.status(500).json({ message: 'Error reading history', error }); // Handle read errors
  }
});

// POST /api/weather - Adds a city to history and fetches weather data
router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body; // Extract city from request body

  console.log('Received city:', city); // Debug log

  if (!city) {
    console.error('City is missing in request body'); // Debug log for missing city
    return res.status(400).json({ message: 'City name is required' }); // Return error if city is missing
  }

  try {
    const history = readDatabase(); // Read current history
    const newCity = { id: uuidv4(), name: city }; // Create a new city entry with a unique ID
    history.push(newCity); // Add the new city to the history
    writeDatabase(history); // Save the updated history

    console.log('API Key before request:', process.env.OPENWEATHER_API_KEY); // Debug log

    // Get coordinates for the city using OpenWeather Geo API
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );    

    console.log('Geo Response:', geoResponse.data); // Debug log

    if (geoResponse.data.length === 0) {
      console.error('City not found in Geo API'); // Debug log for city not found
      return res.status(404).json({ message: 'City not found' }); // Return error if city not found
    }

    const { lat, lon } = geoResponse.data[0]; // Extract latitude and longitude

    // Fetch weather data using OpenWeather Forecast API
    const weatherResponse = await axios.get(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    console.log('Weather Response:', weatherResponse.data); // Debug log

    // Return combined city and weather data
    return res.json({ city: newCity, weather: weatherResponse.data });
  } catch (error) {
    console.error('Server Error:', error); // Debug log for server errors
    return res.status(500).json({ message: 'Error fetching weather data', error }); // Return error if API call fails
  }
});

// DELETE /api/weather/history/:id - Removes a city from search history
router.delete('/history/:id', (req: Request, res: Response) => {
  const { id } = req.params; // Extract city ID from request parameters

  try {
    let history = readDatabase(); // Read current history
    const newHistory = history.filter((city) => city.id !== id); // Filter out the city with the specified ID

    if (history.length === newHistory.length) {
      return res.status(404).json({ message: 'City not found' }); // Return error if city ID is not found
    }

    writeDatabase(newHistory); // Save the updated history
    return res.json({ message: 'City deleted successfully' }); // Return success message
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting city', error }); // Handle delete errors
  }
});

export default router;