const path = require('path');
const fs = require('fs');

const { parse } = require('csv-parse');

const planetsCollection = require('./planets.mongo');

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' 
    && planet['koi_insol'] > 0.36 
    && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

async function savePlanet(planet) {
    try {
        await planetsCollection.updateOne({
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.kepler_name,
        }, {
            upsert: true
        });
    } catch (err) {
        console.error(`Could not save the planet ${err}`);
    }
}

async function getAllPlanets() {
    return await planetsCollection.find({}, { _id: 0, __v: 0 });
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true
        }))
        .on('data', async (data) => {
            if (isHabitablePlanet(data)) {
                // insert the new document only if no such document is found
                await savePlanet(data);
            }
        })
        .on('error', (error) => {
            console.log(error);
            reject(error);
        })
        .on('end', async () => {
            const countPlanetsFound = (await getAllPlanets()).length;
            console.log(`${countPlanetsFound} habitable planets found!`);
            resolve();
        });

    });
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
};