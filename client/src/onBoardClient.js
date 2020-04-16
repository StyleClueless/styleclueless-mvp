import React, {Component} from 'react';
import {withApollo, ApolloConsumer} from 'react-apollo';
// import { useHistory } from 'react-router-dom';

import {CardsWrapper} from "./components/cards-wrapper";
import CSVReader from 'react-csv-reader'
import {CsvToHtmlTable} from 'react-csv-to-table';
import  axios from "axios";
import {global_company_id, renderS3UrlFromPrefix} from "./utils";
import {GET_ALL_COMPANIES, GET_TAGGING, GET_TAGGING_IMPORT, TEST_QUERY} from "./hasura_qls";
import {Link} from "react-router-dom";
const BASE_URL=window.location.hostname==='localhost'?'http://localhost:3000/':'https://www.styleclueless.com/';
////this is to build new component of TAGGING SYSTEM
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

class onBoardClient extends Component {
    state = {dataProvider: null,company_id:null,sampleData: [], tagging_import: []};
     // history = useHistory();

    async componentWillMount() {
        console.log('xxxxx');
        // debugger;

        try {
            const company_id = this.props.match.params.company_id;
            this.setState({company_id})
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
            const db_insert_row = { sku, company_id: this.state.company_id, type, gender, url}
            return db_insert_row;
        })
        const send_to_server= postRequest('tagging_import/add',db_structure)
        console.log(send_to_server);
        // insertImportToDb(this.props.client, db_structure)
    }
    fetchTaggingInfo=async()=>{
        const {company_id} = this.state;
        const tagging_import=await getTaggingImport(this.props.client,company_id);
        this.setState({tagging_import});
    }
    renderTagging=(tag)=>{
        const {company_id}=this.state;
        const newUrl=renderS3UrlFromPrefix(tag.s3_url);
        // const redirectRoute='/tagging/'+tag.sku;
        const redirectRoute='/onBoarding/tagging/'+tag.id;
        // const redirectRoute='/tagging/';
        console.log(tag);
        return (

            <Link to={`/OnBoarding/Tagging/${company_id}/${tag.id}/`}>

        <div  key={new Date().getTime()}>

            <h1>ID:{tag.sku}</h1>
            {
                tag.style&&tag.style.length>0 &&
                <div>
                    {tag.style}
                    <h1 style={{color:'green'}} >TAGGED!</h1>
                </div>


            }
            <div>            <img src={newUrl}></img>

            </div>

        </div>
            </Link>
        )
}

    render() {
        const {sampleData,tagging_import} = this.state;
        return (

            <div  style={{textAlign:'center', marginBottm:"8%"}}>
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

export default withApollo(onBoardClient);
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
const getTaggingImport=async(client,company_id)=>{
        const {data} = await client.query({
            query: GET_TAGGING,
            variables: {company_id},
            fetchPolicy: 'network-only',
        });
    console.log(data);
    const {tagging}=data;
    return tagging;
}
