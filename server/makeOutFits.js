import {consoleLabel} from "./utils";
import {apolloClient} from "./apollo_client_hasura";
import {TEST_QUERY} from "../client/src/hasura_qls";
import gql from 'graphql-tag';
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
        const array=[
            {        tagging_id: "81dbd0ae-0458-4657-9c89-292c887558d0",
                outfit:{
                    t:"81dbd0ae-0458-4657-9c89-292c887558d0",b:"336f87b4-9b20-47d2-a962-c268c13e14e8",j:"ceeca7ab-1782-44e4-b552-36a36614400b",o:"2e390016-eb1e-4285-b204-7b4ee7fabba0"

                }
                ,     "created_at":"now()",
                "updated_at":"now()",
            },
            {        tagging_id: "81dbd0ae-0458-4657-9c89-292c887558d0",
                outfit:{
                    o:"81dbd0ae-0458-4657-9c89-292c887558d0",t:"336f87b4-9b20-47d2-a962-c268c13e14e8",b:"ceeca7ab-1782-44e4-b552-36a36614400b",j:"2e390016-eb1e-4285-b204-7b4ee7fabba0"

                }
                ,     "created_at":"now()",
                "updated_at":"now()",
            },
            {        tagging_id: "81dbd0ae-0458-4657-9c89-292c887558d0",
                outfit:{
                    b:"81dbd0ae-0458-4657-9c89-292c887558d0",j:"336f87b4-9b20-47d2-a962-c268c13e14e8",o:"ceeca7ab-1782-44e4-b552-36a36614400b",t:"2e390016-eb1e-4285-b204-7b4ee7fabba0"

                }
                ,     "created_at":"now()",
                "updated_at":"now()",
            },
            {        tagging_id: "81dbd0ae-0458-4657-9c89-292c887558d0",
                outfit:{
                    j:"81dbd0ae-0458-4657-9c89-292c887558d0",o:"336f87b4-9b20-47d2-a962-c268c13e14e8",t:"ceeca7ab-1782-44e4-b552-36a36614400b",b:"2e390016-eb1e-4285-b204-7b4ee7fabba0"

                }
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
        });        console.log(data);


        // return bulk_data_insert_info;
    }
    catch (e) {
        console.error(e);
        return {e};
    }
    }

export const INSERT_OUTFIT_BATCH = gql`

mutation insertoutfitBatch($objects:[outfits_insert_input!]!) {
    insert_outfits(objects: $objects) {
        returning {
            id,outfit,created_at
        }
        affected_rows
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

makeRandomOutfits()
