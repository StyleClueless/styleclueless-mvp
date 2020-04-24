import React, {Component} from 'react';
import {withApollo, ApolloConsumer} from 'react-apollo';
// import { useHistory } from 'react-router-dom';

import {CardsWrapper} from "./components/cards-wrapper";
import CSVReader from 'react-csv-reader'
import {CsvToHtmlTable} from 'react-csv-to-table';
import  axios from "axios";
import {global_company_id, renderS3UrlFromPrefix} from "./utils";
import {GET_ALL_COMPANIES, GET_TAGGING, GET_TAGGING_IMPORT, TEST_QUERY} from "./hasura_qls";
import {Tag} from "bloomer";
import {Link} from "react-router-dom";
const BASE_URL=window.location.hostname==='localhost'?'http://localhost:3000/':'https://www.styleclueless.com/';
////this is to build new component of TAGGING SYSTEM

class onBoardingDashboard extends Component {
    state = {dataProvider: null,companies:[] ,sampleData: [], tagging_import: []};
    async componentWillMount() {
        console.log('onBoardingDashboard');

        try {
            const {data:{companies}} = await this.props.client.query({
                query: GET_ALL_COMPANIES,
                variables: {},
                fetchPolicy: 'network-only',
            });
            console.log(companies);
            this.setState({companies})
        }
        catch (e) {
            console.error(e);
        }

    }
    componentWillUnmount() {

    }
    render() {
        const {companies,tagging_import} = this.state;
        return (

            <div>

                {companies?companies.map(company=>

                    <div style={{textAlign:'center', marginBottm:"8%"}} key={company.id}>

                        <Link to={`/onBoardingCompany/${company.id}/${company.company_name}`}>
                    <h1>{company.company_name}

                    </h1>
                            <img src={renderS3UrlFromPrefix( company.logo_url,"max")}></img>

                        </Link>
                    </div>
                ):<div></div>}
                {/*<select  className={select_className} size={5} value={this.state.option} onChange={this.handleOptionsChange}>*/}
                {/*<option className={option_className} value='1'>Option 1</option>*/}
                {/*<option className={option_className} value='2'>Option 2</option>*/}
                {/*<option className={option_className}value='3'>Option 3</option>*/}
                {/*<option className={option_className} value='4'>Option 4</option>*/}
                {/*<option className={option_className} value='5'>Option 5</option>*/}
                {/*</select>*/}
            </div>

        );
    }
}

export default withApollo(onBoardingDashboard);
