const callerId =require( 'caller-id');
const uuid = require('uuid/v4');

export const  consoleLabel=(msg='')=> {
    const fnName = callerId.getData().functionName || 'anonymous';
    const uid = uuid().substring(0, 5);
    return `${fnName}: ${msg} ${uid}`
}
