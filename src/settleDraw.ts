import  db  from './config/db'; // your pg Pool/Client instance

function isPermutation(a: string, b: string) {
  return a.split('').sort().join('') === b.split('').sort().join('');
}

export async function settleDraw(drawScheduleId: number) {
  const { rows: drawResults } = await db.query(
    `SELECT * FROM draw_results WHERE draw_schedule_id = $1`, [drawScheduleId]);

  const { rows: tickets } = await db.query(
    `SELECT * FROM tickets WHERE draw_schedule_id = $1`, [drawScheduleId]);

  for (const ticket of tickets) {
    for (const result of drawResults) {
      let match = false;

      if (ticket.ticket_type === 'triple_straight') {
        match = ticket.number === result.winning_number;
      } else if (ticket.ticket_type === 'triple_box') {
        match = isPermutation(ticket.number, result.winning_number);
      } else if (ticket.ticket_type === 'double') {
        match = ticket.number.slice(-2) === result.winning_number.slice(0, 2);
      } else if (ticket.ticket_type === 'single') {
        match = ticket.number.slice(-1) === result.winning_number.slice(0, 1);
      }

      if (match) {
        const { rows: rules } = await db.query(
          `SELECT * FROM payout_rules WHERE draw_type_id = $1 AND prize_level = $2 AND ticket_type = $3`,
          [1, result.prize_level, ticket.ticket_type]);

        if (rules.length) {
          const { base_amount, commission } = rules[0];
          const winAmount = (base_amount + commission) * ticket.qty;

          await db.query(
            `INSERT INTO ticket_results (ticket_id, draw_result_id, win_amount)
             VALUES ($1, $2, $3)`,
            [ticket.id, result.id, winAmount]
          );
        }
      }
    }
  }
}
