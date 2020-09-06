import express, { json } from 'express';
import morgan from 'morgan';

// importing routes
import productRoute from './routes/product';

// initialization
const app = express();

// middlewares
app.use(morgan('dev'));
app.use(json());

// routes
app.use('/api/product', productRoute);

export default app;