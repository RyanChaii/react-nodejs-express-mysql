const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

// Setting for connection to sql, if virtual not set, use preset
var connection = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    database: process.env.DB_NAME || "tms_system",
    password: process.env.DB_PASSWORD || "admin"
});

// Connecting to mysql
connection.getConnection(error => {
    if (error) throw error;
    console.log("Successfully connected to the database!");
});

// Enable future apps to use the connection
module.exports = connection;