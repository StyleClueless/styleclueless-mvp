import {consoleLabel, downBucketPathToPath, getAbsolutePath} from "./utils";

 const BUKCET_NAME="styleclueless-raw";
// const folder="061e449f-04d7-4898-a1a8-b3d8a052b328";
const folder="c5a66f3a-b46b-4165-815a-86ec68741b6f";
//EnCode Image add digital watermarking
let path = getAbsolutePath("/ImagesfromBucket/");


const init=async()=>{
 await downBucketPathToPath(BUKCET_NAME,folder,path);
 return 0;
}
init();