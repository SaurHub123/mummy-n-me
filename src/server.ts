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

app.post('/send-invoice', sendInvoice);

client.initialize();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));




















// // src/server.ts
// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import client, { getGroupsWithRetry } from '../src/config/whatsappConfig';

// const app = express();
// const server = createServer(app);
// const io = new Server(server);

// app.set('view engine', 'ejs');
// app.use(express.static('public'));

// // Routes
// app.get('/', async (req, res) => {
//   try {
//     const groups = await getGroupsWithRetry();
//     res.render('groups', { groups });
//   } catch (err) {
//     res.render('setup', { message: 'Please scan QR code to continue' });
//   }
// });

// // WebSocket handlers
// io.on('connection', (socket) => {
//   client.on('qr', qr => {
//     socket.emit('qr', qr);
//   });

//   client.on('ready', async () => {
//     const groups = await getGroupsWithRetry();
//     socket.emit('groups', groups);
//   });
// });

// server.listen(10000, () => {
//   console.log('Server running on port 10000');
// });