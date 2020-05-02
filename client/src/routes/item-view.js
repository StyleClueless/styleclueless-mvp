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
import {global_company_id, renderS3UrlFromPrefix, splitToArrayOfSize2} from "../utils";
import {ItemCard} from "../components/item-card";
import {withApollo} from "react-apollo";
import {Button, Column} from "bloomer";

class ItemView extends Component {

    state = {loading: true, outfitDictionary: {}, taggingDictionary: {}};

    async componentWillMount() {
        const {client} = this.props;
        const itemCode = this.props.match.params.itemCode;
        console.log(' rendering ITEMVIEW for' + itemCode);

        try {
            const {taggingDictionary, outfitDictionary, tagging_by_pk} = await this.getOutfits(client, itemCode);
            this.setState({outfitDictionary, itemCode, taggingDictionary, item: tagging_by_pk, loading: false});
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
        const {loading, item, itemCode, outfitDictionary, taggingDictionary} = this.state;
        const outfitDictionaryKeys = Object.keys(outfitDictionary);
        // debugger;
        return (
            <div className='products'>
                <div>
                    <div className='flex justify-center'>
                        {/*<img className='vh-third' src={`${cloudinaryPath}/${dbClassMapping[itemsType]}/${itemCode}.png`} />*/}
                        <img className='vh-third'
                             src={`${item && item.png_s3_url ? renderS3UrlFromPrefix(item.png_s3_url) : ''}`}/>
                    </div>


                    {/*<ItemLabel>{itemCode} : {outfitDictionaryKeys.length}</ItemLabel>*/}
                    {loading ?
                        <div style={{textAlign: 'center'}}>
                            <Button isColor='warning' isLoading>isLoading={true}</Button>
                        </div>
                        :
                        <div>
                            <ItemLabel>{outfitDictionaryKeys.length} : Outfits</ItemLabel>
                            <div className='mv3 tc roboto f3 dark-gray'>
                                Pick an outfit to match
                            </div>
                        </div>
                    }
                    {outfitDictionary && outfitDictionaryKeys.length > 0 && (
                        <CardsWrapper>
                            {splitToArrayOfSize2(Object.values(outfitDictionary)).map((outfits_array_of_two, i) => (
                                    <div className='row'>


                                    {this.renderOutfitOfTwo(outfits_array_of_two)}

                                </div>
                            ))}
                        </CardsWrapper>
                    )}
                </div>
            </div>
        )
    }

    renderOutfitOfTwo = (outfits_arrays_of_two) => {
        return outfits_arrays_of_two.map(outfit_from_the_array => {

            return (<div className='column'>
                    <div className='outfit-img'>
                    {this.renderOutfit(outfit_from_the_array)}
                    </div>
                </div>
            )
        });
    }
    renderOutfit = (outfitInfo) => {
        return outfitInfo.map(item => {
            return (
                this.renderSingleItem(item)
            )
        });
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
        name: 'bottom',
        classes: 'bottom-1 left-4 w3 w4-ns'
    }
    , {
        name: 'onepiece',
        classes: 'bottom-4 left-2 w3 w4-ns putUp'
    },
    {
        name: 'accessories',
        classes: 'bottom-4 left-4 w3 w4-ns putUp'
    },
    {
        name: 'top',
        classes: 'top-0 left-0 w3 w4-ns'
    },
    {
        name: 'jacket',
        classes: 'top-0 right-0 w3 w4-ns'
    },
    {
        name: 'shoes',
        classes: 'bottom-0 right-4-ns right-0 w2 w3-ns'
    }
]
let outfitPartsDictionary = {};
outfitParts.forEach((item, i) => {

    outfitPartsDictionary[item.name] = item;
})

const OutfitPart = (item, tagging) => {
    // debugger;

    let classes = '';
    let partName = '';
    let outfit_item = item.tagging;
    let {id} = outfit_item;
    let itemClass = outfit_item.class;
    let imgUrl = outfit_item && outfit_item.png_s3_url ? renderS3UrlFromPrefix(outfit_item.png_s3_url, 400) : ''

    const cloudinaryPath = envVars().CLOUDINARY_BASE_URL.replace('/upload', '/upload/c_scale,h_110,q_auto:good/c_scale,h_380,q_auto:good')
    const dbClass = dbClassMapping[partName]
    return outfit_item && itemClass ? (
        <Link className={'link'} to={`/store/${itemClass}/${id}`}>
            <img
                className={itemClass}
                // src={`${cloudinaryPath}/${dbClass}/${outfit[dbClass]}.png`}
                src={imgUrl}
            />
        </Link>
    ) : <div/>
}
