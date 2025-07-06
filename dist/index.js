"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth")); // ✅ You forgot this!
const draw_types_1 = __importDefault(require("./routes/draw_types"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/draw-types', draw_types_1.default);
app.use('/users', users_1.default);
app.use('/auth', auth_1.default); // ✅ Mount your auth route!
// ✅ Health check or root
app.get('/', (req, res) => {
    res.send('✅ Backend is running! Use /users/top-level or /auth to test.');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
