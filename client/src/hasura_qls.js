import gql from 'graphql-tag';

export const TEST_QUERY = gql`
   query MyQuery {
  clients {
    created_at
    deleted
    email
    id
    password
    salt
    updated_at
    company_id
  }
}
`;

export const GET_TAGGING_IMPORT = gql`

    query getTaggingImport {
        tagging_import {
            sku
            s3_url
            company_id
            id
            type
            url
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
export const GET_ALL_COMPANY_TAGGING_BY_TYPE = gql`
query getAllCompanyTagging($company_id: uuid!,$type:String!) {
    tagging(where: {tagging_import: {company_id: {_eq: $company_id},
        type: {_eq: $type}}}) {
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
