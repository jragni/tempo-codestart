"use server"
/** user problem handlers */
import { camelCaseData } from '@/utils/globalHelpers';
import { sql } from '@vercel/postgres';
import { UserProblem } from '@/app/definitions';

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
  problemId: string,
) {
  const result = await sql`
    SELECT * FROM user_problem
    WHERE user_email = ${email}
    AND problem_id = ${problemId}
  `;

  return camelCaseData(result.rows[0]);
}

/**
 * POST
 */

export async function createUserProblem({
  email,
  problemId,
  userCode = '',
  userFavorite = false,
  isSolved = false,
}: UserProblem) {
  const result = await sql`
    INSERT INTO user_problem (user_email, problem_id, user_code, user_favorite, is_solved)
    VALUES (${email}, ${problemId}, ${userCode}, ${userFavorite}, ${isSolved})
    RETURNING *;
  `;
  return result.rows[0];
}

/**
 * PUT
 */

export async function updateUserProblemCode({
  email,
  problemId,
  userCode,
}: UserProblem) {

  const result = await sql`
    UPDATE user_problem
    SET user_code = ${userCode}
    WHERE user_email = ${email}
    AND problem_id = ${problemId}
    RETURNING *;
  `;
  return result.rows[0];
}