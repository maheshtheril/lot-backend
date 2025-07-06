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
// src/routes/users.ts
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../config/db")); // ✅ Make sure this is your PostgreSQL connection
const router = express_1.default.Router();
// ✅ Route: Get all top-level users
router.get('/top-level', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query('SELECT * FROM users WHERE parent_id IS NULL OR parent_id = 0');
        res.json({ users: result.rows });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// ✅ Example login (keep this too if needed)
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, deviceId, latitude, longitude } = req.body;
    try {
        console.log({ username, password, deviceId, latitude, longitude });
        res.json({ success: true, message: 'Login successful' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = router;
