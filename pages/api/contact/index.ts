import "global-methods";
import type { NextApiRequest, NextApiResponse } from "next";
import { Contact, orm } from "../../../src/database";

export default function contactHandler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case "GET":
			return getContacts(res);
		case "POST":
			return addContact(req, res);
		default:
			return res.status(200).json({ message: "this method not allowed" });
	}
}

async function getContacts(res: NextApiResponse<ResponseData<TContactId[]>>) {
	const data = await orm.select().from(Contact);

	res.status(200).json({ data, message: "Get contacts" });
}

async function addContact(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
) {
	await orm.insert(Contact).values({ ...req.body, id: uuid() });

	res.status(200).json({ message: "Success" });
}
