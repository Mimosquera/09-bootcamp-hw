import express, { Router, Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// Define the correct path for the built client
const clientBuildPath = path.resolve(__dirname, '../../client/dist');

// Serve static files (JS, CSS, images)
router.use(express.static(clientBuildPath));

// Serve React's index.html for all unmatched routes
router.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

export default router;