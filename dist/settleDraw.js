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
exports.settleDraw = settleDraw;
const db_1 = __importDefault(require("./config/db")); // your pg Pool/Client instance
function isPermutation(a, b) {
    return a.split('').sort().join('') === b.split('').sort().join('');
}
function settleDraw(drawScheduleId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { rows: drawResults } = yield db_1.default.query(`SELECT * FROM draw_results WHERE draw_schedule_id = $1`, [drawScheduleId]);
        const { rows: tickets } = yield db_1.default.query(`SELECT * FROM tickets WHERE draw_schedule_id = $1`, [drawScheduleId]);
        for (const ticket of tickets) {
            for (const result of drawResults) {
                let match = false;
                if (ticket.ticket_type === 'triple_straight') {
                    match = ticket.number === result.winning_number;
                }
                else if (ticket.ticket_type === 'triple_box') {
                    match = isPermutation(ticket.number, result.winning_number);
                }
                else if (ticket.ticket_type === 'double') {
                    match = ticket.number.slice(-2) === result.winning_number.slice(0, 2);
                }
                else if (ticket.ticket_type === 'single') {
                    match = ticket.number.slice(-1) === result.winning_number.slice(0, 1);
                }
                if (match) {
                    const { rows: rules } = yield db_1.default.query(`SELECT * FROM payout_rules WHERE draw_type_id = $1 AND prize_level = $2 AND ticket_type = $3`, [1, result.prize_level, ticket.ticket_type]);
                    if (rules.length) {
                        const { base_amount, commission } = rules[0];
                        const winAmount = (base_amount + commission) * ticket.qty;
                        yield db_1.default.query(`INSERT INTO ticket_results (ticket_id, draw_result_id, win_amount)
             VALUES ($1, $2, $3)`, [ticket.id, result.id, winAmount]);
                    }
                }
            }
        }
    });
}
