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

export async function getProblemById(id: string) {
  const result = await sql`SELECT * FROM problems WHERE id = ${id}`;
  return result.rows[0] || null;
}

export async function getProblemByTitle(title: string) {
  const result = await sql`SELECT * FROM problems WHERE title = ${title}`;
  return result.rows[0];
}

export async function getProblemBySlug(slug: string) {
  const result = await sql`SELECT * FROM problems WHERE slug = ${slug}`;
  if (!result.rows[0]) return null;
  return camelCaseData(result.rows[0]);
}

/** POST */

interface CreateProblem {
  description: string;
  solution?: string;
  slug: string;
  starterCode: string;
  testCode: string;
  title: string;
  topic?: string;
}

export async function createProblem({
  description,
  solution,
  slug,
  starterCode,
  testCode,
  title,
  topic,
}: CreateProblem) {

  const result = await sql`
   INSERT INTO problems (description, slug, solution, starter_code, test_code, title, topic)
    VALUES (${description}, ${slug}, ${solution}, ${starterCode}, ${testCode}, ${title}, ${topic})
    RETURNING *;
  `
  return result.rows[0];
}

/** PUT */
interface UpdateProblem {
  description: string;
  id: string | number,
  solution?: string;
  slug: string;
  starterCode: string;
  testCode: string;
  title: string;
  topic?: string;
}

export async function updateProblem({
  description,
  id,
  slug,
  solution,
  starterCode,
  testCode,
  title,
  topic,
}: UpdateProblem) {
  console.log('--------')
  console.log('updateProblem: ', title)
  console.log('--------')
  const result = await sql`
    UPDATE problems
    SET description = ${description},
    slug = ${slug},
    starter_code = ${starterCode},
    solution= ${solution},
    test_code = ${testCode},
    title = ${title},
    topic = ${topic}
    WHERE id = ${id}
    RETURNING *;
  `
  console.log('update Problem result:', result.rows[0]);
  return result.rows[0];
}