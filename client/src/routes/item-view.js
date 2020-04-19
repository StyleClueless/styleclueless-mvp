import React, {useState, useEffect, Component} from 'react'
import { Link } from 'react-router-dom'
import { dbClassMapping } from '../categories-config'
import { ItemLabel } from '../components/item-label'
import { envVars } from '../util/env-vars'
import { CardsWrapper } from '../components/cards-wrapper'
import {ALL_OUTFITS_BY_TAGGING_ID, GET_TAGGING_BY_CLASS} from "../hasura_qls";
import {global_company_id, renderS3UrlFromPrefix} from "../utils";
import {ItemCard} from "../components/item-card";
import {withApollo} from "react-apollo";
class ItemView extends Component {

    state = {outfits: []};

    async componentWillMount() {
        const {client} = this.props;
        const itemCode = this.props.match.params.itemCode;
        console.log(' rendering ITEMVIEW for' + itemCode);

        try {
            const {outfits,tagging} =await this.getOutfits(client, itemCode);
            let all_ids=[];
            this.setState({outfits: outfits,item:tagging[0]});
        }
        catch (e) {
            console.error(e);
        }

    }

    getOutfits = async (client, itemCode) => {
        const {data} = await client.query({
            query: ALL_OUTFITS_BY_TAGGING_ID,
            variables: {tagging_id: itemCode},
            fetchPolicy: 'network-only',
        });
        console.log(data);
        const {outfits,tagging} = data;
        return {outfits,tagging};
    }

    async  componentDidUpdate(prevProps, prevState, snapshot) {

        // console.log("componentDidUpdate " +JSON.stringify(prevProps));
    }

    componentWillUnmount() {

    }

    render() {
        const {outfits, item,itemCode} = this.state;
        return (
        <div>
            <div className='flex justify-center'>
                {/*<img className='vh-third' src={`${cloudinaryPath}/${dbClassMapping[itemsType]}/${itemCode}.png`} />*/}
                <img className='vh-third' src={`${item&&item.s3_url?renderS3UrlFromPrefix(item.s3_url):''}`} />
            </div>
            <ItemLabel>{itemCode}</ItemLabel>
            <div className='mv3 tc roboto f3 dark-gray'>
                Pick an outfit to match
            </div>
            {outfits && (
            <CardsWrapper>
            {outfits.map(outfit => (
            <div className='pa2 mb4 w-50 relative flex flex-column items-center' key={outfit}>
                {outfit.id}
            <div className='w4 w5-ns h4 h5-ns relative'>
            {/*{outfit.outfit&&outfit.outfit.map(part => (*/}
            {/*<OutfitPart key={part} outfit={outfit} partName={part} classes={part} />*/}
            {/*))}*/}
            </div>
            </div>
            ))}
            </CardsWrapper>
            )}
        </div>
    )
    }
}

export default withApollo(ItemView);
const outfitParts = [
  {
    name: 'bottoms',
    classes: 'bottom-0 left-4 w3 w4-ns'
  },
  {
    name: 'shirts',
    classes: 'top-0 left-0 w3 w4-ns'
  },
  {
    name: 'jackets',
    classes: 'top-0 right-0 w3 w4-ns'
  },
  {
    name: 'shoes',
    classes: 'bottom-0 right-1-ns right-0 w2 w3-ns'
  }
]


const OutfitPart = ({ outfit, partName, classes }) => {
  const cloudinaryPath = envVars().CLOUDINARY_BASE_URL.replace('/upload', '/upload/c_scale,h_110,q_auto:good/c_scale,h_380,q_auto:good')
  const dbClass = dbClassMapping[partName]
  return outfit[dbClass] ? (
    <Link className={'link absolute ' + classes} to={`/${partName}/${outfit[dbClass]}`}>
      <img
        className='w-70'
        // src={`${cloudinaryPath}/${dbClass}/${outfit[dbClass]}.png`}
      />
    </Link>
  ) : <div />
}
