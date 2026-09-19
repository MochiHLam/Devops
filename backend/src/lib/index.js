/**
 * lib/index.js — Re-exports all shared clients/utilities
 * Makes imports cleaner: require('../lib') instead of individual paths
 */

const pool = require("../config/db");
const { docClient, TABLE_NAME } = require("../config/dynamodb");
const { s3Client, BUCKET } = require("../config/s3");

module.exports = { pool, docClient, TABLE_NAME, s3Client, BUCKET };
