const express = require('express');

const app = express();

// middlewares
app.use(express.json());

module.exports = app;