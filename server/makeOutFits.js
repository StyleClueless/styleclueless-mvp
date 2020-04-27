import {apolloClient} from "./apollo_client_hasura";
import gql from 'graphql-tag';
import outfitsArray from "./outfits.json";
export const makeRandomOutfits = async () => {

    const client = apolloClient;

    try {
        // const data = await client.query({
        //     query: TEST_QUERY,
        //     variables: {},
        //     fetchPolicy: 'network-only',
        // });
        // const
        //     bulk_data_insert_info
        //         = await client.mutate({
        //         mutation: GET_ALL_COMPANY_TAGGING,
        //         variables: {company_id:global_company_id},
        //     });
        // console.log(bulk_data_insert_info)
        const outfitsArray=["c5ebd32b-a617-4d5c-b681-278c852d7d9f",
            "7c93b626-34d3-4468-a3b1-e040bcf73550",
            "7c93b626-34d3-4468-a3b1-e040bcf73550","7c93b626-34d3-4468-a3b1-e040bcf73550"];
        const array=[
            {        tagging_id: "c5ebd32b-a617-4d5c-b681-278c852d7d9f",
                outfit:
                outfitsArray
            ,"created_at":"now()",
                "updated_at":"now()",
            },
            {        tagging_id: "7c93b626-34d3-4468-a3b1-e040bcf73550",
                outfit: outfitsArray
                ,     "created_at":"now()",
                "updated_at":"now()",
            },
            {        tagging_id: "7c93b626-34d3-4468-a3b1-e040bcf73550",
                outfit:  outfitsArray
                ,     "created_at":"now()",
                "updated_at":"now()",
            },
            {        tagging_id: "97ae159e-3007-484a-b08f-f25491366e71",
                outfit: outfitsArray
                ,     "created_at":"now()",
                "updated_at":"now()",
            }

        ]
        // const data = await client.mutate({
        //     mutation: INSERT_OUTFIT,
        //     variables:array[0]
        //
        //
        //
        //     ,
        //     fetchPolicy: 'no-cache',
        // });

        // console.log(data);
        const {data:{insert_outfits:{returning}}} = await client.mutate({
            mutation: INSERT_OUTFIT_BATCH,
            variables:{objects:array}



            ,
            fetchPolicy: 'no-cache',
        });        console.log(returning);


        // return bulk_data_insert_info;
    }
    catch (e) {
        console.error(e);
        return {e};
    }
    }

export const INSERT_OUTFIT_BATCH = gql`

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

export const INSERT_OUTFIT = gql`

mutation insertOutFit($tagging_id:uuid!,$outfit:jsonb) {
    insert_outfits(objects: {created_at:"now()",updated_at:"now()",tagging_id:$tagging_id,outfit:$outfit}) {
        returning {
            id,outfit
        }
        affected_rows
    }
}
`;
export const GET_ALL_COMPANY_TAGGING = gql`

query getAllCompanyTagging($company_id: uuid!) {
    tagging(where: {tagging_import: {company_id: {_eq: $company_id}}}) {
        style
        shade
        design
        demography
        deleted
        class
        created_at
        tagging_import {
            company_id
            created_at
            deleted
            gender
            id
            s3_url
            sku
            type
            updated_at
            url
        }
    }
}
`;
export const global_company_id="061e449f-04d7-4898-a1a8-b3d8a052b328";

// makeRandomOutfits()
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
export const makeOutfits = async () => {

    const client = apolloClient;

    try {


        // console.log(data);
        const {data:{insert_outfits:{returning}}} = await client.mutate({
            mutation: INSERT_OUTFIT_BATCH,
            variables:{objects:outfitsArray}



            ,
            fetchPolicy: 'no-cache',
        });

        console.log(returning);


        // return bulk_data_insert_info;
    }
    catch (e) {
        console.error(e);
        return {e};
    }
}
makeOutfits();
