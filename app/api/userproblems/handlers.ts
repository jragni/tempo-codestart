/** user problem handlers */
import { camelCaseData } from '@/utils/globalHelpers';
import { sql} from '@vercel/postgres';

/** GET */

export async function getUserProblems(email: string) {
  const result = await sql`
    SELECT * FROM user_problems
    WHERE email = ${email}
  `;
  return camelCaseData(result.rows[0]);
}