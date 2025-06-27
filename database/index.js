const { drizzle } = require("drizzle-orm/better-sqlite3");
const Database = require("better-sqlite3");
const schema = require("./schema");

const sqlite = new Database("./db.sqlite3");

const db = drizzle({ client: sqlite, schema: { ...schema } });

module.exports = db;
