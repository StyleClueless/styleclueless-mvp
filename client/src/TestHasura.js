import React, {Component} from 'react';
import {withApollo, ApolloConsumer} from 'react-apollo';

import gql from 'graphql-tag';
import {CardsWrapper} from "./components/cards-wrapper";
import CSVReader from 'react-csv-reader'
import {CsvToHtmlTable} from 'react-csv-to-table';
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

class TestHasura extends Component {
    state = {dataProvider: null, sampleData: [], tagging_import: []};

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
            const db_insert_row = {code: sku, company_id: "061e449f-04d7-4898-a1a8-b3d8a052b328", type, gender, url}
            return db_insert_row;
        })
        insertImportToDb(this.props.client, db_structure)
    }
    fetchTaggingInfo=async()=>{
        const tagging_import=await getTaggingImport(this.props.client);
        this.setState({tagging_import});
    }
    renderTagging=(tag)=>{
        const scaleFactor=150;
        const scaleString=scaleFactor+'x'+scaleFactor+'/';
        const url=tag.url;

       const n = url.lastIndexOf("/");
       const newUrl=url.substring(0,n+1)+scaleString+url.substring(n+1)
        console.log(tag);
        return (
        <div>
            {tag.code}

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
            code
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
const insertImportToDb = async (client, db_insert_array) => {
    const INSERT_TAGGING_IMPORT_HASURA = gql`
mutation insertTaggingImport($company_id: uuid, $gender: String, $code: String!, $type: String!, $url: String!) {
  insert_tagging_import(objects: {code: $code, company_id: $company_id, gender: $gender, type: $type, updated_at: "now()", url: $url, created_at: "now()"}, on_conflict: {constraint: tagging_import_pkey, update_columns: updated_at}) {
    affected_rows
    returning {
      id
      code
      company_id
      updated_at
      created_at
    }
  }
}
`;

    const insert_to_hasura_tagging = db_insert_array.map((tagging_insert_info, i) => async () => {
        try {
            console.log(tagging_insert_info);
            const
                data_insert_info
                    = await client.mutate({
                    mutation: INSERT_TAGGING_IMPORT_HASURA,
                    variables: tagging_insert_info,
                });
            console.log(data_insert_info);
            return data_insert_info;
        }
        catch (e) {
            console.error(e);
            return {e};
        }

    });
    let return_values = [];
    for (let i = 0; i < insert_to_hasura_tagging.length; i++) {
        const return_value = await insert_to_hasura_tagging[i]();
        return_values[i] = return_value;
    }
    console.log(return_values);

    console.log(insert_to_hasura_tagging);
    return insert_to_hasura_tagging;
}
