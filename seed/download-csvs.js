import request from 'request'
import fs from 'fs'
import dotenv from 'dotenv'
import util from 'util'
import childProcess from 'child_process'
const exec = util.promisify(childProcess.exec)
const fsUnlink = util.promisify(fs.unlink)

dotenv.config()

const dir = __dirname + '/download'

if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}
function downloadFileToPath (url, path) {
  return new Promise ((resolve, reject) => {
    const file = fs.createWriteStream(path);
    const downloadReq = request.get(url)

    downloadReq.on('response', response => {
      if (response.statusCode !== 200) {
        reject(response)
      } else {
        downloadReq.pipe(file)
      }
    })

    file.on('finish', () => file.close(resolve));

    // check for request errors
    downloadReq.on('error', (err) => {
      fsUnlink(path).then(() => reject(err.message));
    });

    file.on('error', (err) => { // Handle errors
      fsUnlink(path) // Delete the file async. (But we don't check the result)
        .then(() => reject(err.message))
    });
  })
}

(async function () {
  try {
    console.log('Download tagging csv')
    await downloadFileToPath(process.env.TAGGING_CSV_URL, dir + '/tagging.csv')
    console.log('Tagging csv downloaded successfully')

    console.log('Downloading matching csv')
    await downloadFileToPath(process.env.MATCHING_CSV_URL, dir + '/matching.csv')
    console.log('Matching csv downloaded successfully')

    console.log('Importing tagging csv into Mongo')
    await exec(`mongoimport --uri=${process.env.MONGO_URI} -c=taggingData --type=csv --headerline --drop --file=${dir}/tagging.csv`)
    console.log('Tagging csv import complete')

    console.log('Importing matching csv into Mongo')
    await exec(`mongoimport --uri=${process.env.MONGO_URI} -c=matchingData --type=csv --headerline --drop --file=${dir}/matching.csv`)
    console.log('Matching csv import complete')

    await exec(`mongo ${process.env.MONGO_URI} ./seed/seed-outfits.js`)
    console.log('Seed outfits complete')
  } catch (e) {
    console.error(e)
  }
})()