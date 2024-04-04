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
