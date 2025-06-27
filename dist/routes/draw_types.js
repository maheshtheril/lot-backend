"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../config/db"));
const router = express_1.default.Router();
// GET /draw-types or /draw-types?active=true
router.get('/', async (req, res) => {
    const showOnlyActive = req.query.active === 'true';
    try {
        const result = await db_1.default.query(showOnlyActive
            ? 'SELECT * FROM draw_types WHERE is_active = true ORDER BY id'
            : 'SELECT * FROM draw_types ORDER BY id');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching draw types:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
