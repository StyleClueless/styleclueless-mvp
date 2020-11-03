const callerId =require( 'caller-id');
const uuid = require('uuid/v4');
const fs = require('fs-extra');

const request = require('request-promise')
const AWS = require('aws-sdk')
AWS.config.update({
    accessKeyId: 'AKIAQPMQ2HDZUU4W7HQS',
    secretAccessKey: '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',
    region: 'ap-southeast-1',
    signatureVersion: 'v4'
});
export const s3 = new AWS.S3()

export const BUKCET_NAME="styleclueless-raw";

export const  consoleLabel=(msg='')=> {
    const fnName = callerId.getData().functionName || 'anonymous';
    const uid = uuid().substring(0, 5);
    return `${fnName}: ${msg} ${uid}`
}
const path = require('path');
export const getAbsolutePath=(fileName)=> {
    return path.join(__dirname,fileName)
}
export const mkdirRecursive= async (pathToCreate)=>{
    return await fs.ensureDir(pathToCreate);
}

export const goToPngConvert=async(png_convert_url)=>{
    const label = consoleLabel('goToPngConvert'+png_convert_url);
    console.time(label);
    const data=await getRequest(png_convert_url);
    console.timeEnd(label);
    return data;
}
export const getRequest=async(url)=>{
    return new Promise((resolve, reject) => {

        request.get(url, (error, response, body) => {
            try{
                let json = JSON.parse(body);
                console.log(json);
                resolve(json);
            }
            catch (e) {
                reject(e);
            }

        });

    })
}
const listS3Folder = async ({Bucket, Folder, Marker}) => {
    return new Promise((resolve, reject) => {
        let params = {Bucket, Marker};
        if (Folder != undefined) {
            params.Prefix = `${Folder}/`
        }
        params.Delimiter = '/'
        s3.listObjects(params, (err, objects) => {
            if (err) {
                reject('Error finding the bucket content');
            } else {
                resolve(objects);
            }
        });
    })
}
export const downBucketPathToPath = async (bucketName, folder,path) => {
    const start = new Date().getTime();

    try {
        const params = {Bucket: bucketName, Folder: folder};
        let bucket_content = await listS3Folder(params);
        const first_listing=bucket_content.Contents;

        const download_files = first_listing.map((file, i) => async () => {
            try {
                const s3_path=file.Key;
                let params = {Bucket: bucketName, Key: s3_path};
                let local_new_path = path+ s3_path;
                let folder_path= local_new_path.substring(0, local_new_path.lastIndexOf("/")) + '/';
                console.log("downloading to "+ local_new_path)
                await mkdirRecursive(folder_path);
                await downloadS3File(params, local_new_path);
                return local_new_path;
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
        for (let i = 0; i < download_files.length; i++) {
            await download_files[i]();
        }
        console.log(download_files);
        // let all = await Promise.all(first_listing.map(async (file) => {
        //     try {
        //         const s3_path=file.Key;
        //         let params = {Bucket: bucketName, Key: s3_path};
        //         let local_new_path = path+ s3_path;
        //         let folder_path= local_new_path.substring(0, local_new_path.lastIndexOf("/")) + '/';
        //         await mkdirRecursive(folder_path);
        //         await downloadS3File(params, local_new_path);
        //         return local_new_path;
        //     }
        //     catch (e) {
        //         console.error(e);
        //     }
        // }));
        // return all.filter((x) => x != undefined);
    } finally {
        const end = new Date().getTime();
        console.log(`downBucketPathToPath from ${BUKCET_NAME}  in ${folder} to ${path}took : ${(end - start) / 1000} sec`);
    }
}


const downloadS3File = async (s3Input, path) => {
    try{
        return new Promise(async (resolve, reject) => {
            const s3Stream = s3.getObject(s3Input).createReadStream();
            let new_path= path.substring(0, path.lastIndexOf("/")) + '/';
            let create_dir= await mkdirRecursive(new_path);
            const fileStream = fs.createWriteStream(path);
            s3Stream.on("error", reject);
            fileStream.on("error", reject);
            fileStream.on("close", () => {
                resolve(path);
            });
            s3Stream.pipe(fileStream);
        });
    }
    catch(e){
        return null;
    }

}

const isFolderExists = async (bucketName,folder) => {
    const params = {Bucket: bucketName, Folder: folder};
    let bucket_content = await listS3Folder(params);
    return (bucket_content.CommonPrefixes.length > 0)
}
