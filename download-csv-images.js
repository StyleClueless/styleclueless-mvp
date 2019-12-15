const fs = require('fs-extra');
const eventStream = require('event-stream');
const request = require('request');
const path = require('path');


const assetName = 'tops'

const dir = __dirname + '/' + assetName
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

function downloadFileToPath(url, path) {
    return new Promise((resolve, reject) => {
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

// const stream = fs.createReadStream(path.join(__dirname, 'items_new.csv'))
//   .pipe(eventStream.split())
//   .pipe(eventStream.mapSync(async (line) => {
//     //pause the readstream
//     stream.pause()
//     // console.log("line:", line)
//     const cells = line.split(',')
//     try {
//       await Promise.all(cells.map(cell => {
//         if (cell.indexOf('http') === 0) {
//           console.log('Asset detected ', cell)
//           // const matches = cell.match(/\/([^_\/]*)_.*(\..*)$/)
//           // const filename = matches[1] + matches[2]
//           const filename = cell.split('/').slice(-1)[0]
//           console.log('Downloading as ', filename)
//           return downloadFileToPath(cell, dir + '/' + filename)
//         }
//       }))
//     } catch (e) {
//       console.error('Failed downloading ' + e.request.href)
//     }
//
//     stream.resume()
//   }))
//   .on('error', function(err) {
//     console.log('Error:', err)
//   })
//   .on('end', function() {
//     console.log('Finish reading.')
//   })
const http = require('https');
const timeout = (ms) => {
    console.log('timeout for=>' + ms)
    return new Promise(resolve => setTimeout(resolve, ms));
}
const downloadAsyncHtttp = async (url, path) => {
    console.log("downloadAsyncHtttp=>" + url);
    return new Promise((resolve, reject) => {

        const file = fs.createWriteStream(path);
        try {
            const request = http.get(url, function (response) {
                response.pipe(file);
                file.on('finish', () => {
                        let file_path = file.path;
                        console.log(file_path);
                        file.close(resolve(file_path))
                    }
                );

            });
        }
        catch (e) {
            fs.unlinkSync(path);
            console.log("DELETED=" + path);

            reject(e);
        }

    })
}

const mkdirRecursive = async (pathToCreate) => {
    return await fs.ensureDir(pathToCreate);
}
const csvFilePath = 'items_fox_new.csv'
const csv = require('csvtojson')
const init = async () => {
    const jsonArray = await csv().fromFile(csvFilePath);
    // console.log(jsonArray);


    const download_files = jsonArray.map((object, i) => async () => {
        let url = object.Url;
        let category = object.Category;
        let SKU = object.SKU;
        const path = category.toLowerCase() + '/' + SKU + '.png';


        let create_dir = await mkdirRecursive(category.toLowerCase() + '/');
        let file_exists = await fs.exists(path);
        if (!file_exists) {
            const download_file = await downloadAsyncHtttp(url, path)
            // await timeout(100);
            return download_file;
        }
    });
    for (let i = 0; i < download_files.length; i++) {
        await download_files[i]();
    }
    console.log(download_files);

    // let all_download = await Promise.all(jsonArray.map(async (object) => {
    //     let url = object.Url;
    //     let category = object.Category;
    //     let SKU = object.SKU;
    //     const path = category.toLowerCase() + '/' + SKU + '.png';
    //
    //
    //     let create_dir = await mkdirRecursive(category.toLowerCase() + '/');
    //     let file_exists = await fs.exists(path);
    //     if (!file_exists) {
    //         const download_file = await downloadAsyncHtttp(url, path)
    //         await timeout(100);
    //         return download_file;
    //     }
    //
    // }));
    // console.log(all_download);
}
init();
