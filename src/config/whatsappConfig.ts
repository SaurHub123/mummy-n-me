import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const client = new Client({
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }
});

client.on('qr', qr => {
  console.log('Scan this QR code to login:\n');
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('✅ Client is ready! Fetching groups...');

  const chats = await client.getChats();
  const groups = chats.filter(chat => chat.isGroup);

  if (groups.length === 0) {
    console.log('❌ No groups found!');
    return;
  }

  console.log(`\n📋 You are part of ${groups.length} groups:\n`);

  groups.forEach((group, index) => {
    console.log(`${index + 1}. 📛 Name: ${group.name}`);
    console.log(`   🆔 ID:   ${group.id._serialized}`);
    console.log('--------------------------------------');
  });

  console.log(`\n✅ Done. Use the Group ID (ending with @g.us) to send messages.`);
});

export default client;