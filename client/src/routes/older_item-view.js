import React, {useState, useEffect, Component} from 'react'
import {Link} from 'react-router-dom'
import {dbClassMapping} from '../categories-config'
import {ItemLabel} from '../components/item-label'
import {envVars} from '../util/env-vars'
import {CardsWrapper} from '../components/cards-wrapper'
import {
    ALL_OUTFITS_BY_TAGGING_ID,
    GET_ALL_TAGGING_FROM_OUTFIT,
    GET_TAGGING_BY_CLASS,
    TAGGING_BY_PK
} from "../hasura_qls";
import {global_company_id, renderS3UrlFromPrefix} from "../utils";
import {ItemCard} from "../components/item-card";
import {withApollo} from "react-apollo";
import './older.css';
class ItemView extends Component {

    state = {outfitDictionary: {}, taggingDictionary: {}};

    async componentWillMount() {
        const {client} = this.props;
        const itemCode = this.props.match.params.itemCode;
        console.log(' rendering ITEMVIEW for' + itemCode);

        try {
            const {taggingDictionary, outfitDictionary, tagging_by_pk} = await this.getOutfits(client, itemCode);
            this.setState({outfitDictionary, taggingDictionary, item: tagging_by_pk});
        }
        catch (e) {
            console.error(e);
        }

    }

    getOutfits = async (client, itemCode) => {
        // const {data} = await client.query({
        //     query: ALL_OUTFITS_BY_TAGGING_ID,
        //     variables: {tagging_id: itemCode},
        //     fetchPolicy: 'network-only',
        // });
        // console.log(data);
        // const {outfits,tagging} = data;
        // let allIds=[];
        // for(let i=0;i<outfits.length;i++ ){
        //     const outfitTagging=outfits[i].outfit;
        //     for(let j=0;j<outfitTagging.length;j++){
        //         const id=outfitTagging[j];
        //         allIds.push(id);
        //     }
        // }

        const {data: {tagging_by_pk}} = await this.props.client.query({
            query: TAGGING_BY_PK,
            variables: {id: itemCode},
            fetchPolicy: 'network-only',
        });
        const {outfits} = tagging_by_pk;
        const outfitsIds = outfits.map(outfit => outfit.outfit_id);
        const getOutfits = await client.query({
            query: GET_ALL_TAGGING_FROM_OUTFIT,
            variables: {outfits: outfitsIds},
            fetchPolicy: 'network-only',
        });
        console.log(getOutfits.data.outfits);
        // debugger;
        const outfitInfo = getOutfits.data ? getOutfits.data.outfits : [];
        let outfitDictionary = {};
        let taggingDictionary = {};
        outfitInfo.forEach(function (prop, index) {
            taggingDictionary[prop.tagging_id] = prop;
            if (outfitDictionary[prop.outfit_id] !== undefined) {
                outfitDictionary[prop.outfit_id].push(prop);

            }
            else {
                outfitDictionary[prop.outfit_id] = [prop];
            }
        });
        return {tagging_by_pk, outfitDictionary, taggingDictionary};
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

        // console.log("componentDidUpdate " +JSON.stringify(prevProps));
    }

    componentWillUnmount() {

    }

    render() {
        const {item, itemCode, outfitDictionary, taggingDictionary} = this.state;
        // debugger;
        return (
            <div className='products'>
                <div className='row'>
                    <ItemLabel>{itemCode}</ItemLabel>
                    {/*<img className='vh-third' src={`${cloudinaryPath}/${dbClassMapping[itemsType]}/${itemCode}.png`} />*/}
                    <img className='vh-third' src={`${item && item.s3_url ? renderS3UrlFromPrefix(item.s3_url) : ''}`}/>
                </div>

                <div className='row'>
                    Pick an outfit to match
                </div>
                {outfitDictionary && Object.keys(outfitDictionary).length > 0 && (
                    <CardsWrapper>
                        {Object.keys(outfitDictionary).map((outfitKey, i) => (
                            <div className='outfit-img' key={outfitKey}>


                                    {this.renderOutfit(outfitDictionary[outfitKey])}

                            </div>
                        ))}
                    </CardsWrapper>
                )}
            </div>
        )
    }

    renderOutfit = (outfitInfo) => {
        const {outfitDictionary} = this.state;

        const outfitArray = outfitInfo;
        const allOutfits = outfitArray.map(item => {
            return this.renderSingleItem(item)

        });
        return allOutfits;
    }
    renderSingleItem = (item) => {
        return (

            <OutfitPart outfit_id={item.outfit_id} tagging={item.tagging}/>
        )
    }
}

export default withApollo(ItemView);
const options = ["top"
    , "bottom"
    , "shoes"
    , "jacket"
    , "onepiece"
    , "accessories"]
const outfitParts = [
    {
        oldcss:"bottom",
        name: 'bottom',
        classes: 'bottom-0 left-4 w3 w4-ns'
    }
    ,  {
        oldcss:"onepiece",
        name: 'onepiece',
        classes: 'bottom-0 left-4 w3 w4-ns'
    },
    {       oldcss:"accessories",
        name: 'accessories',
        classes: 'bottom-0 left-4 w3 w4-ns'
    },
    {
        oldcss:"shirt",
        name: 'top',
        classes: 'top-0 left-0 w3 w4-ns'
    },
    {
        oldcss:"jacket",

        name: 'jacket',
        classes: 'top-0 right-0 w3 w4-ns'
    },
    {
        oldcss:"shoe",

        name: 'shoes',
        classes: 'bottom-0 right-1-ns right-0 w2 w3-ns'
    }
]
let outfitPartsDictionary = {};
outfitParts.forEach((item, i) => {

    outfitPartsDictionary[item.name] = item;
})

const OutfitPart = (item,tagging) => {
    // debugger;

    let classes = '';
    let partName = '';
    let outfit_item = item.tagging;
    let {id} = outfit_item;
    let itemClass = outfit_item.class;
    let imgUrl = outfit_item && outfit_item.s3_url ? renderS3UrlFromPrefix(outfit_item.s3_url, 110) : ''


    return outfit_item && itemClass ? (
            <img
                className={outfitPartsDictionary[itemClass].oldcss}
                // src={`${cloudinaryPath}/${dbClass}/${outfit[dbClass]}.png`}
                src={imgUrl}
            />

    ) : <div/>
}