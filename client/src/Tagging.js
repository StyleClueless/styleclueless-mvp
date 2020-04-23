import React, {Component} from 'react';
import {withApollo, ApolloConsumer, ApolloProvider} from 'react-apollo';
// import {Palette} from 'react-palette';
// import Color from 'color-thief-react';
// import { SnackbarProvider, withSnackbar } from 'notistack';
import 'bulma/css/bulma.css';
import {withSnackbar} from 'notistack';

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
import {renderS3UrlFromPrefix, taggingOptions, timeoutPromise} from "./utils";
import {renderPalette} from "./palette";
import {INSERT_TAGGING_HASURA, TAGGING_BY_PK, UPDATE_TAGGING} from "./hasura_qls";

// import ColorExtractor from "react-color-extractor/src/ColorExtractor";


class Tagging extends Component {
    state = {item: null, tagging_info: null, taggingOptionsTagging: []};

    async componentWillMount() {
        console.log('TAGGING MOUNTED');
        console.log(this.props);
        this.props.enqueueSnackbar("testthis", {
            variant: 'success',
        });
        const db_id = this.props.match.params.tagging_id;
        const tagging_info = JSON.parse(this.props.match.params.tagging_info);

        const {data: {tagging_by_pk}} = await this.props.client.query({
            query: TAGGING_BY_PK,
            variables: {id: db_id},
            fetchPolicy: 'network-only',
        });
        const taggingOptionsTaggingFromItem = taggingOptions.map((tagging_option, i) => {
                let selected = '';
                if (tagging_by_pk !== null && tagging_by_pk[tagging_option.title]) {
                    selected = tagging_by_pk[tagging_option.title];
                    console.log('sel' + selected);

                }
                return Object.assign({}, tagging_option, {selected});
            }
        );
        this.setState({
            tagging_info,
            item: tagging_by_pk,
            taggingOptionsTagging: taggingOptionsTaggingFromItem
        });


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
        this.props.enqueueSnackbar(item.id + titleToUpdate + value, {
            variant: 'success',
        });
        this.setState({taggingOptionsTagging: newTag});
    }

    updateInDb = async () => {
        let {item, taggingOptionsTagging, tagging_info} = this.state;
        const jsonObject = {};

        // this.props.enqueueSnackbar("updating " +item.id, {
        //     variant: 'success',
        // });
        try {
            taggingOptionsTagging.forEach(tagging_option => {
                let {title, selected} = tagging_option;
                if (selected.length <= 0) {
                    selected = null;
                }
                jsonObject[title] = selected;
            })
            jsonObject['tagging_id'] = item.id;
            const
                {data: {update_tagging: {returning}}}
                    = await this.props.client.mutate({
                    mutation: UPDATE_TAGGING,
                    variables: jsonObject,
                });
            console.log(returning);

            const {untagged_array} = tagging_info
            debugger;
            const new_untagged_array = untagged_array.filter(untagged_item => untagged_item.id !== item.id)
            tagging_info.untagged_array = new_untagged_array;
            if (new_untagged_array.length > 0) {
                this.props.enqueueSnackbar("Finished Item Tagging - Moving To Next Item!", {
                    variant: 'warning',
                });
                await timeoutPromise(1500);
                this.props.history.push(`/OnBoarding/Tagging/${JSON.stringify(tagging_info)}/${untagged_array[0].id}/`);

            }
            else {
                this.props.enqueueSnackbar("Finished Tagging - GOING BACK TO MAIN!", {
                    variant: 'success',
                });
                await timeoutPromise(3000);
                this.props.history.push('/StartOnBoarding');

            }
            // this.props.history.goBack();

            // return returning;
        }
        catch (e) {
            this.props.enqueueSnackbar("couldnt insert to db - make sure all of the items are selected!", {
                variant: 'warning',
            });
            console.error(e);
        }
    }

    render() {
        const {item, taggingOptionsTagging, tagging_info} = this.state;
        console.log(taggingOptionsTagging);
        const imageUrl = item ? renderS3UrlFromPrefix(item.s3_url) : '';
        // const RenderPalette=renderPalette('https://s.gravatar.com/avatar/b9534af76521f9544f5d6bea6207bf94?size=496&default=retro');
        // const RenderPalette=
        //     <Color crossOrigin={true} src={imageUrl}>
        //         {({ data, loading, error }) => (
        //             <div style={{ color: data }}>
        //                 Text with the predominant color
        //             </div>
        //         )}
        //     </Color>;
        // const RenderPalette=<ColorExtractor getColors={colors => console.log(colors)}>
        //     <img src={imageUrl} alt={imageUrl} style={{ width: 700, height: 500 }} />
        // </ColorExtractor>

        return (
            <div key={Math.random() * 15000}>
                {/*TAGGING TAGGING COMPONENET*/}


                {/*<SelectHighlighted options_array={['no_shade','moreShade','blat']}  title={'shade'} updateParent={this.updateValue} color={'primary'}*/}
                {/*/>*/}
                <Columns>

                    <div key={imageUrl + new Date().getTime() + Math.random()} style={{textAlign: 'center'}}>
                        <Column>
                            <img src={imageUrl}></img>
                        </Column>

                        {/*{RenderPalette}*/}
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
                            {/*{i}*/}
                            <SelectHighlighted
                                selected={tagging_option && tagging_option.selected !== '' ? tagging_option.selected : undefined}
                                options_array={tagging_option.values}
                                title={tagging_option.title}
                                updateParent={this.updateValue}
                                color={tagging_option.color}
                            />
                        </div>
                    })}
                    <Button isColor='info' render={
                        props => <Column onClick={this.updateInDb} hasTextAlign='centered'><p {...props}>Update
                            Tagging</p>
                        </Column>
                    }/>
                    {tagging_info &&
                    <Column>
                        {/*<h1>*/}
                            {/*Company : {tagging_info.company_id}*/}
                        {/*</h1>*/}
                        <h2> Number Of Total Items : {tagging_info.number_of_item}</h2><h3>Tagged Items
                        : {tagging_info.number_of_tagged}</h3></Column>
                    }

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


export default withApollo(withSnackbar(Tagging));
