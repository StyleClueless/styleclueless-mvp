const request = require('request-promise')
const AWS = require('aws-sdk')
AWS.config.update({
    accessKeyId: 'AKIAQPMQ2HDZUU4W7HQS',
    secretAccessKey: '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',
    region: 'ap-southeast-1',
    signatureVersion: 'v4'
});
const s3 = new AWS.S3()

const BUKCET_NAME="styleclueless-raw";
export const upload=async(url,path) =>{
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
    return uploadResult
}
