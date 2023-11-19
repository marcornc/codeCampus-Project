import { pool } from "../db/index.js";

// export async function getEvents() {
//   const data = await pool.query("SELECT * FROM events ORDER BY date ASC;");
//   return data.rows;
// }

// GET request
export async function getEvents() {
  const data = await pool.query(`SELECT *,
  (SELECT to_char(date, 'FMDay, DDth Month YYYY') FROM events e2 WHERE e2.id = events.id) AS formatted_date
FROM events
ORDER BY date ASC;`);
  return data.rows;
}

//GET social events
export async function getSocialEvents() {
  const data = await pool.query(`SELECT *,
  (SELECT to_char(date, 'FMDay, DDth Month YYYY') FROM events e2 WHERE e2.id = events.id) AS formatted_date
FROM events
WHERE event_type = 'Social'
ORDER BY date ASC;`);
  return data.rows;
}

//GET  online events
export async function getOnlineEvents() {
  const data = await pool.query(`SELECT *,
  (SELECT to_char(date, 'FMDay, DDth Month YYYY') FROM events e2 WHERE e2.id = events.id) AS formatted_date
FROM events
WHERE event_type = 'Online'
ORDER BY date ASC;`);
  return data.rows;
}

//GET tech events
export async function getTechEvents() {
  const data = await pool.query(`SELECT *,
  (SELECT to_char(date, 'FMDay, DDth Month YYYY') FROM events e2 WHERE e2.id = events.id) AS formatted_date
FROM events
WHERE event_type = 'Tech'
ORDER BY date ASC;`);
  return data.rows;
}

//Patch function

export async function updateEventAttendees(id) {
  const queryText = `
  UPDATE events
  SET attendees = attendees + 1
  WHERE id = $1
  RETURNING *;
  `;
  
  const result = await pool.query(queryText, [id]);
  return result.rows[0] || null;
}