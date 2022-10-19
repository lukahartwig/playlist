import { Client } from "@planetscale/database";

const client = new Client({
  url: process.env.DATABASE_URL,
});

export async function queryRows<Row>(
  query: string,
  params?: any[]
): Promise<Row[]> {
  const result = await client.execute(query, params, { as: "object" });
  return result.rows as Row[];
}

export async function queryOne<Row>(
  query: string,
  params?: any[]
): Promise<Row> {
  const result = await client.execute(query, params, { as: "object" });
  return result.rows[0] as Row;
}
