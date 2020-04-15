import {consoleLabel} from "./utils";
import {apolloClient} from "./apollo_client_hasura";
import {TEST_QUERY} from "../client/src/hasura_qls";

export const makeRandomOutfits = async () => {

    const client = apolloClient;

    try {
        const data = await client.query({
            query: TEST_QUERY,
            variables: {},
            fetchPolicy: 'network-only',
        });
        const
            bulk_data_insert_info
                = await client.mutate({
                mutation: GET_ALL_COMPANY_TAGGING,
                variables: {company_id:global_company_id},
            });
        console.log(bulk_data_insert_info);
        // return bulk_data_insert_info;
    }
    catch (e) {
        console.error(e);
        return {e};
    }
    }

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

const input=
    [

    {
        tagging_import_id:"900f13de-ef2a-4df5-814d-1c8f47dd46e3",
        created_at:"2020-04-15T13:59:51.392566",
        updated_at:"2020-04-15T13:59:51.392566",
        outfit:{j:"900f13de-ef2a-4df5-814d-1c8f47dd46e3",b:"fbbac3b1-9c5b-4125-be81-922ad07b7a7b",a:"cda8c876-97e4-4ab8-ae0a-57e0f9170555"}
    }
    ,
    {
        tagging_import_id:"6827951f-c96f-4f60-a1dc-57bf41a819d8",
        created_at:"2020-04-15T13:59:51.392566",
        updated_at:"2020-04-15T13:59:51.392566",
        outfit:{j:"6827951f-c96f-4f60-a1dc-57bf41a819d8",b:"fbbac3b1-9c5b-4125-be81-922ad07b7a7b",a:"cda8c876-97e4-4ab8-ae0a-57e0f9170555"}
    }

    ]
