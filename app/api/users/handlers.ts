import { sql } from '@vercel/postgres';
import { User } from '@/app/definitions';

import { camelCaseData } from '../../../utils/globalHelpers';

/** GET */
export async function getUsers(email: string) {
  const result = await sql`SELECT * FROM Users`;
  return result.rows[0];
}

export async function getUser(email: string | null) {
  if (!email) return null;
  const result = await sql`SELECT * FROM Users WHERE email = ${email}`;
  return camelCaseData(result.rows[0]);
}

/** POST */

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