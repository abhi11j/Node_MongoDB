Introduction to MongoDB
On this page

Document Database
Key Features
Welcome to the MongoDB 4.2 Manual! MongoDB is a document database designed for ease of development and scaling. The Manual introduces key concepts in MongoDB, presents the query language, and provides operational and administrative considerations and procedures as well as a comprehensive reference section.

MongoDB offers both a Community and an Enterprise version of the database:

MongoDB Community is the source available and free to use edition of MongoDB.
MongoDB Enterprise is available as part of the MongoDB Enterprise Advanced subscription and includes comprehensive support for your MongoDB deployment. MongoDB Enterprise also adds enterprise-focused features such as LDAP and Kerberos support, on-disk encryption, and auditing.
Document Database
A record in MongoDB is a document, which is a data structure composed of field and value pairs. MongoDB documents are similar to JSON objects. The values of fields may include other documents, arrays, and arrays of documents.

A MongoDB document.
The advantages of using documents are:

Documents (i.e. objects) correspond to native data types in many programming languages.
Embedded documents and arrays reduce need for expensive joins.
Dynamic schema supports fluent polymorphism.
Collections/Views/On-Demand Materialized Views
MongoDB stores documents in collections. Collections are analogous to tables in relational databases.

In addition to collections, MongoDB supports:

Read-only Views (Starting in MongoDB 3.4)
On-Demand Materialized Views (Starting in MongoDB 4.2).
Key Features
High Performance
MongoDB provides high performance data persistence. In particular,

Support for embedded data models reduces I/O activity on database system.
Indexes support faster queries and can include keys from embedded documents and arrays.
Rich Query Language
MongoDB supports a rich query language to support read and write operations (CRUD) as well as:

Data Aggregation
Text Search and Geospatial Queries.
SEE ALSO

SQL to MongoDB Mapping Chart
SQL to Aggregation Mapping Chart
High Availability
MongoDB’s replication facility, called replica set, provides:

automatic failover
data redundancy.
A replica set is a group of MongoDB servers that maintain the same data set, providing redundancy and increasing data availability.

Horizontal Scalability
MongoDB provides horizontal scalability as part of its core functionality:

Sharding distributes data across a cluster of machines.
Starting in 3.4, MongoDB supports creating zones of data based on the shard key. In a balanced cluster, MongoDB directs reads and writes covered by a zone only to those shards inside the zone. See the Zones manual page for more information.
Support for Multiple Storage Engines
MongoDB supports multiple storage engines:

WiredTiger Storage Engine (including support for Encryption at Rest)
In-Memory Storage Engine.
In addition, MongoDB provides pluggable storage engine API that allows third parties to develop storage engines for MongoDB.

//Test Data
[
{
"Newspaper":"Log Angeles Times",
"Daily Circulation, 2004":983727,
"Daily Circulation":653868,
"Changes in Daily Circulation, 2004-2013":-34,
"Pulitzer Prize Winners and Finalists, 1990-2003":44,
"Pulitzer Prize Winners and Finalists, 2004-2014":41,
"Pulitzer Prize Winners and Finalists, 1990-2014":85,
},
{
"Newspaper":"Washington Post",
"Daily Circulation, 2004":983727,
"Daily Circulation":653868,
"Changes in Daily Circulation, 2004-2013":-34,
"Pulitzer Prize Winners and Finalists, 1990-2003":44,
"Pulitzer Prize Winners and Finalists, 2004-2014":41,
"Pulitzer Prize Winners and Finalists, 1990-2014":85,
},
{
"Newspaper":"Washington Post",
"Daily Circulation, 2004":983727,
"Daily Circulation":653868,
"Changes in Daily Circulation, 2004-2013":-34,
"Pulitzer Prize Winners and Finalists, 1990-2003":44,
"Pulitzer Prize Winners and Finalists, 2004-2014":41,
"Pulitzer Prize Winners and Finalists, 1990-2014":85,
},
{
"Newspaper":"Washington Post",
"Daily Circulation, 2004":983727,
"Daily Circulation":653868,
"Changes in Daily Circulation, 2004-2013":-34,
"Pulitzer Prize Winners and Finalists, 1990-2003":44,
"Pulitzer Prize Winners and Finalists, 2004-2014":41,
"Pulitzer Prize Winners and Finalists, 1990-2014":85,
},
{
"Newspaper":"Washington Post",
"Daily Circulation, 2004":983727,
"Daily Circulation":653868,
"Changes in Daily Circulation, 2004-2013":-34,
"Pulitzer Prize Winners and Finalists, 1990-2003":44,
"Pulitzer Prize Winners and Finalists, 2004-2014":41,
"Pulitzer Prize Winners and Finalists, 1990-2014":85,
}
]


------------------
MongoDB 4.2
https://www.mongodb.com/download-center/community
https://www.mongodb.com/products/compass
https://docs.mongodb.com/manual/aggregation/



//Commands
Ensure that MongoDB is running before attempting to start the mongo shell.
cd "C:\Program Files\MongoDB\Server\4.2\bin"

if you do not specify a --dbpath, starting a MongoDB server on the C:\ drive stores all data files in C:\data\db.
To start MongoDB using all defaults, issue the following command at the system shell:
mongod

To start MongoDB, run mongod.exe:
mongod.exe --dbpath="c:\data\db"

Local MongoDB Instance on Default Port
You can run mongo shell without any command-line options to connect to a MongoDB instance running on your localhost with default port 27017:
mongo

//output
MongoDB server version: 4.2.3
//connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
//Implicit session: session { "id" : UUID("09407ae3-a607-435a-8d20-d32d678732e1") }

Local MongoDB Instance on a Non-default Port:
mongo --port 28015
or
mongod --port 12345

MongoDB Instance with Authentication:
mongo --username alice --password --authenticationDatabase admin --host mongodb0.examples.com --port 28015

To run a mongod process as a daemon (i.e. fork), and write its output to a log file:
mongod --fork --logpath /var/log/mongodb/mongod.log

Shut down the mongod from the mongo shell using the db.shutdownServer() method as follows:
use admin
db.shutdownServer()

Within the shell, db refers to your current database. Type db to display the current database:
db

To switch databases, type use <db>. For example, to switch to the examples database:
use <database>

Following creates both the database myNewDatabase and the collection myCollection during the insertOne() operation:
use myNewDatabase
db.myCollection.insertOne( { x: 1 } );

MongoDB CRUD Operations

Insert a Single Document:
db.inventory.insertOne(
   { item: "canvas", qty: 100, tags: ["cotton"], size: { h: 28, w: 35.5, uom: "cm" } }
)

To retrieve the document that you just inserted, query the collection:
db.inventory.find( { item: "canvas" } )

Insert Multiple Documents:
db.inventory.insertMany([
   { item: "journal", qty: 25, tags: ["blank", "red"], size: { h: 14, w: 21, uom: "cm" } },
   { item: "mat", qty: 85, tags: ["gray"], size: { h: 27.9, w: 35.5, uom: "cm" } },
   { item: "mousepad", qty: 25, tags: ["gel", "blue"], size: { h: 19, w: 22.85, uom: "cm" } }
])

To retrieve the inserted documents, query the collection:
db.inventory.find( {} )

Update a Single Document:
db.inventory.updateOne(
   { item: "paper" },
   {
     $set: { "size.uom": "cm", status: "P" },
     $currentDate: { lastModified: true }
   }
)


The following example deletes all documents from the inventory collection:
db.inventory.deleteMany({})

------------------------
MongoDB Atlas for DBaas
https://cloud.mongodb.com/v2/5e41ca27cf09a258ddf7be91#metrics/replicaSet/5e41cc0ff2a30b225de8778e/explorer

MongoDB Compass for GUI
https://www.mongodb.com/products/compass

//ATLAS connection string for mongoDB Compass
mongodb+srv://<username>:<password>@cluster0-x8po3.azure.mongodb.net/test

//Local connection string for mongoDB Compass
mongodb://127.0.0.1:27017/admin


//Excersize

use myNewDatabase

db.Users.insertMany([
   { name: "Tris", age: 8},
   { name: "bps", age: 35},
   { name: "SP", age: 30},
])

db.Users.find({})

db.Users.find({name:"bps"})

db.Users.update(
   { _id: ObjectId("5e430a937fccba1fd6428f1f") },
   {    
     $set: {
       name: "Trisha"
     }
   }
)

db.Users.remove({name:"SP"})

---------------------------------
//Node MondoDB project

open VS code project and open folder where you want to pull
Open Terminal

>mongo

>npm init
>npm install mongodb
>npm install mongodb@4.2

>node app.js

ctrl+C

//Test harness


//stored javascript
//MongoDB doesn’t have an exact equivalent to stored procedures but it does offer a feature stored javascript that offers similar functionality

//MongoDB provides a special collection on every database called system.js where you can put your custom javascript functions.
>db.system.js.save({_id: "sum", value: function(x,y) { return x+y;}});
WriteResult({ "nMatched" : 0, "nUpserted" : 1, "nModified" : 0, "_id" : "sum" })

>db.test.save({x: 4, y: 2});
WriteResult({ "nInserted" : 1 })
>db.test.save({x: 4, y: 2});
WriteResult({ "nInserted" : 1 })
>db.test.save({x: 100, y: 2});
WriteResult({ "nInserted" : 1 })

> db.test.find({$where: "sum(this.x, this.y) == 6"});
{ "_id" : ObjectId("5cf698db86d331b7a14adf38"), "x" : 4, "y" : 2 }
{ "_id" : ObjectId("5cf698df86d331b7a14adf39"), "x" : 4, "y" : 2 }

Viewing all stored procedures
> db.system.js.find()
{ "_id" : "sum", "value" : { "code" : "function (x,y) { return x+y;}" } }


2
> db.system.js.distinct("_id");
[ "sum" ]


//MongoDB Aggregation









