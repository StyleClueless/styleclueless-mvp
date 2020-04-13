import React, {Component} from 'react';
import {withApollo, ApolloConsumer, ApolloProvider} from 'react-apollo';
import {Palette} from 'react-palette';

import {
    Card,
    CardContent,
    Content,
    Message,
    Subtitle,
    MessageHeader,
    Columns,
    Column,
    Button,
    Icon,
    Image
} from "bloomer";

import gql from 'graphql-tag';
import SelectHighlighted from "./SelectHighlighted";
import {renderS3UrlFromPrefix, taggingOptions} from "./utils";


class Tagging extends Component {
    state = {item: null, taggingOptionsTagging: taggingOptions};

    async componentWillMount() {
        console.log('TAGGING MOUNTED');
        console.log(this.props);
        const db_id = this.props.match.params.tagging_id;
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
        const {data: {tagging_import_by_pk}} = await this.props.client.query({
            query: GET_TAGGING_IMPORT_BY_PK,
            variables: {id: db_id},
            fetchPolicy: 'network-only',
        });
        this.setState({item: tagging_import_by_pk});
        // debugger;

    }

    componentWillUnmount() {

    }

    updateValue = (titleToUpdate, value) => {
        const {item, taggingOptionsTagging} = this.state;
        const newTag = taggingOptionsTagging;
        console.log(item.id + titleToUpdate + value);
        for (let i = 0; i < newTag.length; i++) {
            const {title, selected} = newTag[i];
            if (title === titleToUpdate) {
                newTag[i].selected = value;
                break;
            }
        }
        // this.setState({taggingOptionsTagging:JSON.parse(JSON.stringify(newTag))});
        this.setState({taggingOptionsTagging: newTag});
    }
    updateInDb = async () => {
        const INSERT_TAGGING_HASURA = gql`
mutation insertTagging($tagging_import_id: uuid, $style: String, $class: String!, $design: String!, $demography: String!) {
  insert_tagging(objects: {style: $style, tagging_import_id:
    $tagging_import_id, demography: $demography, design: $design,
    created_at: "now()", class: $class, updated_at: "now()"}, 
    on_conflict: {constraint: tagging_pkey, update_columns: [class, 
      demography,design,style,updated_at]}) {
    returning {
      tagging_import_id
      updated_at
      created_at
    }
  }
}


`;
        const {item, taggingOptionsTagging} = this.state;
        const jsonObject = {};
        try {
            taggingOptionsTagging.forEach(tagging_option => {
                const {title, selected} = tagging_option;
                jsonObject[title] = selected;
            })
            jsonObject['tagging_import_id'] = item.id;
            const
                {data: {insert_tagging: {returning}}}
                    = await this.props.client.mutate({
                    mutation: INSERT_TAGGING_HASURA,
                    variables: jsonObject,
                });
            console.log(returning);
            window.location.href = '/test'
            return returning;
        }
        catch (e) {
            console.error(e);
        }
    }

    render() {
        const {item, taggingOptionsTagging} = this.state;
        console.log(taggingOptionsTagging);
        const imageUrl=item ? renderS3UrlFromPrefix(item.s3_url) : '';
        return (

            <div key={imageUrl+ Math.random()}>
                TAGGING TAGGING COMPONENET

                <div  key={imageUrl+new Date().getTime()} style={{textAlign: 'center'}}><img src={imageUrl}></img>

                    {/*<Palette src={imageUrl}>*/}
                        {/*{({ data, loading, error }) => (*/}
                            {/*<div style={{ color: data.vibrant }}>*/}
                                {/*Text with the vibrant color*/}
                                {/*{error&& <div style={{color:'red'}}>*/}
                                {/*{error}*/}
                                {/*</div>}*/}
                            {/*</div>*/}

                        {/*)}*/}
                    {/*</Palette>*/}
                </div>
                {taggingOptionsTagging.map((tagging_option, i) => {
                    console.log(tagging_option);
                    return <div key={new Date().getTime()}>
                        {i}
                        <SelectHighlighted selected={tagging_option.selected} options_array={tagging_option.values}
                                           title={tagging_option.title}
                                           updateParent={this.updateValue}
                                           color={tagging_option.color}
                        />
                    </div>
                })}
                {/*<SelectHighlighted options_array={['no_shade','moreShade','blat']}  title={'shade'} updateParent={this.updateValue} color={'primary'}*/}
                {/*/>*/}
                <Columns>
                    <Button isColor='info' render={
                        props => <Column onClick={this.updateInDb} hasTextAlign='centered'><p {...props}>Button</p>
                        </Column>
                    }/>
                    {/*<Column>*/}
                    {/*<Button isColor='warning' isLoading>isLoading={true}</Button>*/}
                    {/*</Column>*/}
                    {/*<Column hasTextAlign='centered'>*/}
                    {/*<Button isColor='success' isOutlined>isOutlined</Button>*/}
                    {/*</Column>*/}
                </Columns>
            </div>

        );
    }
}


export default withApollo(Tagging);
