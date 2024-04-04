import "global-methods";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { listContacts, saveImage } from "../../../src/utils";
import { contactPath } from "../../../src/const";

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
function getContacts(res: NextApiResponse<ResponseData<TContactId[]>>) {
	const data = listContacts();

	res.status(200).json({ data, message: "Get contacts" });
}

function addContact(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
	const { photo }: TContact = req.body;

	const contacts = listContacts();
	const fileName = saveImage(req, photo);

	contacts.push({ ...req.body, id: uuid(), photo: fileName });
	fs.writeFileSync(contactPath, JSON.stringify(contacts), "utf8");

	res.status(200).json({ message: "Success" });
}
