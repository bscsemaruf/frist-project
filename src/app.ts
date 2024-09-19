import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();

// parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173' }));

// application routes
app.use('/api/v1', router);

const test = async (req: Request, res: Response) => {
  res.send(' hi Hello World!');
};
app.get('/', test);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
