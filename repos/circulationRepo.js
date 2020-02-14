const {MongoClient,ObjectID}=require('mongodb');

function circulationRepo(){
    const url= 'mongodb://127.0.0.1:27017';
    const dbName ='circulation';

    function getById(id){
        return new Promise(async(resolve,reject)=>{
            const client =new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
            try{
                await client.connect();
                const db=client.db(dbName);

                const item = await db.collection('newspapers').findOne({_id:ObjectID(id)});

                resolve(item);
                client.close();
            }catch(error){
                reject(error);
            }
        })
    }

    function get(query,limit){
        return new Promise(async(resolve,reject)=>{
            const client =new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
            try{
                await client.connect();
                const db=client.db(dbName);

                const items = db.collection('newspapers').find(query);

                // if(limit>0){
                //     items =items.limit(limit);
                // }

                resolve(await items.toArray());
                client.close();
            }catch(error){
                reject(error);
            }
        })
    }

    function loadData(data){
        return new Promise(async (reslove,reject)=>{
            const client =new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
            try{
                await client.connect();
                const db = client.db(dbName);

                result = await db.collection('newspapers').insertMany(data);
                reslove(result);
                client.close();

            } catch(error){
                reject(error);
            }
        })
    }

    function add(item){
        return new Promise(async(resolve,reject)=>{
            const client =new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
            try{
                await client.connect();
                const db=client.db(dbName);

                const addedItem = await db.collection('newspapers').insertOne(item);
                resolve(addedItem.ops[0]);
                client.close();
            }catch(error){
                reject(error);
            }
        })
    }

    function update(id, newItem){
        return new Promise(async(resolve,reject)=>{
            const client =new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
            try{
                await client.connect();
                const db=client.db(dbName);

                const updatedItem = await db.collection('newspapers')
                .findOneAndReplace({_id:ObjectID(id)},newItem,{returnOriginal:false});

                resolve(updatedItem.value);
                client.close();
            }catch(error){
                reject(error);
            }
        })
    }

    function remove(id){
        return new Promise(async(resolve,reject)=>{
            const client =new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
            try{
                await client.connect();
                const db=client.db(dbName);

                const removed = await db.collection('newspapers')
                .deleteOne({_id:ObjectID(id)});

                resolve(removed.deletedCount==1);
                client.close();
            }catch(error){
                reject(error);
            }
        })
    }

    function averageFinallists(){
        return new Promise(async(resolve,reject)=>{
            const client =new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
            try{
                await client.connect();
                const db=client.db(dbName);

                const average = await db.collection('newspapers')
                .aggregate([{$group:
                    {
                        _id:null,
                        avgFinalists:{$avg:"$Pulitzer Prize Winners and Finalists, 1990-2003"}
                    }}]).toArray();

                resolve(average[0].avgFinalists);
                client.close();
            }catch(error){
                reject(error);
            }
        })
    }


    function averageFinallistsByChange(){
        return new Promise(async(resolve,reject)=>{
            const client =new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
            try{
                await client.connect();
                const db=client.db(dbName);

                const average = await db.collection('newspapers')
                .aggregate([
                    {$project:{
                        "Newspaper":1,
                        "Pulitzer Prize Winners and Finalists, 1990-2003":1,               
                        "Changes in Daily Circulation, 2004-2013":1, 
                        overallChange:{
                            $cond:{if:{$gte:["$Changes in Daily Circulation, 2004-2013",0]}, then: "Positive", else: "negative"}
                        }               
                    }},
                    {$group:
                        {
                            _id:"$overallChange",
                            avgFinalists:{$avg:"$Pulitzer Prize Winners and Finalists, 1990-2003"}
                        }}
                ]).toArray();

                resolve(average);
                client.close();
            }catch(error){
                reject(error);
            }
        })
    }



    return {loadData, get, getById,add, update, remove, averageFinallists, averageFinallistsByChange}
}

module.exports=circulationRepo();