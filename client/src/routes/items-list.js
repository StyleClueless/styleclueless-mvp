import React, { useState, useEffect } from 'react'
import { CardsWrapper } from '../components/cards-wrapper'
import { ItemCard } from '../components/item-card'
import { dbClassMapping } from '../categories-config'
import { envVars } from '../util/env-vars'
import {global_company_id, renderS3UrlFromPrefix} from "../utils";
import {GET_ALL_COMPANY_TAGGING_BY_TYPE, GET_TAGGING_IMPORT} from "../hasura_qls";


const cldTransformation = 'c_scale,h_350,q_auto:good'
export const ItemsList = props => {
  console.log('itemlist');
  console.log(props);

  const cloudinaryPath = envVars().CLOUDINARY_BASE_URL.replace('/upload', `/upload/${cldTransformation}`)
  const [items, setItems] = useState(null)
  const [loadedType, setLoadedType] = useState(null)
  const { itemsType } = props.match.params

  async function fetchData () {
    const fetchBody={company_id:global_company_id,type: "Bottom"};
      const {data:{tagging}} = await props.client.query({
          query: GET_ALL_COMPANY_TAGGING_BY_TYPE,
          variables: fetchBody,
          fetchPolicy: 'network-only',
      });
      console.log(tagging);
      setItems(tagging)
      setLoadedType(itemsType)
    // const res = await fetch(`/api/items?class=${dbClassMapping[itemsType]}`)
    // setItems(await res.json())
    // setLoadedType(itemsType)
  }
  useEffect(() => {
    setLoadedType(null)
    fetchData()
  }, [itemsType])

  return (
    <CardsWrapper>
      {
        loadedType === itemsType && items.map(item => (
          <ItemCard
            key={item.tagging_import.id}
            label={item.sku}
            href={`/${itemsType}/${item.tagging_import.id}`}
            // imgUrl={`${cloudinaryPath}/${dbClassMapping[itemsType]}/${item.code}.png`}
            imgUrl={renderS3UrlFromPrefix(item.tagging_import.s3_url)}
          />
        ))
      }
    </CardsWrapper>
  )
}
