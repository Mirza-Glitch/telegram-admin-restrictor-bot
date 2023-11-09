export const helpMsg = `Welcome to Admin Restrictor Bot, the ultimate tool for managing your Telegram group. With Admin Restrictor Bot, you can:

- Control the permissions of other admins in your group by muting/unmuting them.
- Control what stickers can be shared in your group, and block unwanted or inappropriate stickers.
- View the statistics of your group, such as list of banned stickers and permissions of other admins to use this bot.

To use Admin Restrictor Bot, simply add it to your group and grant it admin rights. Send /commands to view all the commands.
`;

export const muteUnmuteQuery = `An admin or group creator can mute or unmute another admin using following commands.
- /mute_person: Mute a specific person/admin in the group. Usage: /mute_person [duration] [username]. Add username if not replying to an admin's message. During should be a number followed by a s/m/h/d/w. 
  Example usage: /mute_person 5m @admin02. This will mute @admin02 for 5 minutes. If you don't pass a duration then bot will automatically mute the user for 2 minutes.
- /unmute_person: Unmute a muted member. Example usage: /mute_person @admin02. This will simply unmute the muted member.
`;

export const banUnbanQuery = `Use these commands to ban/unban the usage of stickers in your group.

- /ban_all_stickers: Ban usage of all stickers in the group. This will start deleting all the new stickers sent by any member in group.
- /unban_all_stickers: Unban usage of all stickers in the group.
- /ban_collection: Ban a specific sticker collection.
- /unban_collection: Unban a previously banned sticker collection. You can either reply to previous sticker which was banned or just use the list_banned_collections to get the name of a banned sticker collection.
- /list_banned_collection: View names of all banned sticker collections. 
`;

export const modificationQuery = `Use this commands to modify admin permissions to use this bot.

- /modify_admin_rights: Modify admin rights for specific users. This command will modify admins right. Keywords to be used followed by this command are:
 
  - <b>muteAdmin</b>: defaults to false. If set to true, then an admin can mute another admin.
  - <b>unmuteAdmin</b>: defaults to false. If set to true, then an admin can unmute another admin.
  - <b>banAllStickers</b>: defaults to true. This allows an admin to ban all the stickers from a group.
  - <b>unbanAllStickers</b>: defaults to true. This allows an admin to unban all the stickers from a group.
  - <b>banStickers</b>: defaults to true. This allows an admin to ban a specific sticker collection from a group.
  - <b>unbanStickers</b>: defaults to true. This allows an admin to unban a specific sticker collection from a group.
  - <b>listBannedCollection</b>: defaults to true. This allows an admin to get a list of banned sticker collection from a group.
  - <b>modifyAdminRights</b>: defaults to false. This permission is only given to creator of the group. This allows to change admins rights from a group. This permission can also be enabled for other admins.
  - <b>removeAdminsRights</b>: defaults to false. This permission is only given to creator of the group. This allows an admin to remove all admins rights of another admin for using this bot in a group. This permission can also be enabled for other admins. 
  - <b>viewAdminsRights</b>: defaults to true. Allows an admin to view admin rights of specific admin or all the admins from a group.

The group creator or any allowed admin can modify admin rights of another admin using the above keywords. For example, message like "/modify_admin_rights @adminUsername !banStickers !unbanStickers" will set the banStickers and unbanStickers permissions to false of the tagged admin. message like "/modify_admin_rights @adminUsername muteAdmin unmuteAdmin" will set the muteAdmin and unmuteAdmin permissions to true of the tagged admin. If an admin doesn't have a username then simply reply to that admin's message (no need to tag using "@"). simply pass the admin permission keyword to enable that permission, or prefix the admin permissions keywords with a "!" to disable it.

- /no_admin_allowed: Restrict all admin rights for specific admin.
`;

export const viewRightsQuery = `Admins may sometimes need to view their own/other admins permissions of using this bot. Following commands may be helpful in thay scenario:

- /show_all_admins_rights: Display admin rights of all the admins in a group.
- /show_admin_rights: Display admin rights of an admin in a group (Tip: an admin can view his own permissions by replying to his own message using this command).
- /update_admins_list: Group creator or an admin should use this command everytime the group creator adds/removes an admin from group.
`;
