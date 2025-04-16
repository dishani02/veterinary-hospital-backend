import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Enable CORS to allow frontend requests
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
app.use(express.json());

app.get('/api/data', (req: Request, res: Response) => {
    res.json({ message: "Hello from Backend!" });
});

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}/api`);
});
