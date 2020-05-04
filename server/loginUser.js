import {apolloClient} from "./apollo_client_hasura";
import {upload} from "./fetchImageAndUploadToBucket";
import {consoleLabel} from "./utils";

const router = require('express').Router();
const gql = require('graphql-tag');

router.post('/', async function (req, res) {
    const label = consoleLabel('/loginByEmailPassword PROCESS POST ');
    console.time(label);
    try {
        const body = req.body || '';
        let {email,password}=body;
        email=email.toString().toLowerCase();
        if(email==='admin@styleclueless.com' && password==='u_n!q$password'){
            res.status(200).send({admin:true})
        }
        const login_user = await loginByEmailPassword({email,password});
        if(login_user){
            res.send(login_user);
            return;
        }
        res.status(500).end('bad email password');
    }
    catch (e) {
        console.error(e);
        res.status(500).end(e.message ? e.message : e);
    } finally {
        console.timeEnd(label);
    }
});

module.exports = router;


const CLIENT_BY_EMAIL_PASSWORD = gql`
query clientsByEmailPassword($email: String!, $password: String!) {
  clients(where: {email: {_eq: $email}, password: {_eq: $password}}) {
    email
    company_id
    company{logo_url,company_name}
  }
}
`;



export const loginByEmailPassword = async (db_post) => {
    const label = consoleLabel('loginByEmailPassword');
    console.time(label);
    const client = apolloClient;
    try {
        const
            login_by_email
                = await client.query({
                query: CLIENT_BY_EMAIL_PASSWORD,
                variables: db_post,
            });
        console.log(login_by_email);
        let return_values=login_by_email.data.clients[0];
        return return_values;
    }
    catch (e) {
        console.error(e);
        return null;
    }
}
