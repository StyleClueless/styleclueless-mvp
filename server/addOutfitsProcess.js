import {apolloClient} from "./apollo_client_hasura";
import {upload} from "./fetchImageAndUploadToBucket";
import {consoleLabel} from "./utils";

const router = require('express').Router();
const gql = require('graphql-tag');
export const isUUID = (uuid) => {
    let s = "" + uuid;

    s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
    if (s === null) {
        return false;
    }
    return true;
}
export const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

router.post('/', async function (req, res) {
    const label = consoleLabel('/ADDTAGINGIMPORT PROCESS POST ');
    console.time(label);
    try {

        const client = apolloClient;
        const json = req.body || '';
        if(!json||json.length<=0)res.status(500).end("NO VALID ARRAY TO INSERT");
        console.log("started importing outfits for outfits of size=>"+json.length);

        let insert_array = [];
        const db_structure = json.map(element => {
            const uuid = uuidv4();
            for (const [key, val] of Object.entries(element)) {
                if (isUUID(val)) {
                    insert_array.push({
                        outfit_id: uuid, tagging_id: val
                        , created_at: "now()", updated_at: "now()"
                    });
                }
            }
        })
        console.log("NEW COMBINATIONS=>"+insert_array.length);



        var splitArray = function (arr, size) {

            var arr2 = arr.slice(0),
                arrays = [];

            while (arr2.length > 0) {
                arrays.push(arr2.splice(0, size));
            }

            return arrays;
        }

        const bulk_insert_size = 7000;
        const newArrays = splitArray(insert_array, bulk_insert_size);
        const arrayLength=newArrays.length;
        const insert_to_hasura_tagging = newArrays.map((bulk_insert_array, i) => async () => {
            try {
                console.log(new Date().getTime()+"=>ADDING TO DB BULK NUMBER=>"+i/arrayLength+"=>FOR BULK NUMBER of"+bulk_insert_size);

                const {data: {insert_outfits: {returning}}} = await client.mutate({
                    mutation: INSERT_OUTFITS_BULK,
                    variables: {objects: bulk_insert_array},
                    fetchPolicy: 'no-cache',
                });
                // console.log(returning);
                return returning;
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
        const merged = [].concat.apply([], return_values);
        console.log("added num of combinations=>"+merged.length);

        res.send(merged);
    }
    catch (e) {
        console.error(e);
        res.status(500).end(e.message ? e.message : e);
    } finally {
        console.timeEnd(label);
    }
});

module.exports = router;

export const INSERT_OUTFITS_BULK = gql`
mutation insertTaggigImportBulk($objects: [outfits_insert_input!]!) {
  insert_outfits(objects: $objects) {
    returning {
      deleted
      created_at
      updated_at
      outfit_id
      tagging_id
    }
  }
}
`;
