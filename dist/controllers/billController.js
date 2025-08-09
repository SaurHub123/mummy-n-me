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
exports.sendInvoice = void 0;
const whatsappConfig_1 = __importDefault(require("../config/whatsappConfig"));
const sendInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerName, mobile, paidAmount } = req.body;
    if (!customerName || !mobile || !req.body.products) {
        return res.status(400).send('Invalid request body.');
    }
    const products = req.body.products;
    let total = 0;
    const formatted = products.map(p => {
        const subtotal = +p.quantity * +p.price;
        total += subtotal;
        return `${p.name.padEnd(14)} ${p.size.padEnd(6)} ${p.quantity.toString().padEnd(4)} ₹${p.price}`;
    }).join('\n');
    const discount = total - paidAmount;
    const customerMessage = `
🧾 *Mummy n me - Invoice*

👤 *Customer:* ${customerName}
📞 *Mobile:* ${mobile}

🛍️ *Purchase Details:*
Name           Size   Qty  Price
${formatted}

----------------------------------
🧮 *Total:* ₹${total}/-
💸 *Paid:* ₹${paidAmount}/-
🎁 *Discount:* ₹${discount}/-

📍 *Visit Again!*
🕒 Exchange Hours: 12:00–19:00
📌 Location: https://maps.app.goo.gl/EoCCCAbnU7SyFmTw6

❤️ Thank you for shopping with us!
`.trim();
    const groupMessage = `${customerName} (${mobile})\n${formatted}\nTotal ₹${total}/-\nPaid ₹${paidAmount}/-`;
    try {
        // console.log(`${mobile}@c.us`, customerMessage);
        yield whatsappConfig_1.default.sendMessage(`91${mobile}@c.us`, customerMessage);
        yield whatsappConfig_1.default.sendMessage('120363418463077263@g.us', groupMessage);
        res.send('✅ Invoice sent successfully!');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('❌ Failed to send message.');
    }
});
exports.sendInvoice = sendInvoice;
