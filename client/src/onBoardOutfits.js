import React, {Component} from 'react';
import {withApollo, ApolloConsumer} from 'react-apollo';
// import { useHistory } from 'react-router-dom';

import {CardsWrapper} from "./components/cards-wrapper";
import CSVReader from 'react-csv-reader'
import {CsvToHtmlTable} from 'react-csv-to-table';
import {
    BASE_URL,
    csvJSON,
    global_company_id,
    isUrlValid,
    isUUID,
    postRequest,
    renderCsv,
    renderS3UrlFromPrefix, uuidv4
} from "./utils";
import {GET_ALL_COMPANIES, GET_TAGGING, GET_TAGGING_IMPORT, INSERT_OUTFITS_BULK, TEST_QUERY} from "./hasura_qls";
import {Link} from "react-router-dom";
import {withSnackbar} from 'notistack';
import {Box, Button, Column, Columns, Tag} from "bloomer";

////this is to build new component of TAGGING SYSTEM


class onBoardOutfits extends Component {
    state = {clicked:false,dataProvider: null, company_name: null, company_id: null, sampleData: [], tagging_import: []};

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


    insertTableToDb = async () => { ///outfits
        const {sampleData} = this.state;
        this.setState({clicked:true});
        const {client}=this.props;
        let json = csvJSON(sampleData);
        let validProps = true;
        console.log(json);

        // let insert_array=[];
        // const db_structure = json.map(element => {
        //     const uuid = uuidv4();
        //     for (const [key, val] of Object.entries(element)) {
        //         if (isUUID(val)) {
        //             insert_array.push({outfit_id: uuid, tagging_id: val
        //              ,created_at:"now()",updated_at:"now()"});
        //         }
        //     }
        // })
        try {
            this.props.enqueueSnackbar("outfits importing started - this may take some time (few mins) please WAIT! ", {
                variant: 'warning',
            });
            const send_to_server = await postRequest('outfits/add', json)
            console.log(send_to_server);
            // const {data:{insert_outfits:{returning}}} = await client.mutate({
            //     mutation: INSERT_OUTFITS_BULK,
            //     variables: {objects:insert_array},
            //     fetchPolicy: 'network-only',
            // });
            // console.log(returning);
            //
            // debugger;
            //
            //
            //
            const size_inserted=send_to_server ? send_to_server.length : 0;
            this.props.enqueueSnackbar("outfits inserted=>" + size_inserted, {
                variant: 'success',
            });
        }
        catch
            (e) {
            debugger;
            this.props.enqueueSnackbar("outfits insert failed due to " + e, {
                variant: 'warning',
            });
        }
        finally {
            this.setState({clicked:false});

        }

    }

    render() {
        const {clicked,sampleData, tagging_import, company_name, company_id} = this.state;
        const tagged_array = tagging_import.filter(tag => tag.style && tag.style.length > 0);
        const untagged_array = tagging_import.filter(tag => !tag.style || tag.style.length === 0).map(item => ({id: item.id}))
        return (

            <div style={{textAlign: 'center', marginBottm: "8%"}}>
                <div>
                    <Box>
                        {company_name}
                    </Box>

                    <Box>Update Outfits from Csv
                    </Box>

                    <CSVReader
                        onFileLoaded={(data, fileInfo) => this.setState({sampleData: renderCsv(data, fileInfo)})}>

                    </CSVReader>


                </div>
                {sampleData && sampleData.length > 0 &&
                <div>
                    {!clicked&&
                    <Column hasTextAlign='centered'>
                        <Button onClick={this.insertTableToDb} isColor='alert' isOutlined>insertTableToDb</Button>
                    </Column>
                    }
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

export default withApollo(withSnackbar(onBoardOutfits));
