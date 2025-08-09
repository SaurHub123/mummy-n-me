import { Request, Response } from 'express';
import client from '../config/whatsappConfig';
import { Product } from '../types';

export const sendInvoice = async (req: Request, res: Response) => {
  const { customerName, mobile, paidAmount } = req.body;

  if (!customerName || !mobile || !req.body.products) {
  return res.status(400).send('Invalid request body.');
}

const products: Product[] = req.body.products;
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
    await client.sendMessage(`91${mobile}@c.us`, customerMessage);
    await client.sendMessage('120363418463077263@g.us', groupMessage);
    res.send('✅ Invoice sent successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('❌ Failed to send message.');
  }
};
