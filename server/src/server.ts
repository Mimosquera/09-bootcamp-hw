import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import weatherRoutes from './routes/api/weatherRoutes.js';

// ✅ Manually define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

console.log('API Key:', process.env.OPENWEATHER_API_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Correct path for serving the React build
const clientBuildPath = path.resolve(__dirname, './client');

app.use(express.static(clientBuildPath));

// API Routes
app.use('/api/weather', weatherRoutes);

// Serve React's index.html for all unmatched routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});