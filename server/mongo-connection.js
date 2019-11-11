import { MongoClient } from 'mongodb'

// Create a new MongoClient
export let client;
export let db

// Use connect method to connect to the Server
export const connect = () => {
  const url = process.env.MONGO_URI.split('/').slice(0,-1).join('/')
  client = new MongoClient(url, { useUnifiedTopology: true })
  return new Promise((resolve, reject) => {

    // Database Name
    const dbName = process.env.MONGO_URI.split('/').slice(-1)[0]

    client.connect(function(err) {
      if (err) {
        reject(err)
      } else {
        console.log("Connected successfully to Mongo")
        db = client.db(dbName);
        resolve()
      }
    })
  })
}
