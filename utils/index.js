import bot from "../index.js";
import { adminDb } from "../db/index.js";
import { commandsMsg } from "./message.js";
import { helpMsg, getInlineKeyBoard } from "../callback/index.js";
export { updateAdminDb } from "./functions.js";

var permissionsObj = {
	muteAdmin: false,
	unmuteAdmin: false,
	banAllStickers: true,
	unbanAllStickers: true,
	banStickers: true,
	unbanStickers: true,
	listBannedCollection: true,
	modifyAdminRights: false,
	removeAdminsRights: false,
	viewAllAdminsRights: true,
	seeAdminRights: true,
	updateAdminslist: false
};

const start = (msg) =>
	bot.send(
		msg.chat.id,
		"Admin Restrictor Bot is up and running.\nUse /help to know all the commands."
	);

const help = (msg) => {
	let myArr = getInlineKeyBoard("help");
	bot.send(msg.chat.id, helpMsg, {
		reply_markup: {
			inline_keyboard: [
				[myArr[0], myArr[1]],
				[myArr[2], myArr[3]],
				[{ text: "close", callback_data: "close" }]
			]
		}
	});
};

const commands = (msg) => bot.send(msg.chat.id, commandsMsg);

const sanitizeUser = async (msg, member, context, cb) => {
	let groupAdminData = adminDb.has(msg.chat.username)
		? JSON.parse(adminDb.get(msg.chat.username))
		: null;
	if (member.status === "administrator" || member.status === "creator") {
		try {
			if (!groupAdminData || !adminDb.has(msg.chat.username))
				groupAdminData = await updateAdminDb(msg);
			let currMember = await groupAdminData.find(
				(obj) => obj.id == msg.from.id
			);
			if (currMember[context]) return cb();
			else
				return bot.send(
					msg.chat.id,
					`You don't have permission to use "${context}" command.`
				);
		} catch (err) {
			console.log("error while sanitizing the command for user: ", err);
		}
	} else {
		bot.send(msg.chat.id, "You need to be admin to use this command.");
	}
};

export { permissionsObj, start, help, commands, sanitizeUser };
