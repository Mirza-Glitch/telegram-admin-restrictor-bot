export function getInlineKeyBoard(keyword) {
	let queryArr = [
		{
			text: "mute/unmute",
			callback_data: "mute_unmute"
		},
		{
			text: "ban/unban",
			callback_data: "ban_unban"
		},
		{
			text: "modify rights",
			callback_data: "modification"
		},
		{
			text: "view rights",
			callback_data: "view_rights"
		}
	];
	if (keyword == "help") return queryArr;

	const myArr = queryArr.map((obj) =>
		obj.callback_data == keyword
			? {
					text: "help",
					callback_data: "help"
			  }
			: obj
	);

	return myArr;
}
