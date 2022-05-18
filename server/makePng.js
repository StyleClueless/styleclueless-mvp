import {apolloClient} from "./apollo_client_hasura";
import gql from 'graphql-tag';
import {goToPngConvert} from "./utils";

export const GET_TAGGING = gql`

query getTaggingUrl($company_id: uuid!) {
  tagging(where: {company_id: {_eq: $company_id}, s3_url: {_is_null: false}}) {
    id
    s3_url
    png_s3_url
    class
  }
}
`;
/*
*
* mutation deleteBk($company_id: uuid!) {

  delete_tagging (where: {company_id: {_eq: $company_id},s3_url:{_like:"%_BK%"}})  {
returning{
    id}
    affected_rows
  }
}

* */
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





export const makePngs = async (company_id) => {

    const client = apolloClient;
    const {data} = await client.query({
        query: GET_TAGGING,
        variables: {company_id: company_id},
        fetchPolicy: 'network-only',
    });
    let {tagging} = data;
    // tagging=tagging.slice(0,3);
    const update_png_url = tagging.map((tagging_item, i) => async () => {
        try {
            console.log(Number(i/tagging.length))
            const {id,s3_url}=tagging_item;
            const png_convert_url="https://www.styleclueless.com/removebg/?s3_path="+s3_url;
       //     const png_convert_url="https://djsq3zkhsd.execute-api.ap-southeast-1.amazonaws.com/dev?s3_path="+s3_url;
            const convert_to_transparent_png= await goToPngConvert(png_convert_url);
            const {s3_path}=convert_to_transparent_png;
            const
                data_update_s3_path_in_db
                    = await client.mutate({
                    mutation: UPADTE_S3_URL,
                    variables: {id,s3_url:s3_url,png_s3_url:s3_path},
                });
            // console.log(data_update_s3_path_in_db);
            return {data_update_s3_path_in_db};

            // return bulk_data_insert_info;
        }
        catch (e) {
            console.error(e);
            return {e};
        }

    });
    let return_values = [];
    for (let i = 0; i < update_png_url.length; i++) {
        const return_value = await update_png_url[i]();
        return_values[i] = return_value;
    }
    console.log(return_values.length)

    console.log(return_values)

}
const company_id_input='f1e6d72f-731f-4c15-89e9-82830a9f8f0c';

makePngs(company_id_input);
