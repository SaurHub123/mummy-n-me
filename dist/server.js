"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const whatsappConfig_1 = __importDefault(require("./config/whatsappConfig"));
const billController_1 = require("./controllers/billController");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    if (!whatsappConfig_1.default.info) {
        return res.render('setup', { message: 'WhatsApp Setup is not complete. Please scan the QR.' });
    }
    res.render('billing');
});
app.post('/send-invoice', billController_1.sendInvoice);
whatsappConfig_1.default.initialize();
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
