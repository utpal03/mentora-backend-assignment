import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { connectDb } from './config/db.js';
import parentRoutes from './modules/parent/parent.routes.js';
import mentorRoutes from './modules/mentor/mentor.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello this is master backend of Mentora please refer README.md for more information');
});

app.use('/parents', parentRoutes);
app.use('/mentors', mentorRoutes);

async function start() {
  try {
    await connectDb();
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
