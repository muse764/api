import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import { createServer } from 'http';
import swaggerUI from 'swagger-ui-express';
import { errorHandler } from './helpers';

import cors from 'cors';
import router from './routes';

const app = express();
app.use(
  cors({
    credentials: false,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('public'));

app.use('/v1', router());

app.use(errorHandler);
app.use(
  '/v1/docs',
  swaggerUI.serve,
  swaggerUI.setup(undefined, {
    swaggerOptions: {
      url: '/v1/openapi.json',
    },
  })
);

app.use('/v1/openapi.json', (req, res) => {
  res.sendFile('openapi.json', { root: './docs' });
});

const server = createServer(app);

const PORT = process.env.PORT ?? 5000;

server.listen(PORT, () =>
  console.log(`
🚀 Server ready at: http://localhost:${PORT}`)
);
