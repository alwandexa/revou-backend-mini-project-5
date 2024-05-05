"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable("usersx", {
    user_id: { type: "int", primaryKey: true, autoIncrement: true },
    email: { type: "string", unique: true, length: 255 },
    password: { type: "string", length: 255 },
    name: { type: "string", length: 255 },
    // role: { type: "enum", values: ["admin", "user"] },
    birthdate: { type: "date" },
    created_at: {
      type: "timestamp",
      defaultValue: new String("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: "timestamp",
      defaultValue: new String("CURRENT_TIMESTAMP"),
    },
    deleted_at: { type: "timestamp", allowNull: true },
  });
};

exports.down = function (db) {
  return db.dropTable("users");
};

exports._meta = {
  version: 1,
};
