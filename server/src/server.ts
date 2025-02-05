import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import weatherRoutes from './routes/api/weatherRoutes.js';
import htmlRoutes from './routes/htmlRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

console.log('API Key:', process.env.OPENWEATHER_API_KEY);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/weather', weatherRoutes);

// HTML Routes (for all other requests)
app.use('*', htmlRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});