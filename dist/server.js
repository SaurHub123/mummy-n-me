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
// Health endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'running',
        whatsapp: whatsappConfig_1.default.info ? 'connected' : 'disconnected'
    });
});
// Keep-alive ping
setInterval(() => {
    const now = new Date();
    fetch(`http://localhost:${PORT}/health`)
        .then((response) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield response.text(); // or .json() if you expect JSON
        console.log(`[${now.toISOString()}] Health check successful.`);
        console.log(`Status: ${response.status}`);
        console.log(`Response: ${data}`);
    }))
        .catch((error) => {
        console.log(`[${now.toISOString()}] Health check failed.`);
        console.log(`Error: ${error.message}`);
    });
}, 4 * 60 * 1000);
// Every 4 minutes
app.post('/send-invoice', billController_1.sendInvoice);
whatsappConfig_1.default.initialize();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
