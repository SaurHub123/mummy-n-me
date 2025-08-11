import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import client from './config/whatsappConfig';
import { sendInvoice } from './controllers/billController';

dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  if (!client.info) {
    return res.render('setup', { message: 'WhatsApp Setup is not complete. Please scan the QR.' });
  }
  res.render('billing');
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'running',
    whatsapp: client.info ? 'connected' : 'disconnected'
  });
});

// Keep-alive ping
setInterval(() => {
  const now = new Date();

  fetch(`http://localhost:${PORT}/health`)
    .then(async (response) => {
      const data = await response.text(); // or .json() if you expect JSON
      console.log(`[${now.toISOString()}] Health check successful.`);
      console.log(`Status: ${response.status}`);
      console.log(`Response: ${data}`);
    })
    .catch((error) => {
      console.log(`[${now.toISOString()}] Health check failed.`);
      console.log(`Error: ${error.message}`);
    });
}, 4 * 60 * 1000);
// Every 4 minutes

app.post('/send-invoice', sendInvoice);

client.initialize();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
