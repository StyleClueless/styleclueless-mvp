import {getFiles, uploadFile} from "./utils";
const path = require('path');
const fs = require('fs');


const BUKCET_NAME="styleclueless-raw";
// const folder="061e449f-04d7-4898-a1a8-b3d8a052b328";
const folder="c5a66f3a-b46b-4165-815a-86ec68741b6f";
//EnCode Image add digital watermarking

let s3_dict={};
const init=async()=>{
 let files=await getFiles("/Users/orsh/Downloads/Browzwear");
 const keySuffix='browzwear_raw/'
 // files=files.splice(0,4);
 let count=0;
 const upload_files = files.map((file, i) => async () => {
  try {
   count++;
   console.log((count/files.length).toFixed(4));
   if(file.toString().indexOf(".png")>0){ // this is png
    let file_name = path.basename(file);
    let s3_key=keySuffix+file_name;
    const upload_file_s3_path= await uploadFile(file,s3_key);
    file_name=file_name.replace(".png","");
    s3_dict[file_name]=upload_file_s3_path;
    let i=1;

   }
   console.log(file);
 let i=0;
  }
  catch (e) {
   console.error(e);
   return null;
  }
 });
 for (let i = 0; i < upload_files.length; i++) {
  await upload_files[i]();
 }
 console.log(s3_dict);


 const headers = ["sku", "url"]

 const writeStream = fs.createWriteStream('browzwear_data.csv');

 // s3_dict['bottompng']='http://333.png'
 // s3_dict['bottompnaaag']='http://333ssss.png'
// writeStream.write(`headers \n`);

 writeStream.write(  headers.join() + '\n');
 Object.keys(s3_dict).map(function(k){
  const array=[k,s3_dict[k]];
  writeStream.write(  array.join() + '\n');

  return s3_dict[k];
 })
 return 0;
}
init();
