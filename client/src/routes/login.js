import React, {Component} from 'react'
import { categories, dbClassMapping } from '../categories-config'
import { ItemCard } from '../components/item-card'
import { CardsWrapper } from '../components/cards-wrapper'
import { envVars } from '../util/env-vars'
import {GET_TAGGING, GET_TAGGING_URLS} from "../hasura_qls";
import {global_company_id, postRequest, renderS3UrlFromPrefix, timeoutPromise} from "../utils";
import {withApollo} from "react-apollo";
import {Box, Button, Column, Control, Field, Input, Label} from "bloomer";

import {withSnackbar} from 'notistack';

class Login extends Component {

    state = { username: '',password:''}

    async componentWillMount() {
        console.log('Login');

    }

    componentWillUnmount() {

    }
    loginClient =async()=>{

        const {client,company_id}=this.props;
        const {email,password} = this.state;

        try {
            const login_user = await postRequest('userLogin/', {email,password})
            const {company_id,admin,company}=login_user;
            if(admin){
                this.props.enqueueSnackbar("Welcome Admin", {
                    variant: 'success',
                });
                await timeoutPromise(1500);
                this.props.history.push('/StartOnBoarding')
                return
            }
            localStorage.setItem('styleClueLessCompanyId',company_id);
            localStorage.setItem('styleClueLessCompany',JSON.stringify(company));

            this.props.enqueueSnackbar("LOGIN DONE", {
                variant: 'success',
            });
            await timeoutPromise(1500);
            this.props.history.push('/')
        }
        catch (e) {

            console.error(e);
            this.props.enqueueSnackbar("login did not completed please check email:password " + e, {
                variant: 'danger',
            });
        }


    }
    render() {
        const {email,password} = this.state;
        return (

       <Box style={{textAlign:'center'}}>
           <div>

               {email}:{password}
           </div>
           First Login
           <Field  onChange={(e)=>{
               const value=e.target.value;
               this.setState({email:value})
           }}
           >
               <Label>Email</Label>
               <Control>
                   <Input  type="text" placeholder='Email' />
               </Control>
           </Field>
           <Field onChange={(e)=>{
               const value=e.target.value;
               this.setState({password:value})
           }}>
               <Label>Password</Label>
               <Control>
                   <Input type="text" placeholder='Password' />
               </Control>
           </Field>
           <Column hasTextAlign='centered'>
               <Button onClick={this.loginClient} isColor='alert' isOutlined>LOGIN</Button>
           </Column>
       </Box>
        );
    }
}

export default withApollo(withSnackbar(Login));
