/**
 * problems handler
 */
import { camelCaseData } from '@/utils/globalHelpers';
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

export async function getProblemBySlug(slug: string) {
  const result = await sql`SELECT * FROM problems WHERE slug = ${slug}`;
  return camelCaseData(result.rows[0]);
}

interface CreateProblem {
  description: string;
  slug: string;
  starterCode: string;
  testCode: string;
  title: string;
  topic?: string;
}

export async function createProblem({
  description,
  starterCode,
  testCode,
  title,
  topic,
}: CreateProblem) {
  const result = await sql`
   INSERT INTO problems (description, starter_code, test_code, title, topic)
    VALUES (${description}, ${starterCode}, ${testCode}, ${title}, ${topic})
    RETURNING *;
  `
  return result.rows[0];
}