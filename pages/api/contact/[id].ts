import "global-methods";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { listContacts, saveImage } from "../../../src/utils";
import { contactPath } from "../../../src/const";

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

function getContact(id: string, res: NextApiResponse<null | TContact>) {
	const contacts = listContacts();

	const contact = contacts.find((e) => e.id === id);

	res.status(200).json(contact ? contact : null);
}

function editContact(
	id: string,
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
) {
	const body: TContact = req.body;

	const contacts = listContacts();
	const i = contacts.findIndex((e) => e.id === id);

	if (i >= 0) {
		const photo = saveImage(req, body.photo);

		fs.writeFileSync(
			contactPath,
			JSON.stringify(contacts.replace(i, { ...contacts[i], ...body, photo })),
			"utf8"
		);
		res.status(200).json({ message: "Success" });
	} else {
		res.status(400).json({ message: "Failed" });
	}
}

function deleteContact(id: string, res: NextApiResponse<ResponseData>) {
	const contacts = listContacts();
	const i = contacts.findIndex((e) => e.id === id);

	if (i >= 0) {
		fs.writeFileSync(contactPath, JSON.stringify(contacts.remove(i)), "utf8");
		res.status(200).json({ message: "Success" });
	} else {
		res.status(400).json({ message: "Failed" });
	}
}
