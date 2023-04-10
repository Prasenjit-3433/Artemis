const axios = require('axios');

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

const launch = {
    flightNumber: 100, // flightNumber
    mission: 'Kepler Exploration X', // name
    rocket: 'Explorer IS1', // rocket.name
    launchDate: new Date('December 27, 2030'), // date_local
    target: 'Kepler-442 b', // not applicable
    customers: ['ZTM', 'NASA'], // payloads[0].customers
    upcoming: true, // upcoming
    success: true // success
};

saveLaunch(launch);

async function loadLaunchesData() {
    console.log('Downloading launch data...');
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    });

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc.payloads;
        const customers = payloads.flatMap(payload => payload.customers);

        const launch = {
            flightNumber: launchDoc.flight_number,
            mission: launchDoc.name, 
            rocket: launchDoc.rocket.name,
            launchDate: launchDoc.date_local,
            target: 'Not Applicable',
            customers: customers, 
            upcoming: launchDoc.upcoming, 
            success: launchDoc.success,
        };

        console.log(launch.flightNumber, launch.customers);
    }
}

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
    loadLaunchesData,
    doesLaunchExistWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchWithId
};