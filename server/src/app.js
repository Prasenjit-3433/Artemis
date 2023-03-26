const path = require('path');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const planetsRouter = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/launches/launches.router');

const app = express();

// middlewares
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes or End-Points
app.use(planetsRouter);
app.use(launchesRouter);

// Serving the Production-build with Client-Side Routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;