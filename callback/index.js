import { getInlineKeyBoard } from "./functions.js";
import {
	helpMsg,
	muteUnmuteQuery,
	banUnbanQuery,
	modificationQuery,
	viewRightsQuery
} from "./messages.js";

export default function callBack(query) {
	if (query.data == "close") return query.del(query.message_id);

	let myObj = {
		help: () => helpMsg,
		mute_unmute: () => muteUnmuteQuery,
		ban_unban: () => banUnbanQuery,
		modification: () => modificationQuery,
		view_rights: () => viewRightsQuery
	};
	try {
		let inlineKeyboard = getInlineKeyBoard(query.data);

		query.edit(query.message_id, myObj[query.data](), {
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [
					[inlineKeyboard[0], inlineKeyboard[1]],
					[inlineKeyboard[2], inlineKeyboard[3]],
					[
						{
							text: "close",
							callback_data: "close"
						}
					]
				]
			}
		});
	} catch (e) {
		console.log("an error occurred in callback query: ", e);
	}
}

export { getInlineKeyBoard, helpMsg };
