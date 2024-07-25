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

export async function getUserProblem(
  email: string,
  problemTitle: string,
) {
  const result = await sql`
    SELECT * FROM user_problems
    WHERE email = ${email}
    AND problem_title = ${problemTitle}
  `;
  return camelCaseData(result.rows[0]);
}

export async function getMostRecentUserProblems(email: string) {
  const result = await sql`
    SELECT problem_title from user_problem
    where user_email='jhensenrayagni@gmail.com'
    ORDER BY last_attempted_at
    limit 1
  `;
  return result.rows[0];
}

/** POST */
interface CreateUserProblemParams {
  email: string;
  problemTitle: string;
  userCode?: string;
  userFavorite?: boolean;
  isSolved?: boolean;
}

export async function createUserProblem({
  email,
  problemTitle,
  userCode = '',
  userFavorite = false,
  isSolved = false,
}: CreateUserProblemParams) {
  const result = await sql`
    INSERT INTO user_problem (user_email, problem_title, user_code, user_favorite, is_solved)
    VALUES (${email}, ${problemTitle}, ${userCode}, ${userFavorite}, ${isSolved})
    RETURNING *;
  `;
  return result.rows[0];
}