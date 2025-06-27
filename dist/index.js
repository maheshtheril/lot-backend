"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_1 = __importDefault(require("./routes/users"));
const draw_types_1 = __importDefault(require("./routes/draw_types"));
const draw_schedule_1 = __importDefault(require("./routes/draw_schedule"));
const purchases_1 = __importDefault(require("./routes/purchases"));
const purchase_items_1 = __importDefault(require("./routes/purchase_items"));
const login_check_1 = __importDefault(require("./routes/login_check"));
const login_history_1 = __importDefault(require("./routes/login_history"));
const login_1 = __importDefault(require("./routes/login")); // ← acts as login/auth route
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/auth', login_1.default);
app.use('/login-check', login_check_1.default);
app.use('/purchase-items', purchase_items_1.default);
app.use('/purchases', purchases_1.default);
app.use('/draw-schedule', draw_schedule_1.default);
app.use('/draw-types', draw_types_1.default);
app.use('/users', users_1.default);
app.use('/login-history', login_history_1.default);
app.get('/', (req, res) => {
    res.send('✅ Lottery API running!');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
