import "global-methods";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

type TContact = {
	firstName: string;
	lastName: string;
	age: number;
	photo: string;
};

type TContactId = { id: string } & TContact;

type ResponseData<T = undefined> = T extends undefined
	? { message: string }
	: { message: string; data: T };

const root = "./public/images";
const contactPath = `./contacts.json`;

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

function listContacts() {
	const list = fs.readFileSync(contactPath);
	const data: TContactId[] = JSON.parse(list as unknown as string);
	console.log(data);
	return data;
}

function getContacts(res: NextApiResponse<ResponseData<TContactId[]>>) {
	const data = listContacts();

	res.status(200).json({ data, message: "Get contacts" });
}

function addContact(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
	const { photo }: TContact = req.body;

	const [status, data] = photo.split(/,/);
	const id = uuid();
	const ext = status.replace(/^.*\//, "").replace(/;.*/, "");
	const filename = `${root}/${id}.${ext}`;
	const contacts = listContacts();

	const { host, ["x-forwarded-proto"]: proto } = req.headers;
	const fileName = `${proto}://${host}${filename.replace(/\.\/public/, "")}`;

	contacts.push({ ...req.body, id, photo: fileName });
	fs.writeFileSync(filename, data, "base64");
	fs.writeFileSync(contactPath, JSON.stringify(contacts), "utf8");

	res.status(200).json({ message: "Success" });
}
