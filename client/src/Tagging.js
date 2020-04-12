import React, {Component} from 'react';
import {withApollo, ApolloConsumer, ApolloProvider} from 'react-apollo';
import {Card, CardContent, Content, Message, Subtitle, MessageHeader, Columns, Column,Button,Icon, Image} from "bloomer";

import gql from 'graphql-tag';
import SelectHighlighted from "./SelectHighlighted";
import {renderS3UrlFromPrefix} from "./utils";


    class Tagging extends Component {
    state = {item: null};

    async componentWillMount() {
        console.log('TAGGING MOUNTED');
        console.log(this.props);
        const db_id=this.props.match.params.tagging_id;
        const GET_TAGGING_IMPORT_BY_PK = gql`

query getTaggingImport($id: uuid!) {
  tagging_import_by_pk(id: $id) {
    company_id
    created_at
    gender
    deleted
    id
    s3_url
    sku
    type
    updated_at
    url
  }
}
`;
        const {data:{tagging_import_by_pk}} = await this.props.client.query({
            query: GET_TAGGING_IMPORT_BY_PK,
            variables: {id:db_id},
            fetchPolicy: 'network-only',
        });
        this.setState({item:tagging_import_by_pk});
        // debugger;

    }

    componentWillUnmount() {

    }

         updateValue=(title,value)=>{
        const {item}=this.state;
            console.log(item.id+title+value);
        }

    render() {
        const {item} = this.state;

        return (

            <div >
                TAGGING TAGGING COMPONENET

                <div style={{textAlign:'center'}}>            <img src={item?renderS3UrlFromPrefix(item.s3_url):''}></img>
                </div>
                <SelectHighlighted options_array={['blue','black','green']} title={'color'} updateParent={this.updateValue} color={'black'}
                />
                <SelectHighlighted options_array={['no_shade','moreShade','blat']}  title={'shade'} updateParent={this.updateValue} color={'primary'}
                />

                    <Columns>
                        <Button isColor='info' render={
                            props => <Column hasTextAlign='centered'><p {...props}>Button</p></Column>
                        } />
                        <Column>
                            <Button isColor='warning' isLoading>isLoading={true}</Button>
                        </Column>
                        <Column hasTextAlign='centered'>
                            <Button isColor='success' isOutlined>isOutlined</Button>
                        </Column>
                    </Columns>
            </div>

        );
    }
}


export default withApollo(Tagging);
