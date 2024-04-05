import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import {
	pgTable,
	serial,
	text,
	numeric,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

export const orm = drizzle(sql);

export const Contact = pgTable<"contact", Record<keyof TContactId, any>>(
	"contact",
	{
		id: text("id").primaryKey(),
		firstName: text("firstName"),
		lastName: text("lastName"),
		photo: text("photo"),
		age: numeric("age"),
	}
);
