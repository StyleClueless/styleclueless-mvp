import {apolloClient} from "./apollo_client_hasura";
import {upload} from "./fetchImageAndUploadToBucket";

const router = require('express').Router();
const gql = require('graphql-tag');

router.post('/', async function (req, res) {
    // const label = utils.consoleLabel('/getUserImageById ');
    // console.time(label);
    try {
        const body = req.body || '';
        const add_to_db = await insertImportToDb(body);
        console.log(add_to_db);
        const ids_urls = add_to_db.map(hasura_insert => {
            try{
                const {data: {insert_tagging_import: {returning}}} = hasura_insert;
                const {id, url,sku} = returning[0];
                return {id, url,sku};
            }
            catch (e){
                return {id:null, url:null,sku:null,e};
            }
        })
        const upload_to_s3_update_db=await uploadFilesToS3AndUpdateDbUrl(ids_urls);
        console.log(upload_to_s3_update_db);
        res.send(add_to_db);
    }
    catch (e) {
        console.error(e);
        res.status(500).end(e.message ? e.message : e);
    } finally {
        // console.timeEnd(label);
    }
});

module.exports = router;
const UPADTE_S3_URL = gql`
mutation updateS3UrlForTaggingImport($id: uuid!, $s3_url: String!) {
    update_tagging_import(where: {id: {_eq: $id}}, _set: {s3_url: $s3_url}) {
        returning {
            s3_url
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
export const uploadFilesToS3AndUpdateDbUrl = async (id_urls) => {
    console.log("uploadFilesToS3AndUpdateDbUrl"+JSON.stringify(id_urls));
    const path="FOX/";
    const client = apolloClient;
    const insert_to_hasura_tagging = id_urls.map((tagging_insert_info, i) => async () => {
        try {
            const {url,sku,id} = tagging_insert_info;
            const s3_filename=path+sku+'.jpg';
            const upload_file_to_s3_from_buffer=await upload(url,s3_filename)
            ///todo : update url in db...
            // return upload_file_to_s3_from_buffer;
            const
                data_update_s3_path_in_db
                    = await client.mutate({
                    mutation: UPADTE_S3_URL,
                    variables: {id,s3_url:s3_filename},
                });
            console.log(data_update_s3_path_in_db);
            return {data_update_s3_path_in_db,upload_file_to_s3_from_buffer};
        }
        catch (e) {
            console.error(e);
            return {e};
        }

    });
    let return_values = [];
    for (let i = 0; i < insert_to_hasura_tagging.length; i++) {
        const return_value = await insert_to_hasura_tagging[i]();
        return_values[i] = return_value;
    }
    return return_values;
}

export const insertImportToDb = async (db_insert_array) => {

    const client = apolloClient;
    const insert_to_hasura_tagging = db_insert_array.map((tagging_insert_info, i) => async () => {
        try {
            console.log(tagging_insert_info);
            const
                data_insert_info
                    = await client.mutate({
                    mutation: INSERT_TAGGING_IMPORT_HASURA,
                    variables: tagging_insert_info,
                });
            console.log(data_insert_info);
            return data_insert_info;
        }
        catch (e) {
            console.error(e);
            return {e};
        }

    });
    let return_values = [];
    for (let i = 0; i < insert_to_hasura_tagging.length; i++) {
        const return_value = await insert_to_hasura_tagging[i]();
        return_values[i] = return_value;
    }
    console.log(return_values);

    console.log(insert_to_hasura_tagging);
    return return_values;
}
