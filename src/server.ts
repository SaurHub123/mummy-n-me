// import express from 'express';
// import path from 'path';
// import dotenv from 'dotenv';
// import bodyParser from 'body-parser';
// import client from './config/whatsappConfig';
// import { sendInvoice } from './controllers/billController';

// dotenv.config();

// const app = express();
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//   if (!client.info) {
//     return res.render('setup', { message: 'WhatsApp Setup is not complete. Please scan the QR.' });
//   }
//   res.render('billing');
// });

// app.post('/send-invoice', sendInvoice);

// client.initialize();

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


import express from 'express';
// import client from '..../config/whatsappConfig';
import client from './config/whatsappConfig';

const app = express();
const PORT = 10000; // Render's default port

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'running',
    whatsapp: client.info ? 'connected' : 'disconnected'
  });
});

// Keep-alive ping
setInterval(() => {
  fetch(`http://localhost:${PORT}/health`).catch(() => {});
}, 4 * 60 * 1000); // Every 4 minutes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});