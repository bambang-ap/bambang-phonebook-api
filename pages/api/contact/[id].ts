import type { NextApiRequest, NextApiResponse } from "next";
import { Contact, orm } from "../../../src/database";
import { eq } from "drizzle-orm";

export default function contactIdHandler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const id = req.query.id as string;

	switch (req.method) {
		case "GET":
			return getContact(id, res);
		case "PUT":
			return editContact(id, req, res);
		case "DELETE":
			return deleteContact(id, res);
		default:
			return res.status(200).json({ message: "this method not allowed" });
	}
}

async function getContact(id: string, res: NextApiResponse<null | TContact>) {
	const [contact] = await orm.select().from(Contact).where(eq(Contact.id, id));

	res.status(200).json(contact);
}

async function editContact(
	id: string,
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
) {
	const newContact = entries(req.body).reduce<Partial<TContact>>(
		(ret, [k, v]) => {
			if (!!v) ret[k] = v;
			return ret;
		},
		{}
	);

	await orm.update(Contact).set(newContact).where(eq(Contact.id, id));

	res.status(200).json({ message: "Success" });
}

async function deleteContact(id: string, res: NextApiResponse<ResponseData>) {
	await orm.delete(Contact).where(eq(Contact.id, id));
}
