import express, { json } from 'express';
import morgan from 'morgan';

// importing routes
import productRoute from './routes/product';
import inventarioRoute from './routes/inventario';

// initialization
const app = express();

// middlewares
app.use(morgan('dev'));
app.use(json());

// routes
app.use('/api/product', productRoute);
app.use('/api/inventario', inventarioRoute);

export default app;