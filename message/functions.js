import bot, { mutes } from "../index.js";
import { db, adminDb } from "../db/index.js";
import { permissionsObj, updateAdminDb } from "../utils/index.js";

const allBannedStickers = "All possible stickers are banned!";

function getMsgReason(msg) {
	let arr = msg.split(" ");
	let newArr = [...arr];
	newArr.shift();
	newArr.shift();
	return newArr.join(" ");
}
function findUserId(searchValue) {
	for (let [key, value] of mutes.entries()) {
		if (value === searchValue) return key;
	}
}
function getTimeout(msgId, time, str = false) {
	let arr = time.split("");
	let upto = arr.pop();
	let timeout = arr.join("");
	let obj = {
		s: { str: "seconds", time: 1000 * Number(timeout) },
		m: { str: "minutes", time: 1000 * 60 * Number(timeout) },
		h: { str: "hours", time: 1000 * 60 * 60 * Number(timeout) },
		d: { str: "days", time: 1000 * 60 * 60 * 24 * Number(timeout) },
		w: { str: "weeks", time: 1000 * 60 * 60 * 24 * 7 * Number(timeout) }
	};
	if (!obj[upto]) return bot.send(msgId, "Please provide a valid timeout.");
	return str ? `${timeout} ${obj[upto].str}` : obj[upto].time;
}

async function mute(msg) {
	const mute_it = (msgId, userId, username, time, reason) => {
		let botMsg = `muted ${username} now`;
		mutes.set(userId, username);
		if (time)
			botMsg += `\nAny messages sent by this user will be now deleted for next ${getTimeout(
				msgId,
				time,
				true
			)}.`;
		else
			botMsg += `\nNo timer was set for ${username}, so any messages sent by this user will be now deleted for next ${getTimeout(
				msgId,
				time,
				true
			)}.`;
		if (reason) botMsg += `\nReason: ${reason}`;

		bot.send(msgId, botMsg);
		setTimeout(
			() => {
				if (!mutes.has(userId)) return;
				mutes.delete(userId);
			},
			getTimeout(msgId, time)
		);
	};
	try {
		if (!msg.reply_to_message)
			return bot.send(
				msg.chat.id,
				"Please Reply to someone's messages to mute them"
			);

		if (msg.reply_to_message.from.id == msg.from.id)
			return bot.send(msg.chat.id, "You cannot mute yourself");

		let muteTo = await bot.getMember(msg.chat.id, msg.reply_to_message.from.id);

		let status = muteTo.status;
		if (status === "creator")
			return bot.send(msg.chat.id, "I'm sorry, i will not mute a creator...");

		let arr = msg.text.split(" ");

		let time = arr[1] || "2m";
		let reason = arr[2] ? getMsgReason(msg.text) : null;
		let username = msg.reply_to_message.from.username || null;

		return mute_it(
			msg.chat.id,
			`${msg.reply_to_message.from.id}_${msg.reply_to_message.chat.id}`,
			username ? `@${username}` : msg.reply_to_message.from.first_name,
			time,
			reason
		);
	} catch (e) {
		console.log("mute command error: ", e);
		return bot.send(
			msg.chat.id,
			"There was an error while using the mute command\nPlease try again later."
		);
	}
}

function unmute(msg) {
	const unmute_it = (userId, username) => {
		if (!mutes.has(userId))
			return bot.send(msg.chat.id, `Looks like ${username} is not muted...`);
		if (!userId) userId = findUserId(username);
		mutes.delete(userId);
		return bot.send(
			msg.chat.id,
			`${username.replace("@@", "@")} can speak now.`
		);
	};
	try {
		if (!msg.reply_to_message) {
			let arr = msg.text.split(" ");
			let username = arr.find((val) => val.startsWith("@")) || arr[1];
			let userId = findUserId(username);
			return unmute_it(
				userId,
				username.startsWith("@") ? `@${username}` : username
			);
		}
		let user = msg.reply_to_message.from.username || null;
		return unmute_it(
			`${msg.reply_to_message.from.id}_${msg.reply_to_message.chat.id}`,
			user ? `@${user}` : msg.reply_to_message.from.first_name
		);
	} catch (e) {
		console.log("unmute command error: ", e);
		return bot.send(
			msg.chat.id,
			"There was an error while using the unmute command\nPlease try again later."
		);
	}
}

const addCollection = (msg, all = false) => {
	const collectionName = msg.reply_to_message?.sticker?.set_name || null;
	const group = msg.chat.username;
	const chatId = msg.chat.id;

	if (all) {
		db.set(group, allBannedStickers);
		return bot.send(
			chatId,
			"Any Sticker sent by anyone will be deleted from now."
		);
	}
	if (!collectionName)
		return bot.send(
			chatId,
			"Please reply to a sticker to ban the sticker collection."
		);
	if (!db.has(group)) {
		db.set(group, JSON.stringify([collectionName]));
		return bot.send(chatId, "Successfully banned a sticker collection!");
	}
	if (db.get(group) === allBannedStickers)
		return bot.send(
			chatId,
			"All the possible stickers are already banned, so no need to ban this specific sticker collection !"
		);

	let oldCollection = JSON.parse(db.get(group));
	oldCollection.push(collectionName);
	db.set(group, JSON.stringify(oldCollection));
	return bot.send(chatId, "Successfully banned a sticker collection!");
};

const removeCollection = (msg, all = false) => {
	const collectionName = msg.reply_to_message?.sticker?.set_name || null;
	const chatId = msg.chat.id;
	const group = msg.chat.username;
	if (!db.has(group))
		return bot.send(
			chatId,
			"Looks like no sticker collection was added to be banned..."
		);
	if (all) {
		db.delete(group);
		return bot.send(chatId, "Admins can sent Sticker now.");
	}
	let oldCollection = JSON.parse(db.get(group));
	if (!collectionName) {
		let args = msg.text.split(" ");
		args.shift();
		args.forEach((collectionName) => {
			oldCollection = oldCollection.filter((val) => val !== collectionName);
		});
		db.set(group, JSON.stringify(oldCollection));
		return bot.send(chatId, "Successfully unbanned sticker collection!");
	} else if (!oldCollection.includes(collectionName)) {
		return bot.send(
			chatId,
			"Looks like this sticker is not banned, so you cannot unban it..."
		);
	}
	oldCollection = oldCollection.filter((val) => val !== collectionName);
	db.set(group, JSON.stringify(oldCollection));
	return bot.send(chatId, "Successfully unbanned a sticker collection!");
};

const checkCollection = (msg) => {
	const group = msg.chat.username;
	const chatId = msg.chat.id;
	const noCollectionMsg = `${group} group doesn't have any stickers banned...`;

	if (!db.has(group)) return bot.send(chatId, noCollectionMsg);

	const data = db.get(group);

	if (data == allBannedStickers) return bot.send(chatId, data);

	if (JSON.parse(data).length === 0) return bot.send(chatId, noCollectionMsg);

	return bot.send(
		chatId,
		`Here's a list of all the banned sticker collection of ${group}:\n${JSON.parse(
			data
		).join("\n")}`
	);
};

async function modifyRights(msg) {
	let groupAdmins = JSON.parse(adminDb.get(msg.chat.username));
	let currMember;

	let args = msg.text.split(" ");
	let settings = [...args];
	if (msg.reply_to_message)
		currMember = groupAdmins.find(
			(obj) => obj.id == msg.reply_to_message.from.id
		);
	else if (args[1].startsWith("@")) {
		currMember = groupAdmins.find(
			(obj) => obj.username == args[1].substring(1)
		);
		settings.shift();
	}
	settings.shift();
	if (currMember.status === "creator")
		return bot.send(
			msg.chat.id,
			"Group Creator's permissions cannot be changed by anyone."
		);
	settings.forEach((arg) => {
		if (arg.trim() == "") return;
		else if (arg.trim().startsWith("!")) currMember[arg.substring(1)] = false;
		else currMember[arg] = true;
	});

	const newAdminsData = groupAdmins.map((obj) =>
		obj.id !== currMember.id ? obj : currMember
	);

	adminDb.set(msg.chat.username, JSON.stringify(newAdminsData));
	return bot.send(
		msg.chat.id,
		`Successfully updated permissions for ${
			currMember.username ? "@" + currMember.username : currMember.first_name
		}`
	);
}

function removeAllAdmins(msg) {
	let groupAdmins = JSON.parse(adminDb.get(msg.chat.username));
	let currMember;
	if (msg.reply_to_message)
		currMember = groupAdmins.find(
			(obj) => obj.id == msg.reply_to_message.from.id
		);
	let args = msg.text.split(" ");
	if (args[1].startsWith("@")) {
		currMember = groupAdmins.find(
			(obj) => obj.username == args[1].substring(1)
		);
	}
	if (currMember.status === "creator")
		return bot.send(
			msg.chat.id,
			"Group Creator's permissions cannot be changed by anyone."
		);
	Object.keys(permissionsObj).forEach((key) => {
		currMember[key] = false;
	});
	adminDb.set(msg.chat.username, JSON.stringify(groupAdmins));
	return bot.send(
		msg.chat.id,
		`Successfully removed all the admin permissions for ${
			currMember.username ? "@" + currMember.username : currMember.first_name
		}`
	);
}

async function listPermissions(msg, member, singleAdmin = false) {
	try {
		let groupAdmins = adminDb.has(msg.chat.username)
			? JSON.parse(adminDb.get(msg.chat.username))
			: null;

		if (!groupAdmins) groupAdmins = await updateAdminDb(msg);

		if (singleAdmin) {
			let gcAdmins = await groupAdmins;
			if (msg.reply_to_message)
				groupAdmins = gcAdmins.find(
					(obj) => obj.id === msg.reply_to_message.from.id
				);
			else {
				let args = msg.text.split(" ");
				let username = args.find((val) => val.startsWith("@")) || null;
				if (username)
					groupAdmins = gcAdmins.find(
						(obj) => obj.username === username.trim().substring(1)
					);
				else
					groupAdmins =
						gcAdmins.find((obj) => obj.first_name === args[1]?.trim()) || null;
			}
		}
		if (!groupAdmins)
			return bot.send(
				msg.chat.id,
				"No admins found. Please provide a valid admin username or reply to a admin message using this command."
			);
		let myDataStr = "";
		let loopArr = Array.isArray(groupAdmins) ? groupAdmins : [groupAdmins];
		loopArr.forEach((obj) => {
			let myArr = Object.keys(permissionsObj).map((key) => {
				return `${key}: ${obj[key] ? "Yes" : "No"}`;
			});
			let name = obj.username ? `@${obj.username}` : obj.first_name;
			myDataStr += `Admin ${name} can:\n\n${myArr.join("\n")}\n\n\n`;
		});
		return bot.send(msg.chat.id, myDataStr);
	} catch (e) {
		console.log("An Error occurred while getting this admin rights: ", e);
		return bot.send(
			msg.chat.id,
			"An Error occurred while getting this admin rights."
		);
	}
}

async function updateAdmins(msg) {
	await updateAdminDb(msg);
	return bot.send(msg.chat.id, "Successfully updated admins list.");
}

export {
	mute,
	unmute,
	addCollection,
	removeCollection,
	checkCollection,
	modifyRights,
	removeAllAdmins,
	listPermissions,
	updateAdmins
};
