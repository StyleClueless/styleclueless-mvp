import {apolloClient} from "./apollo_client_hasura";
import {upload} from "./fetchImageAndUploadToBucket";
import {consoleLabel,isUUID,uuidv4} from "./utils";

const router = require('express').Router();
const gql = require('graphql-tag');


router.post('/', async function (req, res) {
    const label = consoleLabel('/ADDTAGINGIMPORT PROCESS POST ');
    console.time(label);
    try {

        const client = apolloClient;
        const json = req.body || '';
        if(!json||json.length<=0)res.status(500).end("NO VALID ARRAY TO INSERT");
        console.log("started importing outfits for outfits of size=>"+json.length);
        //// creating alot of outfits , from {id,j.id,a.id} -> [ { id,j.id} , {id,a.id } ]
        let insert_array = [];
        const db_structure = json.map(element => {
            if(element['input.id']===undefined){
                return;
            }
            const uuid = uuidv4();
            for (const [key, val] of Object.entries(element)) {
                if (key!=='input.id'&&isUUID(val)) {
                    insert_array.push({
                        outfit_id: uuid, tagging_id: val
                        , created_at: "now()", updated_at: "now()"
                    });
                }
            }
        })

        console.log("NEW COMBINATIONS=>"+insert_array.length);
        let dupe=false;
        let ids={};
        //iterate to check there is no bad outfits
        insert_array.forEach((element,i)=>{
            const unique_key=element.outfit_id+"_"+element.tagging_id;
            if(ids[unique_key]===undefined){
                ids[unique_key]=true;
            }
            else{
                dupe=true;

            }
        })

        var splitArray = function (arr, size) {

            var arr2 = arr.slice(0),
                arrays = [];

            while (arr2.length > 0) {
                arrays.push(arr2.splice(0, size));
            }

            return arrays;
        }
        if (dupe)
        {
            res.status(500).end(unique_key+ " is dupe");
        return ;
        }
        const bulk_insert_size = 7000;
        let newArrays = splitArray(insert_array, bulk_insert_size);
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
mutation insertOutfitsImportBulk($objects: [outfits_insert_input!]!) {
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
export const DELETE_OUTFITS = gql`
mutation deleteOutfits($tagging_id: uuid) { 
  delete_outfits (
    where: {
      tagging_id: {
        _eq: $tagging_id
      }
    }
  ) {
    affected_rows
  }
}
`;
