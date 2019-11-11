import { db } from './mongo-connection'

export const getItemsByQuery = query => {
  const collection = db.collection('taggingData')

  return new Promise((resolve, reject) => {
    collection.find(query).toArray((err, docs) => {
      if (err) {
        reject(err)
      } else {
        resolve(docs)
      }
    })
  })
}
