import gql from 'graphql-tag';

export const GET_ALL_COMPANIES = gql`
query getAllCompanies {
    companies {
        created_at
        id
        logo_url
        company_name
        updated_at
    }
}
`;
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

export const GET_TAGGING_URLS= gql`
query getTaggingUrl($company_id: uuid!) {
    tagging(where: {company_id: {_eq: $company_id}}, distinct_on: class) {
        s3_url
    class
    }
}
`;

export const ALL_OUTFITS_BY_TAGGING_ID= gql`

query allOutfitsByTaggingId($tagging_id: uuid!) {
  outfits(where: {tagging_id: {_eq: $tagging_id}}) {
    id
    tagging_id
    outfit
  }
  tagging(where: {id: {_eq: $tagging_id}}) {
    class
    design
    s3_url
  }
}


`;
export const GET_TAGGING= gql`

query getTaggings($company_id:uuid!) {
  tagging(where: {company_id: {_eq: $company_id}}) {
    sku
    s3_url
    company_id
    id
    class
    demography
    url
    shade
    style
    created_at
    deleted
    design
    imported_at
    updated_at
  }
}

`;
export const GET_TAGGING_BY_CLASS= gql`

query getTaggings($company_id: uuid!,$class:String!) {
  tagging(where: {company_id: {_eq: $company_id}, class: {_eq: $class}}) {
    sku
    s3_url
    company_id
    id
    class
    demography
    url
    shade
    style
    created_at
    deleted
    design
    imported_at
    updated_at
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
export const UPDATE_TAGGING = gql`
mutation updateTagging($tagging_id: uuid!, $style: String!,$shade: String!, $class: String!, $design: String!, $demography: String!) {
    update_tagging(where: {id: {_eq: $tagging_id}}, _set: {class: $class, demography: $demography,shade: $shade, design: $design, updated_at: "now()", style: $style}) {
        returning {
            id
            updated_at
            style
            shade
            design
            class
            demography
        }
    }
}

`;
export const INSERT_TAGGING_HASURA = gql`
mutation insertTagging($tagging_import_id: uuid, $style: String, $class: String!, $design: String!, $demography: String!) {
  insert_tagging(objects: {style: $style, tagging_import_id:
    $tagging_import_id, demography: $demography, design: $design,
    created_at: "now()", class: $class, updated_at: "now()"}, 
    on_conflict: {constraint: tagging_pkey, update_columns: [class, 
      demography,design,style,updated_at]}) {
    returning {
      tagging_import_id
      updated_at
      created_at
    }
  }
}


`;

export const TAGGING_BY_PK = gql`
query getTaggingImport($id: uuid!) {
    tagging_by_pk(id: $id) {
        company_id
        created_at
        class
        deleted
        id
        s3_url
        sku
        demography
        updated_at
        url
    }
}
`;

