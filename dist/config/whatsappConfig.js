"use strict";
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
const whatsapp_web_js_1 = require("whatsapp-web.js");
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const client = new whatsapp_web_js_1.Client({
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});
client.on('qr', qr => {
    console.log('Scan this QR code to login:\n');
    qrcode_terminal_1.default.generate(qr, { small: true });
});
client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('✅ Client is ready! Fetching groups...');
    const chats = yield client.getChats();
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
}));
exports.default = client;
