/**
 * user handler
 */
import { sql } from '@vercel/postgres';

/** GET */
export async function getUser(email: string) {
  const result = await sql`SELECT * FROM Users WHERE email = ${email}`;
  return result.rows[0];
}

/** POST */
interface User {
  email: string;
  name: string;
  image?: string;
  isAdmin?: boolean;
}
export async function createUser({
  email,
  image,
  isAdmin,
  name,
}: User) {
  const result = await sql`
    INSERT INTO Users (email, name, is_admin, image)
    VALUES (${email}, ${name}, ${isAdmin}, ${image}) RETURNING *`;
  return result.rows[0];
}