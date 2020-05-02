const callerId =require( 'caller-id');
const uuid = require('uuid/v4');

export const  consoleLabel=(msg='')=> {
    const fnName = callerId.getData().functionName || 'anonymous';
    const uid = uuid().substring(0, 5);
    return `${fnName}: ${msg} ${uid}`
}
const request = require('request');
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
