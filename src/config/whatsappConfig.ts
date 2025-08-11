// import { Client, LocalAuth } from 'whatsapp-web.js';
// import qrcode from 'qrcode-terminal';
// import path from 'path';
// import fs from 'fs';


// const SESSION_DIR ='/opt/render/.render/whatsapp_session' 

// // const SESSION_DIR = path.join(__dirname, 'whatsapp_session');


// if (!fs.existsSync(SESSION_DIR)) {
//   fs.mkdirSync(SESSION_DIR, { recursive: true });
//   console.log(`📁 Created session directory at: ${SESSION_DIR}`);
// }

// const client = new Client({
//   authStrategy: new LocalAuth({
//     dataPath: SESSION_DIR,
//     clientId: 'your-app-name' 
//   }),
//   puppeteer: {
//     headless: true,
//     args: [
//       '--no-sandbox',
//       '--disable-setuid-sandbox',
//       '--disable-dev-shm-usage', 
//       '--single-process',       
//       '--no-zygote',
//       '--max-old-space-size=256' 
//     ],
//   },
//   webVersionCache: {
//     type: 'remote',
//     remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html'
//   }
// });


// client.on('qr', qr => {
//   console.log('\n🔍 Scan this QR code to login:');
//   qrcode.generate(qr, { small: true });
//   console.log('\n💡 After scanning, the session will persist across restarts.');
// });

// client.on('authenticated', () => {
//   console.log('✅ Authentication successful! Session saved to:', SESSION_DIR);
// });

// client.on('ready', async () => {
//   console.log('\n🚀 WhatsApp client is ready!\n');

//   try {
//     const chats = await client.getChats();
//     const groups = chats.filter(chat => chat.isGroup);

//     if (groups.length === 0) {
//       console.log('ℹ️ No groups found');
//       return;
//     }

//     console.log(`📋 You're in ${groups.length} groups:\n`);
//     groups.forEach((group, index) => {
//       console.log(`${index + 1}. ${group.name || 'Unnamed Group'}`);
//       console.log(`   ID: ${group.id._serialized}`);
//       console.log('   ----------------------------');
//     });
//   } catch (error) {
//     console.error('⚠️ Error fetching groups:', error);
//   }
// });

// client.on('disconnected', (reason) => {
//   console.log('❌ Disconnected:', reason);
//   console.log('⏳ Attempting to reconnect in 10 seconds...');
//   setTimeout(() => client.initialize(), 10000);
// });

// client.on('auth_failure', (msg) => {
//   console.error('🔐 Auth failure:', msg);
//   console.log('💡 Try deleting the session folder and rescanning QR code');
// });


// export async function initializeWhatsApp() {
//   try {
//     await client.initialize();
//     console.log('🔄 WhatsApp client initializing...');
//   } catch (error) {
//     console.error('🔥 Initialization error:', error);
//     process.exit(1); // Exit if critical error
//   }
// }

// export default client;

import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer';

// Session configuration
const SESSION_DIR = process.env.RENDER 
  ? '/opt/render/.render/whatsapp_session' 
  : path.join(__dirname, '..', 'session_data');

// Ensure session directory exists
if (!fs.existsSync(SESSION_DIR)) {
  fs.mkdirSync(SESSION_DIR, { recursive: true });
  if (!process.env.RENDER) {
    fs.chmodSync(SESSION_DIR, 0o777);
  }
}

// Determine Chromium executable path
const getChromiumPath = () => {
  if (process.env.RENDER) {
    return '/usr/bin/chromium-browser'; // Render's Chromium path
  }
  return puppeteer.executablePath(); // Local development path
};

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: SESSION_DIR,
    clientId: 'mummy-n-me',
    // backupSyncIntervalMs: 300000 // 5 minutes
  }),
  puppeteer: {
    headless: process.env.RENDER ? true : false, // Headless on Render, visible locally
    executablePath: getChromiumPath(),
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process',
      '--no-zygote',
      '--disable-gpu',
      '--disable-software-rasterizer',
      ...(process.env.RENDER ? [] : ['--window-size=1024,768']) // Only set window size locally
    ]
  },
  webVersionCache: {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html'
  },
  takeoverOnConflict: true,
  restartOnAuthFail: true
});

// Connection state management
let isConnected = false;
const MAX_RETRIES = 5;
let retryCount = 0;

// QR Code Handler
client.on('qr', qr => {
  console.log('\n=== WhatsApp QR Code ===');
  qrcode.generate(qr, { small: true });
  console.log('Scan this QR code in WhatsApp > Linked Devices');
  console.log('Session will persist in:', SESSION_DIR);
});

// Authentication Handler
client.on('authenticated', () => {
  console.log('✓ Authentication successful');
  isConnected = true;
  retryCount = 0;
});

// Ready Handler
client.on('ready', async () => {
  console.log('✓ Client is ready');
  try {
    const chats = await client.getChats();
    const groups = chats.filter(chat => chat.isGroup);
    
    console.log('\n📋 Your WhatsApp Groups:');
    groups.forEach((group, index) => {
      console.log(`${index + 1}. ${group.name || 'Unnamed Group'}`);
      console.log(`   ID: ${group.id._serialized}`);
      console.log('   -------------------');
    });
  } catch (error) {
    console.error('Failed to fetch groups:', error);
  }
});

// Disconnection Handler
client.on('disconnected', async (reason) => {
  isConnected = false;
  console.log(`✗ Disconnected: ${reason}`);
  
  if (retryCount < MAX_RETRIES) {
    retryCount++;
    const delay = Math.min(30000, retryCount * 5000); // Exponential backoff
    console.log(`⏳ Reconnecting in ${delay/1000}s (Attempt ${retryCount}/${MAX_RETRIES})`);
    
    setTimeout(async () => {
      try {
        await client.initialize();
      } catch (err) {
        console.error('Reconnection failed:', err);
      }
    }, delay);
  } else {
    console.error('🔥 Max reconnection attempts reached');
  }
});

// Initialize client
const initializeWhatsApp = async () => {
  try {
    await client.initialize();
  } catch (error) {
    console.error('Initialization error:', error);
    setTimeout(initializeWhatsApp, 5000);
  }
};

initializeWhatsApp();

export default client;