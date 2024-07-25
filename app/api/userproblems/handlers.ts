"use server"
/** user problem handlers */
import { camelCaseData } from '@/utils/globalHelpers';
import { sql } from '@vercel/postgres';

/**
 * GET
 */

export async function getUserProblems(email: string) {
  const result = await sql`
    SELECT * FROM user_problem
    WHERE email = ${email}
  `;
  return camelCaseData(result.rows[0]);
}

export async function getUserProblem(
  email: string,
  problemTitle: string,
) {
  const result = await sql`
    SELECT * FROM user_problem
    WHERE user_email = ${email}
    AND problem_title = ${problemTitle}
  `;

  return result.rows[0];
}

/**
 * POST
 */
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

/**
 * PUT
 */

export async function updateUserProblemCode({
  email,
  problemTitle,
  userCode,
}: CreateUserProblemParams) {

  const result = await sql`
    UPDATE user_problem
    SET user_code = ${userCode}
    WHERE user_email = ${email}
    AND problem_title = ${problemTitle}
    RETURNING *;
  `;
  return result.rows[0];
}