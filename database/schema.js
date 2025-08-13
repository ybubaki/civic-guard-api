const { sqliteTable, text, integer } = require("drizzle-orm/sqlite-core");
const { sql, relations } = require("drizzle-orm");

exports.userTable = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  phone: text("phone").default(null).unique(),
  rating: integer("rating").notNull().default(0),
  role: text("role").notNull().default("user"),
  password: text("password").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

exports.usersRelations = relations(exports.userTable, ({ many }) => ({
  reports: many(exports.issueTable),
}));

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

exports.issueRelations = relations(exports.issueTable, ({ one }) => ({
  author: one(exports.userTable, {
    fields: [exports.issueTable.userId],
    references: [exports.userTable.id],
  }),
}));

exports.otpTable = sqliteTable("otps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  otp: text("otp").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => exports.userTable.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
