import { pool } from "../index.js";
import { resetAllTables } from "../helpers.js";
import { data } from "../data.js";


try {
  const insertedRows = await resetAllTables( data );
  console.log("Reset all tables and inserted data");
  console.log(insertedRows);
} catch (err) {
  console.error(err);
} finally {
  await pool.end();
}