import { sql } from '@vercel/postgres';

export async function getUsers(email: string) {
  const result = await sql`SELECT * FROM Users`;
  return result.rows[0];
}