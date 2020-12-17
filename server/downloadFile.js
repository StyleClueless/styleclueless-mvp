const https = require('https');
const { Writable } = require('stream');

export const getBinaryDataAsync= async(url)=> {
    // start HTTP request, get binary response
    const { request, response } = await new Promise((resolve, reject) => {
        const request = https.request(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/pdf',
                    'Accept-Encoding': 'identity'
                }
            }
        );

        request.on('response', response =>
            resolve({request, response}));
        request.on('error', reject);
        request.end();
    });

    // read the binary response by piping it to stream.Writable
    const buffers = await new Promise((resolve, reject) => {

        response.on('aborted', reject);
        response.on('error', reject);

        const chunks = [];

        const stream = new Writable({
            write: (chunk, encoding, notifyComplete) => {
                try {
                    chunks.push(chunk);
                    notifyComplete();
                }
                catch(error) {
                    notifyComplete(error);
                }
            }
        });

        stream.on('error', reject);
        stream.on('finish', () => resolve(chunks));
        response.pipe(stream);
    });

    const buffer = Buffer.concat(buffers);
    return buffer.buffer; // as ArrayBuffer
}
//
// async function main() {
//     // console.log(arrayBuff.byteLength);
// };
//
// main().catch(error => console.error(error));