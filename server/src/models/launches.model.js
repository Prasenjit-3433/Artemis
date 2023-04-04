const { default: mongoose } = require('mongoose');
const launches = require('./launches.mongo');

// const launches = new Map();

let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
};

saveLaunch(launch);

function existsLaunchWithId(launchId) {
    console.log(launches.has(launchId))
    return launches.has(launchId);
}

async function getAllLaunches() {
    return await launches.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
    await launches.updateOne({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    });
}

async function addNewLaunch(launch) {
    latestFlightNumber++;
    const finalLaunchData = Object.assign(launch, { 
        flightNumber: latestFlightNumber, 
        customers: ['ISRO', 'NASA'],
        upcoming: true, 
        success: true 
    });
    await saveLaunch(finalLaunchData);
}

function abortLaunchWithId(launchId) {
    const aborted = launches.get(launchId)
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    addNewLaunch,
    abortLaunchWithId
};