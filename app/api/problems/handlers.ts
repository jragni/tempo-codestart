/**
 * problems handler
 */
import { sql } from '@vercel/postgres';

/** Get */
export async function getProblems() {
  const result = await sql`SELECT * FROM problems`;
  return result.rows[0];
}

export async function getProblemByTitle(title: string) {
  const result = await sql`SELECT * FROM problems WHERE title = ${title}`;
  return result.rows[0];
}