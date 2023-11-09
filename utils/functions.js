import { permissionsObj } from "./index.js";

export const updateAdminDb = async (msg) => {
	try {
		let admins = await bot.getAdmins(msg.chat.id);
		var data = Object.values(admins).map((obj) => {
			let myObj =
				obj.status == "creator"
					? {
							...permissionsObj,
							muteAdmin: true,
							unmuteAdmin: true,
							modifyAdminRights: true,
							removeAdminsRights: true,
							updateAdminslist: true
					  }
					: permissionsObj;
			return { ...obj.user, status: obj.status, ...myObj };
		});
		if (adminDb.has(msg.chat.username)) {
			let prevData = JSON.parse(adminDb.get(msg.chat.username));
			let newData = [...prevData, ...data].filter(
				(v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
			);
			adminDb.set(msg.chat.username, JSON.stringify(newData));
			return newData;
		} else {
			adminDb.set(msg.chat.username, JSON.stringify(data));
			return data;
		}
	} catch (e) {
		console.log("error occured while setting admins in db: ", e);
		return bot.send(
			msg.chat.id,
			"An error occured while updating admins in database. Please try again later..."
		);
	}
};
