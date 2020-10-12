import {consoleLabel, downBucketPathToPath, getAbsolutePath} from "./utils";

 const BUKCET_NAME="styleclueless-raw";
const folder="061e449f-04d7-4898-a1a8-b3d8a052b328/300x300";
//EnCode Image add digital watermarking
let path = getAbsolutePath("/ImagesfromBucket");


downBucketPathToPath(BUKCET_NAME,folder,path)