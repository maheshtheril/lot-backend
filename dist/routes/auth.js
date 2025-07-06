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
// src/routes/auth.ts
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const router = (0, express_1.Router)();
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, device_id, location_lat, location_lng } = req.body;
        if (!username || !password || !device_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const userResult = yield db_1.default.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userResult.rows.length === 0 ||
            userResult.rows[0].password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const user = userResult.rows[0];
        // ✅ Change username to user.id for login_details
        yield db_1.default.query(`INSERT INTO login_details (user_id, device_id, location_lat, location_lng, login_time)
       VALUES ($1, $2, $3, $4, NOW())`, [user.id, device_id, location_lat, location_lng]);
        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
            },
        });
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
