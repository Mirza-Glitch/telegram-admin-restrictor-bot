import JSONdb from "simple-json-db";

const db = new JSONdb("./db/data.json");
const adminDb = new JSONdb("./db/admins.json");

export { db, adminDb };