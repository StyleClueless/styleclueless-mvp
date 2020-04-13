import React, {Component} from 'react';
import {withApollo, ApolloConsumer} from 'react-apollo';
// import { useHistory } from 'react-router-dom';

import gql from 'graphql-tag';
import {CardsWrapper} from "./components/cards-wrapper";
import CSVReader from 'react-csv-reader'
import {CsvToHtmlTable} from 'react-csv-to-table';
import  axios from "axios";
import {renderS3UrlFromPrefix} from "./utils";
const BASE_URL=window.location.hostname==='localhost'?'http://localhost:3000/':'https://www.styleclueless.com/';
////this is to build new component of TAGGING SYSTEM
const sampleDataConst = `
Model,mpg,cyl,disp,hp,drat,wt,qsec,vs,am,gear,carb
Mazda RX4,21,6,160,110,3.9,2.62,16.46,0,1,4,4
Mazda RX4 Wag,21,6,160,110,3.9,2.875,17.02,0,1,4,4
Datsun 710,22.8,4,108,93,3.85,2.32,18.61,1,1,4,1
Hornet 4 Drive,21.4,6,258,110,3.08,3.215,19.44,1,0,3,1
Hornet Sportabout,18.7,8,360,175,3.15,3.44,17.02,0,0,3,2
Valiant,18.1,6,225,105,2.76,3.46,20.22,1,0,3,1
Duster 360,14.3,8,360,245,3.21,3.57,15.84,0,0,3,4
Merc 240D,24.4,4,146.7,62,3.69,3.19,20,1,0,4,2
Merc 230,22.8,4,140.8,95,3.92,3.15,22.9,1,0,4,2
Merc 280,19.2,6,167.6,123,3.92,3.44,18.3,1,0,4,4
Merc 280C,17.8,6,167.6,123,3.92,3.44,18.9,1,0,4,4
Merc 450SE,16.4,8,275.8,180,3.07,4.07,17.4,0,0,3,3
Merc 450SL,17.3,8,275.8,180,3.07,3.73,17.6,0,0,3,3
Merc 450SLC,15.2,8,275.8,180,3.07,3.78,18,0,0,3,3
Cadillac Fleetwood,10.4,8,472,205,2.93,5.25,17.98,0,0,3,4
Lincoln Continental,10.4,8,460,215,3,5.424,17.82,0,0,3,4
Chrysler Imperial,14.7,8,440,230,3.23,5.345,17.42,0,0,3,4
Fiat 128,32.4,4,78.7,66,4.08,2.2,19.47,1,1,4,1
`;
 const postRequest = async (url,body) => {
    try {
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
            },
        };
        let rawResponse = await axios.post(
            BASE_URL+ url,
            body,
            axiosConfig
        );
        let content = '';
        if (rawResponse.status < 200 || rawResponse.status >= 300) {
            console.error(JSON.stringify(rawResponse));
            throw new Error('Dupelicate Company or Email');
        }
        if (rawResponse !== null && rawResponse !== undefined) {
            content = rawResponse.data;
        }
        return content;
    } catch (e) {
        console.error('GLOBAL POST REQUEST ERROR' + e);
    }
};

class TestHasura extends Component {
    state = {dataProvider: null, sampleData: [], tagging_import: []};
     // history = useHistory();

    async componentWillMount() {
        console.log('x');
        // debugger;
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
            const data = await this.props.client.query({
                query: TEST_QUERY,
                variables: {},
                fetchPolicy: 'network-only',
            });
            console.log(data);
        }
        catch (e) {
            console.error(e);
        }

    }

    componentWillUnmount() {

    }


    renderCsv = (data, fileInfo) => {
        console.dir(data, fileInfo);
        const data_insert = data.slice(1);
        let new_format_csv = '';
        for (let i = 0; i < data.length; i++) {
            const data_array = data[i];
            for (let j = 0; j < data_array.length; j++) {
                const data_in = data_array[j];

                new_format_csv += data_in.length > 0 ? i===0?data_in.trim().toLowerCase():data_in.trim() : ' ';
                if (j !== data_array.length - 1) {
                    new_format_csv += ',';
                }
                else {
                    new_format_csv += '\n'
                }
            }
        }

        console.log(data);
        console.log(new_format_csv);
        this.setState({sampleData: new_format_csv});


    }
    insertTableToDb = async () => {
        const {sampleData} = this.state;
        let json = csvJSON(sampleData);
        json = json.filter(f => f.type !== undefined);
        if(!json||!json.length>0){return;}
        console.log(json);

        const db_structure = json.map(element => {
            const {sku, type, gender, url} = element;
            const db_insert_row = { sku, company_id: "061e449f-04d7-4898-a1a8-b3d8a052b328", type, gender, url}
            return db_insert_row;
        })
        const send_to_server= postRequest('tagging_import/add',db_structure)
        console.log(send_to_server);
        // insertImportToDb(this.props.client, db_structure)
    }
    fetchTaggingInfo=async()=>{
        const tagging_import=await getTaggingImport(this.props.client);
        this.setState({tagging_import});
    }
    renderTagging=(tag)=>{
        const newUrl=renderS3UrlFromPrefix(tag.s3_url);
        // const redirectRoute='/tagging/'+tag.sku;
        const redirectRoute='/tagging/'+tag.id;
        // const redirectRoute='/tagging/';
        console.log(tag);
        return (
        <div onClick={() =>window.location.href=redirectRoute  } key={new Date().getTime()}>

            <h1>ID:{tag.sku}</h1>
            <div>            <img src={newUrl}></img>

            </div>

        </div>
        )
}

    render() {
        const {sampleData,tagging_import} = this.state;
        return (

            <div>
                <div>
                    <a onClick={this.insertTableToDb} >!insertTableToDb !</a>
                    <CSVReader onFileLoaded={(data, fileInfo) => this.renderCsv(data, fileInfo)}>

                    </CSVReader>
                    {sampleData && sampleData.length > 0 &&
                    <CsvToHtmlTable
                        data={sampleData}
                        csvDelimiter=","
                    />}
                </div>
                <a onClick={this.fetchTaggingInfo} >!getTAGGINGFROMDB !</a>

                {tagging_import&&tagging_import.length > 0 &&
                <div>   {
                    tagging_import.map(
                        (tag)=>this.renderTagging(tag)

                    )

                }

                <div>
                    TAGGING {tagging_import.length}


                 </div>
                </div>
                }
            </div>

        );
    }
}

export default withApollo(TestHasura);
var csvJSON = function (csv) {

    var lines = csv.split("\n")
    var result = []
    var headers = lines[0].split(",")

    lines.map(function (line, indexLine) {
        if (indexLine < 1) return // Jump header line

        var obj = {}
        var currentline = line.split(",")

        headers.map(function (header, indexHeader) {
            obj[header] = currentline[indexHeader]
        })

        result.push(obj)
    })

    result.pop() // remove the last item because undefined values

    return result // JavaScript object
}
const getTaggingImport=async(client)=>{

    const GET_TAGGING_IMPORT = gql`

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
    const {data} = await client.query({
        query: GET_TAGGING_IMPORT,
        variables: {},
        fetchPolicy: 'network-only',
    });
    console.log(data);
    const {tagging_import}=data;
    return tagging_import;
}
