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
const db_1 = __importDefault(require("../db")); // Make sure this exports your pg `Pool` or `Client`
const router = express_1.default.Router();
// ✅ Login route (example, expand with real logic later)
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, deviceId, latitude, longitude } = req.body;
    try {
        // Authenticate user from DB
        const result = yield db_1.default.query(`SELECT id, username, name, role FROM users WHERE username = $1 AND password = $2`, [username, password]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = result.rows[0];
        // TODO: Save login log with deviceId, location if needed
        res.json({ success: true, user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// ✅ Top-level users route
router.get('/top-level', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query(`SELECT id, username, name, role, parent_id, is_active, created_at
       FROM users
       WHERE parent_id IS NULL OR parent_id = 0`);
        res.json({ users: result.rows });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch top-level users' });
    }
}));
exports.default = router;
