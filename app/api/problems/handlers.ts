/**
 * problems handler
 */
import { camelCaseData } from '@/utils/globalHelpers';
import { sql } from '@vercel/postgres';

/** GET */
export async function getProblems() {
  const result = await sql`SELECT * FROM problems`;
  return result.rows.map((row) => camelCaseData(row));
}

export async function getProblemByTitle(title: string) {
  const result = await sql`SELECT * FROM problems WHERE title = ${title}`;
  return result.rows[0];
}

export async function getProblemBySlug(slug: string) {
  const result = await sql`SELECT * FROM problems WHERE slug = ${slug}`;
  return camelCaseData(result.rows[0]);
}

/** POST */

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
  slug,
  starterCode,
  testCode,
  title,
  topic,
}: CreateProblem) {
  const nextIdData = await sql`SELECT MAX(id) FROM problems`;
  const nextId = Number(nextIdData.rows[0].max) + 1;

  const result = await sql`
   INSERT INTO problems (description, id, slug, starter_code, test_code, title, topic)
    VALUES (${description}, ${nextId}, ${slug}, ${starterCode}, ${testCode}, ${title}, ${topic})
    RETURNING *;
  `
  return result.rows[0];
}

/** PUT */

export async function updateProblem({
  description,
  slug,
  starterCode,
  testCode,
  title,
  topic,
}: CreateProblem) {
  const result = await sql`
    UPDATE problems
    SET description = ${description},
    slug = ${slug},
    starter_code = ${starterCode},
    test_code = ${testCode},
    title = ${title},
    topic = ${topic}
    WHERE title = ${title}
    RETURNING *;
  `
  return result.rows[0];
}