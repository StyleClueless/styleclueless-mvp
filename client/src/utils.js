export const company_id= "061e449f-04d7-4898-a1a8-b3d8a052b328"
export const renderS3UrlFromPrefix=(s3_url)=>{
    const base_url='http://styleclueless-raw.s3-website-ap-southeast-1.amazonaws.com/';
    const scaleFactor=300;
    const scaleString=scaleFactor+'x'+scaleFactor+'/';
    const url=base_url+s3_url;

    const n = url.lastIndexOf("/");
    const newUrl=url.substring(0,n+1)+scaleString+url.substring(n+1)
    return newUrl
}
