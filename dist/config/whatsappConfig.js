"use strict";
// import { Client, LocalAuth } from 'whatsapp-web.js';
// import qrcode from 'qrcode-terminal';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWhatsApp = initializeWhatsApp;
// const client = new Client({
//   puppeteer: {
//     headless: true,
//     args: ['--no-sandbox', '--disable-setuid-sandbox'],
//   }
// });
// client.on('qr', qr => {
//   console.log('Scan this QR code to login:\n');
//   qrcode.generate(qr, { small: true });
// });
// client.on('ready', async () => {
//   console.log('✅ Client is ready! Fetching groups...');
//   const chats = await client.getChats();
//   const groups = chats.filter(chat => chat.isGroup);
//   if (groups.length === 0) {
//     console.log('❌ No groups found!');
//     return;
//   }
//   console.log(`\n📋 You are part of ${groups.length} groups:\n`);
//   groups.forEach((group, index) => {
//     console.log(`${index + 1}. 📛 Name: ${group.name}`);
//     console.log(`   🆔 ID:   ${group.id._serialized}`);
//     console.log('--------------------------------------');
//   });
//   console.log(`\n✅ Done. Use the Group ID (ending with @g.us) to send messages.`);
// });
// export default client;
// src/whatsappClient.ts
const whatsapp_web_js_1 = require("whatsapp-web.js");
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Configure persistent session directory
// Uses Render's persistent storage if available, otherwise local directory
const SESSION_DIR = process.env.RENDER
    ? '/opt/render/.render/whatsapp_session'
    : path_1.default.join(__dirname, 'whatsapp_session');
// Create directory if it doesn't exist
if (!fs_1.default.existsSync(SESSION_DIR)) {
    fs_1.default.mkdirSync(SESSION_DIR, { recursive: true });
    console.log(`📁 Created session directory at: ${SESSION_DIR}`);
}
const client = new whatsapp_web_js_1.Client({
    authStrategy: new whatsapp_web_js_1.LocalAuth({
        dataPath: SESSION_DIR,
        clientId: 'your-app-name' // Unique identifier for your app
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage', // Critical for Render's memory limits
            '--single-process', // Reduces memory usage
            '--no-zygote',
            '--max-old-space-size=256' // Strict memory limit for free tier
        ],
    },
    webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html'
    }
});
// ======================
// Event Handlers
// ======================
client.on('qr', qr => {
    console.log('\n🔍 Scan this QR code to login:');
    qrcode_terminal_1.default.generate(qr, { small: true });
    console.log('\n💡 After scanning, the session will persist across restarts.');
});
client.on('authenticated', () => {
    console.log('✅ Authentication successful! Session saved to:', SESSION_DIR);
});
client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\n🚀 WhatsApp client is ready!\n');
    try {
        const chats = yield client.getChats();
        const groups = chats.filter(chat => chat.isGroup);
        if (groups.length === 0) {
            console.log('ℹ️ No groups found');
            return;
        }
        console.log(`📋 You're in ${groups.length} groups:\n`);
        groups.forEach((group, index) => {
            console.log(`${index + 1}. ${group.name || 'Unnamed Group'}`);
            console.log(`   ID: ${group.id._serialized}`);
            console.log('   ----------------------------');
        });
    }
    catch (error) {
        console.error('⚠️ Error fetching groups:', error);
    }
}));
client.on('disconnected', (reason) => {
    console.log('❌ Disconnected:', reason);
    console.log('⏳ Attempting to reconnect in 10 seconds...');
    setTimeout(() => client.initialize(), 10000);
});
client.on('auth_failure', (msg) => {
    console.error('🔐 Auth failure:', msg);
    console.log('💡 Try deleting the session folder and rescanning QR code');
});
// ======================
// Initialization Helper
// ======================
function initializeWhatsApp() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.initialize();
            console.log('🔄 WhatsApp client initializing...');
        }
        catch (error) {
            console.error('🔥 Initialization error:', error);
            process.exit(1); // Exit if critical error
        }
    });
}
exports.default = client;
