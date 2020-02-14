const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const circulationRepo = require('./repos/circulationRepo');
const data = require('./circulation.json');

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'circulation';

async function main() {

    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    try {
        const results = await circulationRepo.loadData(data);

        assert.equal(data.length, results.insertedCount);

        console.log(result.insertedCount, results.ops);

        const getData = await circulationRepo.get();
        assert.equal(data.length, getData.length);

        const filterData = await circulationRepo.get({ Newspaper: getData[2].Newspaper });
        assert.deepEqual(filterData[0], getData[2]);

        const limitData = await circulationRepo.get({}, 2);
        //assert.equal(limitData.length,2);

        const id = getData[2]._id.toString();
        const byId = await circulationRepo.getById(getData[2]._id);
        assert.deepEqual(byId, getData[2]);


        const newItem = {
            "Newspaper": "GWL Today",
            "Daily Circulation, 2004": 983727,
            "Daily Circulation": 653868,
            "Changes in Daily Circulation, 2004-2013": -34,
            "Pulitzer Prize Winners and Finalists, 1990-2003": 44,
            "Pulitzer Prize Winners and Finalists, 2004-2014": 41,
            "Pulitzer Prize Winners and Finalists, 1990-2014": 85
        };

        const addedItem = await circulationRepo.add(newItem);
        assert(addedItem._id);
        const addedItemQuery = await circulationRepo.getById(addedItem._id);
        assert.deepEqual(addedItemQuery, newItem);

        const updatedItem = await circulationRepo.update(addedItem._id, {
            "Newspaper": "New Cheena Today",
            "Daily Circulation, 2004": 983727,
            "Daily Circulation": 653868,
            "Changes in Daily Circulation, 2004-2013": -34,
            "Pulitzer Prize Winners and Finalists, 1990-2003": 44,
            "Pulitzer Prize Winners and Finalists, 2004-2014": 41,
            "Pulitzer Prize Winners and Finalists, 1990-2014": 85
        });
        assert.equal(updatedItem.Newspaper,"New Cheena Today");
        const newAddedItemQuery = await circulationRepo.getById(addedItem._id);
        assert.equal(newAddedItemQuery.Newspaper, "New Cheena Today");

        const removed = await circulationRepo.remove(addedItem._id);
        assert(removed);
        const deletedItem = await circulationRepo.getById(addedItem._id);
        assert.equal(deletedItem, null);

        const avgFinalists = await circulationRepo.averageFinallists();
        console.log("Average Finalists: "+avgFinalists);

        const avgByChange = await circulationRepo.averageFinallistsByChange();
        console.log(avgByChange);

    }
    catch (error) {
        console.log(error);
    }
    finally {
        const admin = client.db(dbName).admin();

        await client.db(dbName).dropDatabase();

        //console.log(await admin.serverStatus());
        console.log(await admin.listDatabases());

        client.close();
    }


}


main();