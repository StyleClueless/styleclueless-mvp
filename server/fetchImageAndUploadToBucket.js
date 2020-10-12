import {consoleLabel} from "./utils";
import {s3,BUKCET_NAME} from "./utils";
const request = require('request');

export const upload=async(url,path) =>{
    const label = consoleLabel('upload to S3=>'+url+'to path=>'+path);
    console.time(label);
    const options = {
        uri: url,
        encoding: null
    };
    const body = await request(options);

    const uploadResult = await s3.upload({
        Bucket: BUKCET_NAME,
        Key   : path,
        Body  : body,
    }).promise()
    console.timeEnd(label);
    return uploadResult
}