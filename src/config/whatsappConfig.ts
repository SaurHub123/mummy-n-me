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

// Configure persistent session
const SESSION_DIR = '/opt/render/.render/whatsapp_session';
// const SESSION_DIR = path.join(__dirname, 'whatsapp_session');

// Ensure session directory exists
if (!fs.existsSync(SESSION_DIR)) {
  fs.mkdirSync(SESSION_DIR, { recursive: true });
  fs.chmodSync(SESSION_DIR, 0o777);
}

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: SESSION_DIR,
    clientId: 'mummy-n-me-prod'
  }),
  puppeteer: {
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process',
      '--no-zygote'
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
const MAX_RETRIES = 3;

client.on('qr', qr => {
  console.log('\n=== SCAN THIS QR CODE ===');
  qrcode.generate(qr, { small: true });
  console.log('Session will persist after scanning');
});

client.on('authenticated', () => {
  console.log('✓ Auth successful - Session persisted');
  isConnected = true;
});

client.on('ready', () => {
  console.log('✓ Client ready');
});

// Type-safe disconnection handler
client.on('disconnected', (reason: string) => {
  console.log(`Disconnected: ${reason}`);
  
  switch (reason) {
    case 'NAVIGATION':
      console.log('Reconnecting after navigation error...');
      break;
    case 'LOGOUT':
      console.log('Session terminated - requires new QR scan');
      // Clear session if needed
      if (fs.existsSync(SESSION_DIR)) {
        fs.rmSync(SESSION_DIR, { recursive: true });
      }
      break;
    default:
      console.log('Unknown disconnection');
  }});

// Safe initialization with retries
async function safeInitialize(retryCount = 0) {
  try {
    await client.initialize();
  } catch (err) {
    console.error(`Initialization error (attempt ${retryCount + 1}):`, err);
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      await safeInitialize(retryCount + 1);
    } else {
      console.error('Max initialization attempts reached');
    }
  }
}

// Start the client
safeInitialize();

export default client;