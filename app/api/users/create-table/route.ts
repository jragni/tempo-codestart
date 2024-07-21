/**
 * !NOTE: for reference only
 */
// import { sql } from '@vercel/postgres';

// export async function GET(req: any) {
//   try {
//     const result = sql`
//       CREATE TABLE Users (
//         name VARCHAR(255),
//         email VARCHAR(255) PRIMARY KEY,
//         is_admin BOOLEAN DEFAULT FALSE,
//         is_active BOOLEAN DEFAULT TRUE,
//         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
//       )
//     `;
//     return Response.json({ result, message: 'user table created', status: 200 });
//   } catch (error) {
//     console.error(error);
//     return Response.json({ error}, { status: 500 });
//   }

// }