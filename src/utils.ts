import fs from "fs";
import { contactPath, root } from "./const";
import { NextApiRequest } from "next";

export function listContacts() {
	const list = fs.readFileSync(contactPath);
	const data: TContactId[] = JSON.parse(list as unknown as string);
	console.log(data);
	return data;
}

export function saveImage(req: NextApiRequest, photo: string) {
	if (!photo?.isBase64File()) return photo;

	const [status, data] = photo.split(/,/);

	const ext = status.replace(/^.*\//, "").replace(/;.*/, "");
	const filename = `${root}/${uuid()}.${ext}`;

	const { host, ["x-forwarded-proto"]: proto } = req.headers;
	const fileName = `${proto}://${host}${filename.replace(/\.\/public/, "")}`;

	fs.writeFileSync(filename, data, "base64");

	return fileName;
}
