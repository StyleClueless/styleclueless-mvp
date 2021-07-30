import {apolloClient} from "./apollo_client_hasura";
import {upload} from "./fetchImageAndUploadToBucket";
import {consoleLabel, goToPngConvert} from "./utils";
import {getRequest} from "./utils";

const router = require('express').Router();
const gql = require('graphql-tag');

router.post('/', async function (req, res) {
    const label = consoleLabel('/ADDTAGINGIMPORT PROCESS POST ');
    console.time(label);
    try {
        const body = req.body || '';
        const add_to_db = await insertImportToDb(body);
        if(add_to_db!=null){
            console.log(add_to_db);
            const ids_urls = add_to_db.map(hasura_insert => {
                try{
                    // const {data: {insert_tagging_import: {returning}}} = hasura_insert;
                    // const {id, url,sku} = returning[0];
                    const {id, url,sku,company_id} = hasura_insert;
                    return {id, url,sku,company_id};
                }
                catch (e){
                    return {id:null, url:null,sku:null,e};
                }
            })
            res.send(add_to_db);
            ///todo : add here worker....
            const upload_to_s3_update_db=await uploadFilesToS3AndUpdateDbUrl(ids_urls);
            console.log(upload_to_s3_update_db);
        }
        else{
            throw new Error("Failed to do insert")
        }

    }
    catch (e) {
        console.error(e);
        res.status(500).end(e.message ? e.message : e);
    } finally {
        console.timeEnd(label);
    }
});

module.exports = router;
const UPADTE_S3_URL = gql`
mutation updateS3UrlForTagging($id: uuid!, $s3_url: String!, $png_s3_url: String!) {
    update_tagging(where: {id: {_eq: $id}}, _set: {s3_url: $s3_url,png_s3_url: $png_s3_url,updated_at:"now()"}) {
        returning {
            s3_url
            png_s3_url
            id
            url
            updated_at
        }
    }
}

`;


const INSERT_TAGGING_IMPORT_HASURA = gql`
mutation insertTaggingImport($company_id: uuid, $gender: String, $sku: String!, $type: String!, $url: String!) {
  insert_tagging_import(objects: {sku: $sku, company_id: $company_id, gender: $gender, type: $type, updated_at: "now()", url: $url, created_at: "now()"}, on_conflict: {constraint: tagging_import_pkey, update_columns: updated_at}) {
    affected_rows
    returning {
      id
      url
      sku
      company_id
      updated_at
      created_at
    }
  }
}
`;
const BULK_INSERT_TAGGING_IMPORT_HASURA = gql`
mutation insertTaggigImportBulk($objects: [tagging_insert_input!]!) {
    insert_tagging(objects: $objects, on_conflict: {constraint: tagging_pkey,
        update_columns: [updated_at, created_at, url, url, demography,class]}) {
        returning {
            id
            deleted
            class
            created_at
            company_id
            s3_url
            sku
            demography
            updated_at
            url
        }
    }
}
`;

const i={
    "objects": [

        {"outfit_id": "7cfcc942-c2af-4482-848c-934bb7344f50","tagging_id": "5d26bcd3-4725-40b5-94dd-b0de404b32b5"
        ,"created_at":"now()","updated_at":"now()"
        },
        {"outfit_id": "7cfcc942-c2af-4482-848c-934bb7344f50","tagging_id": "9aa8a0eb-e186-4e45-971a-52c26b6e06b8"
            ,"created_at":"now()","updated_at":"now()"
        },
        {"outfit_id": "7cfcc942-c2af-4482-848c-934bb7344f50","tagging_id": "c55973e7-d7f3-405e-b9bd-fbd6a2813241"
            ,"created_at":"now()","updated_at":"now()"
        },
        {"outfit_id": "1a501d2d-ce3a-4d0a-ada3-cc564e918b77","tagging_id": "c55973e7-d7f3-405e-b9bd-fbd6a2813241"
            ,"created_at":"now()","updated_at":"now()"},
        {"outfit_id": "1a501d2d-ce3a-4d0a-ada3-cc564e918b77","tagging_id": "217aa1e0-c57f-438f-a17a-b3b6e6872ce1"
            ,"created_at":"now()","updated_at":"now()"},
        {"outfit_id": "1a501d2d-ce3a-4d0a-ada3-cc564e918b77","tagging_id": "3e35acfc-c23a-4802-bc67-9f346dcf8ba4"
            ,"created_at":"now()","updated_at":"now()"}
    ]
};

export const uploadFilesToS3AndUpdateDbUrl = async (id_urls) => {
    console.log("uploadFilesToS3AndUpdateDbUrl"+JSON.stringify(id_urls));
    const label = consoleLabel('uploadFilesToS3AndUpdateDbUrl');
    console.time(label);
    const client = apolloClient;
    const insert_to_hasura_tagging = id_urls.map((tagging_insert_info, i) => async () => {
        try {
            const {url,sku,id,company_id} = tagging_insert_info;
            const path=`${company_id }/`;
            const s3_filename=path+sku+'.jpg';
            console.log(`${url } fetch and upload to ${s3_filename}` )
            const upload_file_to_s3_from_buffer=await upload(url,s3_filename)
            const png_convert_url="https://djsq3zkhsd.execute-api.ap-southeast-1.amazonaws.com/dev?s3_path="+s3_filename;
            const convert_to_transparent_png= await goToPngConvert(png_convert_url);
            const {s3_path}=convert_to_transparent_png;
            const
                data_update_s3_path_in_db
                    = await client.mutate({
                    mutation: UPADTE_S3_URL,
                    variables: {id,s3_url:s3_filename,png_s3_url:s3_path},
                });
            // console.log(data_update_s3_path_in_db);
            return {data_update_s3_path_in_db,upload_file_to_s3_from_buffer,s3_path};
        }
        catch (e) {
            console.error(e);
            return {e};
        }

    });
    let return_values = [];
    for (let i = 0; i < insert_to_hasura_tagging.length; i++) {
        let return_value = await insert_to_hasura_tagging[i]();
        let {data_update_s3_path_in_db,upload_file_to_s3_from_buffer,s3_path}=return_value;

        while (upload_file_to_s3_from_buffer == null || s3_path==null){ /// doing retries of upload till success
            return_value=  await insert_to_hasura_tagging[i]();
          let  {data_update_s3_path_in_db,upload_file_to_s3_from_buffer,s3_path}=return_value
        }

        return_values[i] = return_value;
    }
    console.log(return_values);
    console.timeEnd(label);
    return return_values;
}

export const insertImportToDb = async (db_insert_array) => {
    const label = consoleLabel('insertImportToDb');
    console.time(label);
    let return_values = [];
    const client = apolloClient;
    const timestamp=new Date().toISOString();
    db_insert_array=db_insert_array.map(item=>{
        // const newItem = Object.assign({}, item, {
        //     class:item.type,demography:item.gender,
        //     imported_at: timestamp,created_at: timestamp,updated_at:timestamp });
        const newItem={
            company_id:item.company_id,
            sku:item.sku,url:item.url,
        class:item.class,demography:item.demography,
            imported_at: timestamp,created_at: timestamp,updated_at:timestamp }
        return newItem
    })
    try {
        // console.log(db_insert_array);
        const
            bulk_data_insert_info
                = await client.mutate({
                mutation: BULK_INSERT_TAGGING_IMPORT_HASURA,
                variables: {objects:db_insert_array},
            });
        console.log(bulk_data_insert_info);
        return_values=bulk_data_insert_info.data.insert_tagging.returning;
        // return bulk_data_insert_info;
    }
    catch (e) {
        console.error(e);
        return null;
    }
    // const insert_to_hasura_tagging = db_insert_array.map((tagging_insert_info, i) => async () => {
    //     try {
    //         console.log(tagging_insert_info);
    //         const
    //             data_insert_info
    //                 = await client.mutate({
    //                 mutation: INSERT_TAGGING_IMPORT_HASURA,
    //                 variables: tagging_insert_info,
    //             });
    //         console.log(data_insert_info);
    //         return data_insert_info;
    //     }
    //     catch (e) {
    //         console.error(e);
    //         return {e};
    //     }
    //
    // });
    // for (let i = 0; i < insert_to_hasura_tagging.length; i++) {
    //     const return_value = await insert_to_hasura_tagging[i]();
    //     return_values[i] = return_value;
    // }
    // console.log(return_values);
    //
    // console.log(insert_to_hasura_tagging);
    console.timeEnd(label);
    return return_values;
}
