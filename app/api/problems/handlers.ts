/**
 * problems handler
 */
import { sql } from '@vercel/postgres';

export async function getProblems() {
  const result = await sql`SELECT * FROM problems`;
  return result.rows[0];
}