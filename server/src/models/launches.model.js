const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

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

async function doesLaunchExistWithId(launchId) {
    const launchWithId = await launches.findOne({ flightNumber: launchId });  
    return launchWithId ? true : false;
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches.findOne().sort('-flightNumber');

    return latestLaunch ? latestLaunch.flightNumber : DEFAULT_FLIGHT_NUMBER; 
}

async function getAllLaunches() {
    return await launches.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
    const planet = await planets.findOne({ keplerName: launch.target });

    if (!planet) {
      throw new Error('No matching planet found!');
    }

    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    });
}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        flightNumber: newFlightNumber, 
        customers: ['ISRO', 'NASA'],
        upcoming: true, 
        success: true 
    });

    await saveLaunch(newLaunch);
}

async function abortLaunchWithId(launchId) {
    const aborted = await launches.updateOne({ flightNumber: launchId }, { 
        upcoming : false, 
        success : false 
    });

    return aborted.modifiedCount === 1; 
}

module.exports = {
    doesLaunchExistWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchWithId
};