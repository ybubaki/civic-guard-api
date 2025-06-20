const { sqliteTable, text, integer } = require("drizzle-orm/sqlite-core");
const { sql } = require("drizzle-orm");

exports.userTable = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("user"),
  password: text("password").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

exports.issueTable = sqliteTable("issues", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  category: text("category").notNull(),
  description: text("description").notNull(),
  city: text("city"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  status: text("status").notNull().default("open"),
  priority: text("priority").notNull().default("normal"),
  imageUrl: text("image_url").notNull().default(""),
  userId: integer("user_id")
    .notNull()
    .references(() => exports.userTable.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

exports.otpTable = sqliteTable("otps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  otp: text("otp").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => exports.userTable.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
