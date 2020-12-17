import React, {Component} from 'react';
import {withApollo, ApolloConsumer} from 'react-apollo';
// import { useHistory } from 'react-router-dom';

import {CardsWrapper} from "./components/cards-wrapper";
import CSVReader from 'react-csv-reader'
import {CsvToHtmlTable} from 'react-csv-to-table';
import {BASE_URL, csvJSON, global_company_id, isUrlValid, postRequest, renderCsv, renderS3UrlFromPrefix} from "./utils";
import {GET_ALL_COMPANIES, GET_TAGGING, GET_TAGGING_IMPORT, TEST_QUERY} from "./hasura_qls";
import {Link} from "react-router-dom";
import {withSnackbar} from 'notistack';
import {Box, Button, Column, Columns, Tag} from "bloomer";

////this is to build new component of TAGGING SYSTEM


class onBoardClient extends Component {
    state = {dataProvider: null, company_name: null, company_id: null, sampleData: [], tagging_import: []};

    // history = useHistory();

    async componentWillMount() {
        console.log('xxxxx');
        // debugger;

        try {
            const {company_id, company_name} = this.props.match.params
            this.setState({company_id, company_name})
        }
        catch (e) {
            console.error(e);
        }

    }

    componentWillUnmount() {

    }


    insertTableToDb = async () => {
        const {sampleData} = this.state;
        let json = csvJSON(sampleData);
        json = json.filter(f => f.sku !== undefined && f.url !== undefined); //first filter

        if (!json || !json.length > 0) {
            this.props.enqueueSnackbar("no valid lines to enter to db - fix csv , headers are [sku, url]", {
                variant: 'warning',
            });
            return;
        }
        let url_not_valid=false;
        json.forEach(obj => { ///check regex for url's
            const {url, type} = obj;
            if (!isUrlValid(url)) {
                url_not_valid=true;
                this.props.enqueueSnackbar("url is not valid " + url + "-> please fix csv.", {
                    variant: 'warning',
                });

            }
        })
        if(url_not_valid)return;
        console.log(json);
        const db_structure = json.map(element => {
            const {sku, demography, url} = element;
            const db_insert_row = {sku, company_id: this.state.company_id, demography, class: element['class'], url}
            return db_insert_row;
        })

        try {
            this.props.enqueueSnackbar("importing started!! ", {
                variant: 'success',
            });
            const send_to_server = await postRequest('tagging_import/add', db_structure)
            console.log(send_to_server);
            this.props.enqueueSnackbar("importing finished!! imported !=>" + send_to_server ? send_to_server.length : 0, {
                variant: 'success',
            });
        }
        catch
            (e) {
            this.props.enqueueSnackbar("importing failed due to " + e, {
                variant: 'warning',
            });
        }

        // insertImportToDb(this.props.client, db_structure)
    }

    render() {
        const {sampleData, tagging_import, company_name,company_id} = this.state;
        const tagged_array = tagging_import.filter(tag => tag.style && tag.style.length > 0);
        const untagged_array = tagging_import.filter(tag => !tag.style || tag.style.length === 0).map(item => ({id: item.id}))
        return (

            <div style={{textAlign: 'center', marginBottm: "8%"}}>
                <div>
                    <Box>
                        {company_name}
                    </Box>
                    <Columns>

                        {/*<a onClick={this.fetchTaggingInfo} >!getTAGGINGFROMDB !</a>*/}

                        <Column hasTextAlign='centered'>

                            <Link to={`/onBoardingTagging/${company_id}/${company_name}`}>
                                <Box>Go To Tagging DashBoard</Box>
                            </Link>
                        </Column>
                        <Column hasTextAlign='centered'>

                            <Link to={`/onBoardingOutfits/${company_id}/${company_name}`}>
                                <Box>Go To Outfits Import</Box>
                            </Link>
                        </Column>
                    </Columns>
                    <Box>import items from csv
                    </Box>

                    <CSVReader onFileLoaded={(data, fileInfo) =>   this.setState({sampleData: renderCsv(data, fileInfo)})}>

                    </CSVReader>


                </div>
                {sampleData && sampleData.length > 0 &&
                <div>
                    <Column hasTextAlign='centered'>
                        <Button onClick={this.insertTableToDb} isColor='alert' isOutlined>insertTableToDb</Button>
                    </Column>
                    <CsvToHtmlTable
                        data={sampleData}
                        csvDelimiter=","
                    />

                </div>
                }
            </div>

        );
    }
}

export default withApollo(withSnackbar(onBoardClient));
