var mysql = require("mysql");

// Converts a callback based function to a promise based function
var Bluebird = require("bluebird");

// Connection object for MySQL. A connection object that has methods like connect(), query().
// When you create a connection with mysql.createConnection, you only have one connection, and it lasts until you close it OR connection closed by MySQL.
// A single connection is blocking. While executing one query, it cannot execute others. Hence, your application will not perform good.
// mysql.createPool is a place where connections get stored.
// When you request a connection from a pool,you will receive a connection that is not currently being used, or a new connection.
// If you’re already at the connection limit, it will wait until a connection is available before it continues.

/*
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testdb3",
});
*/

var connectionFromPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "testdb3",
  connectionLimit: 10, // Maximum number of connections to create at once
});

Bluebird.promisifyAll(connectionFromPool);

// Blubird mere connection.connect method ko promisify kardo
// Because connect is a method of the connection object, we bind it so this inside connect() refers to the correct context (connection).
// var connectAsync = Bluebird.promisify(connectionFromPool.getConnection).bind(connectionFromPool);
// connectAsync humme ek promise return karega which we can use to resolve or reject
// Original connect() humara callback based hain, Usko humne promisify kiya hai

/*
connection.connect(err => {
  if (err) throw err;
  console.log("Connected!");
});
*/

/*
connectAsync()
  .then(() => console.log("Connected!"))
  .catch(err => console.error("Error connecting:", err));
  */


// Could have used promisifyAll() automatically does this for all eligible methods of an object. Bluebird.promisifyAll(connection);
// But it will promisify all methods of the connection object, not just connect().
// It will also promisify query(), end(), and other methods that are suitable for promisification
   
// Yes, there is a pattern. The functions it converts must expect a callback as their last argument. Additionally, it must pass an error as the first argument to the callback (null if no error) and the return value as the second argument.

// Promisifies all functions of the connection object.


// Connect to the database
/*
connectAsync()
  .then(function () {
    console.log("Database connected successfully");
  })
  .catch(function (error) {
    console.log("Error connecting to database: " + error);
  });
  */

  /*
connectAsync()
  .then(function () {
    console.log("Database connected successfully");
  })
  .catch(function (error) {
    console.log("Error connecting to database: " + error);
  });
  */

module.exports = connectionFromPool;

/*
Every method you invoke on a connection is queued and executed in sequence.

When you create a connection you will have one single connection and will be used until you terminate the connection , in between you can re-use the connection in sequence until and unless the connection is terminated.

Closing the connection is done using end() which makes sure all remaining queries are executed before sending a quit packet to the MySQL server.

connection.end() method will make sure that all previously encoded queries are destroyed successfully and if there is any fatal error while terminating the connection , an err argument will be provided with callback, the connection will be terminated regardless the error.

connection.destroy() method will immediately destroy the connection underlying the connected sockets.

Alike end() destroy() won’t have err argument with callback.

A connection pool is a pool of connections. They get used and rotated through as you ask for connections. The idea is that instead of you manually having to manage the number of connections you make (and you don't want to use just one connection you never close, that's bad practice and not good for multi-user environments), you let the pool manager deal with it and just ask the pool for a connection when you need it.
*/