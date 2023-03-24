const express = require('express');

const planetsRouter = require('./routes/planets/planets.router');

const app = express();

// middlewares
app.use(express.json());

// Routes or End-Points
app.use(planetsRouter);

module.exports = app;