import { db } from "@vercel/postgres";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function index(req: NextApiRequest, res: NextApiResponse) {
	const client = await db.connect();
	const data = await client.sql`SELECT * from contact`;

	db.end();
	res.status(200).json(data.rows);
}
