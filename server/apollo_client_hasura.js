const gql = require('graphql-tag');
const ApolloClient = require('apollo-boost').ApolloClient;
const fetch = require('cross-fetch/polyfill').fetch;
const createHttpLink = require('apollo-link-http').createHttpLink;
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;
const mongoOutfit = require('./fox_boys_outfits_mongodb_output');
const mongoTagging = require('./fox_boys_taggingdata_mongodb_output');
const uri = "http://www.styleclueless.com/v1/graphql/"
export const apolloClient = new ApolloClient({
    link: createHttpLink({
        uri: uri,
        fetch: fetch
    }),
    cache: new InMemoryCache()
});
export const doHasuraRequest = async () => {

    const TEST_QUERY = gql`
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
    try {
        const data = await apolloClient.query({
            query: TEST_QUERY,
            variables: {},
            fetchPolicy: 'network-only',
        });

        const INSERT_TAGGING = gql`
mutation insertTagging($code: String!, $demography: String, $classI: String, $style: String, $shade: String, $design: String, $company_id: uuid) {
  insert_tagging(objects: {company_id: $company_id, created_at: "now()", deleted: false, class: $classI, demography: $demography, design: $design, shade: $shade, style: $style, code: $code, updated_at: "now()"}, on_conflict: {constraint: tagging_pkey, update_columns: updated_at}) {
    returning {
      demography
      design
      shade
      style
      company_id
      code
      class
    }
  }
}

`;
        const c_id = "061e449f-04d7-4898-a1a8-b3d8a052b328"
        const all_tagging = mongoTagging.map(tagging => {

            const {code, demography, class: classs, shade, design, style} = tagging;
            return {company_id: c_id, code, demography, classI: classs, shade, design, style}

        })

        // let insert_all_tagging = await Promise.all(all_tagging.map(async tagging_insert_info => {
        //
        //     const {
        //         data_insert_info
        //     } = await client.mutate({
        //         mutation: INSERT_TAGGING,
        //         variables: tagging_insert_info,
        //     });
        //     return data_insert_info;
        // }));



        const insert_to_hasura_tagging = all_tagging.map((tagging_insert_info, i) => async () => {
            try{
                console.log(tagging_insert_info);
                const {
                    data_insert_info
                } = await client.mutate({
                    mutation: INSERT_TAGGING,
                    variables: tagging_insert_info,
                });
                return data_insert_info;
            }
            catch (e) {
                console.error(e);
                return {e};
            }

        });
        for (let i = 0; i < insert_to_hasura_tagging.length; i++) {
            await insert_to_hasura_tagging[i]();
        }
        console.log(insert_to_hasura_tagging)
        return data;


    }
    catch (e) {
        console.error(e);
        return null;
    }

}
// client.mutate({
//     mutation: gql`
//     mutation popJob {
//         popJob {
//             id
//             type
//             param
//             status
//             progress
//             creation_date
//             expiration_date
//         }
//     }
//     `,
// }).then(job => {
//     console.log(job);
// })
//
// doHasuraRequest();
