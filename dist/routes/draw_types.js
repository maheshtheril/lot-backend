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
// GET /draw-types or /draw-types?active=true
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const showOnlyActive = req.query.active === 'true';
    try {
        const result = yield db_1.default.query(showOnlyActive
            ? 'SELECT * FROM draw_types WHERE is_active = true ORDER BY id'
            : 'SELECT * FROM draw_types ORDER BY id');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching draw types:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
