import express from 'express';
import productRoutes from './routes/products';
import authRoutes from './routes/auth';
import orderRoutes from './routes/orders';
import cors from "cors";
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
const app = express();
const PORT = 3000;

//Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
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

// Health check endpoint for ALB
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


//app.listen(PORT, () => {
  //console.log(`Server running on http://localhost:${PORT}`);
//});
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
