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
const db_1 = __importDefault(require("../config/db"));
const router = express_1.default.Router();
// Check how many devices a user has logged in from
router.get('/device-check/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const result = yield db_1.default.query(`SELECT COUNT(DISTINCT device_id) AS device_count
       FROM login_details
       WHERE user_id = $1`, [userId]);
        const deviceCount = result.rows[0].device_count;
        res.json({
            user_id: userId,
            multiple_devices: deviceCount > 1,
            device_count: deviceCount
        });
    }
    catch (error) {
        console.error('Error checking device usage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
