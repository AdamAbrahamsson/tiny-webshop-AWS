import express from 'express';
import productRoutes from './routes/products';
import authRoutes from './routes/auth';
import orderRoutes from './routes/orders';
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = 3000;

//Enable CORS
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Parsing the incoming request bodies that are in JSON Format 
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('Hello Tiny Webshop');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
