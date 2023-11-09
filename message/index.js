import {
	mute,
	unmute,
	addCollection,
	removeCollection,
	checkCollection,
	modifyRights,
	removeAllAdmins,
	listPermissions,
	updateAdmins
} from "./functions.js";
import { start, help, commands, sanitizeUser } from "../utils/index.js";

export var botUsername = "@OffTopicSpecialBot";

const commandMsgs = [
	{
		text: "/start",
		cb: start
	},
	{
		text: "/help",
		cb: help
	},
	{
		text: "/commands",
		cb: commands
	},
	{
		text: "/mute_person",
		cb: async (msg, member) =>
			await sanitizeUser(msg, member, "muteAdmin", () => mute(msg))
	},
	{
		text: "/unmute_person",
		cb: async (msg, member) =>
			await sanitizeUser(msg, member, "unmuteAdmin", () => unmute(msg))
	},
	{
		text: "/ban_all_stickers",
		cb: async (msg, member) =>
			await sanitizeUser(msg, member, "banAllStickers", () =>
				addCollection(msg, true)
			)
	},
	{
		text: "/unban_all_stickers",
		cb: async (msg, member) =>
			await sanitizeUser(msg, member, "unbanAllStickers", () =>
				removeCollection(msg, true)
			)
	},
	{
		text: "/ban_collection",
		cb: async (msg, member) =>
			await sanitizeUser(msg, member, "banStickers", () => addCollection(msg))
	},
	{
		text: "/unban_collection",
		cb: async (msg, member) =>
			await sanitizeUser(msg, member, "unbanStickers", () =>
				removeCollection(msg)
			)
	},
	{
		text: "/list_banned_collection",
		cb: async (msg, member) =>
			await sanitizeUser(msg, member, "listBannedCollection", () =>
				checkCollection(msg)
			)
	},
	{
		text: "/modify_admin_rights",
		cb: async (msg, member) =>
			await sanitizeUser(
				msg,
				member,
				"modifyAdminRights",
				async () => await modifyRights(msg, member)
			)
	},
	{
		text: "/remove_admin_rights",
		cb: async (msg, member) =>
			await sanitizeUser(msg, member, "removeAdminsRights", () =>
				removeAllAdmins(msg, member)
			)
	},
	{
		text: "/show_all_admins_rights",
		cb: async (msg, member) =>
			await sanitizeUser(msg, member, "viewAllAdminsRights", () =>
				listPermissions(msg, member)
			)
	},
	{
		text: "/show_admin_rights",
		cb: async (msg, member) =>
			await sanitizeUser(msg, member, "seeAdminRights", () =>
				listPermissions(msg, member, true)
			)
	},
	{
		text: "/update_admins_list",
		cb: async (msg, member) => {
			await sanitizeUser(msg, member, "updateAdminsList", () => {
				updateAdmins(msg, member);
			});
		}
	}
];

export default commandMsgs;
