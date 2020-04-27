import React, {Component} from 'react';
import {withApollo, ApolloConsumer} from 'react-apollo';
// import { useHistory } from 'react-router-dom';

import {CardsWrapper} from "./components/cards-wrapper";
import CSVReader from 'react-csv-reader'
import {CsvToHtmlTable} from 'react-csv-to-table';
import axios from "axios";
import {global_company_id, isUrlValid, renderS3UrlFromPrefix} from "./utils";
import {GET_ALL_COMPANIES, GET_TAGGING, GET_TAGGING_IMPORT, TEST_QUERY} from "./hasura_qls";
import {Link} from "react-router-dom";
import {withSnackbar} from 'notistack';
import {Box, Button, Column, Columns, Tag} from "bloomer";

import {CSVLink, CSVDownload} from "react-csv";


class onBoardTagging extends Component {
    state = {dataProvider: null, company_name: null, company_id: null, sampleData: [], tagging_import: []};


    async componentWillMount() {


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


    fetchTaggingInfo = async () => {
        const {company_id} = this.state;
        const tagging_import = await getTaggingImport(this.props.client, company_id);
        this.props.enqueueSnackbar("got from db " + tagging_import.length + " items ", {
            variant: 'succes',
        });
        this.setState({tagging_import});
    }
    renderTagging = (tag, tagged_array, untagged_array) => {
        const {company_id} = this.state;
        const number_of_items = tagged_array.length + untagged_array.length;
        localStorage.setItem('untagged_array', JSON.stringify(untagged_array));
        const tagging_info = {
            company_id,
            number_of_item: number_of_items,
            number_of_tagged: tagged_array.length,
            // untagged_array: untagged_array
        }
        const newUrl = renderS3UrlFromPrefix(tag.s3_url);
        // const redirectRoute='/tagging/'+tag.sku;
        const redirectRoute = '/onBoarding/tagging/' + tag.id;
        // const redirectRoute='/tagging/';
        console.log(tag);
        return (

            <Link key={tag.id} to={`/OnBoarding/Tagging/${tag.id}/${tag.sku}/${JSON.stringify(tagging_info)}/`}>

                <div key={new Date().getTime()}>

                    <h1>ID:{tag.sku}</h1>
                    {
                        tag.style && tag.style.length > 0 &&
                        <div>
                            {tag.style}
                            <h1 style={{color: 'green'}}>TAGGED!</h1>
                        </div>


                    }
                    <div><img src={newUrl}></img>

                    </div>

                </div>
            </Link>
        )
    }

    render() {
        const {sampleData, tagging_import, company_name} = this.state;
        const tagged_array = tagging_import.filter(tag => tag.style && tag.style.length > 0);
        const untagged_array = tagging_import.filter(tag => !tag.style || tag.style.length === 0).map(item => ({id: item.id}))
        const csvData = [
            ["firstname", "lastname", "email"],
            ["Ahmed", "Tomi", "ah@smthing.co.com"],
            ["Raed", "Labes", "rl@smthing.co.com"],
            ["Yezzi", "Min l3b", "ymin@cocococo.com"]
        ];
        let csv = "";
        let csvArray = [];
        let keys = (tagging_import[0] && Object.keys(tagging_import[0])) || [];
        csvArray.push(keys);
        csv += keys.join(',') + '\n';
        for (var line of tagging_import) {
            const {style} = line;
            if (style && style.length > 0) {
                // csv += keys.map(key => line[key]).join(',') + '\n';
                const lineArray = keys.map(key => line[key]);
                csvArray.push(lineArray);
                csv += lineArray.join(',') + '\n';

            }
        }
        return (

            <div style={{textAlign: 'center', marginBottm: "8%"}}>


                <div>
                    <Box>
                        {company_name}
                    </Box>
                    <Columns>


                        <Column hasTextAlign='centered'>
                            <Button onClick={this.fetchTaggingInfo} isColor='success' isOutlined>Get Imported Items Of
                                Client</Button>
                        </Column>

                    </Columns>

                    {csvArray.length>2&& <div>
                    <h1>Download Csv Of Tagged For Outfits</h1>
                        <h2>Tagged Items : {csvArray.length-1}</h2>
                    <CSVLink  filename={new Date().getTime()+"-tagged_item.csv"}
                        data={csvArray}>Download</CSVLink>

                    {/*<CSVDownload data={csvData} target="_blank" />*/}

                </div> }
                </div>
                {tagging_import && tagging_import.length > 0
               &&
                <div>
                    <Box>
                        TAGGING {tagging_import.length}


                    </Box>
                    {
                        tagging_import.map(
                            (tag) => this.renderTagging(tag, tagged_array, untagged_array)
                        )

                    }


                </div>
                }
            </div>

        );
    }
}

export default withApollo(withSnackbar(onBoardTagging));
const getTaggingImport = async (client, company_id) => {
    const {data} = await client.query({
        query: GET_TAGGING,
        variables: {company_id},
        fetchPolicy: 'network-only',
    });
    console.log(data);
    const {tagging} = data;
    return tagging;
}
