import express from 'express';
import dotenv from 'dotenv';
import weatherRoutes from './routes/api/weatherRoutes.js';
import htmlRoutes from './routes/htmlRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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