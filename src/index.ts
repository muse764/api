import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import { createServer as createHttpServer } from 'http';
// import { createServer as createHttpsServer } from 'https';
import swaggerUI from 'swagger-ui-express';

import cors from 'cors';
import router from './routes';

const app = express();
// app.use(
//   cors({
//     credentials: false,
//   })
// );

var allowedOrigins = [
  'http://open.muse.com',
  'http://artist.muse.com',
  'http://admin.muse.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('public'));

app.use('/v1', router());

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

app.use((req, res, next) => {
  res.status(404).redirect('/v1/docs');
});

const httpServer = createHttpServer(app);
// const httpsServer = createHttpsServer(app);

const PORT = process.env.PORT ?? 5000;

httpServer.listen(PORT, () =>
  console.log(`
🚀 Server ready at: http://localhost:${PORT}`)
);

// httpsServer.listen(443, () =>
//   console.log(`
// 🚀 Server ready at: http://localhost:443`)
// );
