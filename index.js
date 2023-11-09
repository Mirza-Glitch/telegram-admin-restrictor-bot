import { Tgind } from "tgind";
import "dotenv/config";
import { db } from "./db/index.js";
import commandMsgs, { botUsername } from "./message/index.js";
import callback from "./callback/index.js";

let bot = new Tgind(process.env.BOT_TOKEN, {
	start: true
});

export var mutes = new Map();

bot.on("message", async (msg) => {
	const memberDetail = await bot.getMember(msg.chat.id, msg.from.id);

	if (mutes.has(`${msg.from.id}_${msg.chat.id}`)) {
		return memberDetail.status !== "creator"
			? bot.del(msg.chat.id, msg.message_id)
			: null;
	} else if (msg.sticker) {
		if (!db.has(msg.chat.username)) return;
		let data = db.get(msg.chat.username);
		let collection =
			data === "All possible stickers are banned!" ? "all" : JSON.parse(data);
		if (collection === "all" || collection.includes(msg.sticker.set_name))
			return memberDetail.status !== "creator"
				? bot.del(msg.chat.id, msg.message_id)
				: null;
	} else if (msg.text?.startsWith("/")) {
		commandMsgs.forEach((obj, i) => {
			try {
				if (
					(msg.text.startsWith(obj.text) &&
						msg.text.split(" ")[0] === obj.text) ||
					msg.text.split(" ")[0] === obj.text + botUsername
				)
					return obj.cb(msg, memberDetail);
			} catch {}
		});
	}
});

bot.on("callback_query", callback);

import http from "http";

const port = process.env.PORT || 3000;
http
	.createServer((req, res) => {
		res.writeHead(200, { "Content-Type": "text/plain" });
		res.end("Bot is up and running!");
	})
	.listen(port, () => console.log("Server is running on port " + port));

export default bot;
