const { defineConfig } = require("drizzle-kit");

require("dotenv").config();

module.exports = defineConfig({
  schema: "./database/schema.js",
  out: "./database/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
