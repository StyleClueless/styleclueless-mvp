import React, {Component} from 'react';
import {withApollo, ApolloConsumer} from 'react-apollo';
// import { useHistory } from 'react-router-dom';

import {CardsWrapper} from "./components/cards-wrapper";
import CSVReader from 'react-csv-reader'
import {CsvToHtmlTable} from 'react-csv-to-table';
import  axios from "axios";
import {global_company_id, isUrlValid, renderS3UrlFromPrefix} from "./utils";
import {GET_ALL_COMPANIES, GET_TAGGING, GET_TAGGING_IMPORT, TEST_QUERY} from "./hasura_qls";
import {Link} from "react-router-dom";
import { withSnackbar } from 'notistack';
import {Button, Column, Columns} from "bloomer";

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
        throw new Error(e);
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
        json = json.filter(f => f.sku!==undefined &&  f.class!==undefined && f.demography !== undefined && f.url!==undefined); //first filter

        if(!json||!json.length>0){
            this.props.enqueueSnackbar("no valid lines to enter to db - fix csv , headers are [sku, demography, url,class]", {
                variant: 'warning',
            });
            return;}
       json.forEach(obj=>{ ///check regex for url's
            const {url,type}=obj;
            if(!isUrlValid(url)){
                this.props.enqueueSnackbar("url is not valid "+ url+"-> please fix csv.", {
                    variant: 'warning',
                });
                return;
            }
        })

        console.log(json);
        const db_structure = json.map(element => {
            const {sku, demography, url} = element;
            const db_insert_row = { sku, company_id: this.state.company_id, demography, class:element['class'], url}
            return db_insert_row;
        })

        try{
            this.props.enqueueSnackbar("importing started!! ", {
                variant: 'warning',
            });
            const send_to_server= await postRequest('tagging_import/add',db_structure)
            console.log(send_to_server);
            this.props.enqueueSnackbar("importing finished!! imported !=>"+ send_to_server?send_to_server.length:0, {
                variant: 'success',
            });
        }
        catch
            (e){
            this.props.enqueueSnackbar("importing failed due to "+e, {
                variant: 'danger',
            });
        }

        // insertImportToDb(this.props.client, db_structure)
    }
    fetchTaggingInfo=async()=>{
        const {company_id} = this.state;
        const tagging_import=await getTaggingImport(this.props.client,company_id);
        this.props.enqueueSnackbar("got from db "+ tagging_import.length+" items ", {
            variant: 'succes',
        });
        this.setState({tagging_import});
    }
    renderTagging=(tag,tagged_array,untagged_array)=>{
        const {company_id}=this.state;
        const number_of_items=tagged_array.length+untagged_array.length;
        const tagging_info={company_id,number_of_item:number_of_items,number_of_tagged:tagged_array.length,untagged_array:untagged_array}
        const newUrl=renderS3UrlFromPrefix(tag.s3_url);
        // const redirectRoute='/tagging/'+tag.sku;
        const redirectRoute='/onBoarding/tagging/'+tag.id;
        // const redirectRoute='/tagging/';
        console.log(tag);
        return (

            <Link to={`/OnBoarding/Tagging/${JSON.stringify(tagging_info)}/${tag.id}/`}>

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
        const tagged_array=tagging_import.filter(tag=>tag.style&&tag.style.length>0);
        const untagged_array=tagging_import.filter(tag=>!tag.style||tag.style.length===0).map(item=>( {id:item.id}))
        return (

            <div  style={{textAlign:'center', marginBottm:"8%"}}>
                <div>
                    <Columns>
                        {/*<a onClick={this.fetchTaggingInfo} >!getTAGGINGFROMDB !</a>*/}


                        <Column  hasTextAlign='centered'>
                            <Button onClick={this.fetchTaggingInfo} isColor='success' isOutlined>Get Imported Items Of Client</Button>
                        </Column>
                    </Columns>
                    <h2>import items from csv
                    </h2>

                    <CSVReader onFileLoaded={(data, fileInfo) => this.renderCsv(data, fileInfo)}>

                    </CSVReader>



                </div>
                {sampleData && sampleData.length > 0 &&
                    <div>
                <CsvToHtmlTable
                    data={sampleData}
                    csvDelimiter=","
                />
                        <Column  hasTextAlign='centered'>
                            <Button onClick={this.insertTableToDb} isColor='alert' isOutlined>insertTableToDb</Button>
                        </Column>
                    </div>
                }
                {tagging_import&&tagging_import.length > 0 &&
                <div>   {
                    tagging_import.map(
                        (tag)=>this.renderTagging(tag,tagged_array,untagged_array)

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

export default withApollo(withSnackbar(onBoardClient));
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
