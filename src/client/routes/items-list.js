import React, { useState, useEffect } from 'react'
import { CardsWrapper } from '../components/cards-wrapper'
import { ItemCard } from '../components/item-card'
import { dbClassMapping } from '../categories-config'
import { envVars } from '../util/env-vars'

const cldTransformation = 'c_scale,h_350,q_auto:good'
export const ItemsList = props => {
  const cloudinaryPath = envVars().CLOUDINARY_BASE_URL.replace('/upload', `/upload/${cldTransformation}`)
  const [items, setItems] = useState(null)
  const [loadedType, setLoadedType] = useState(null)
  const { itemsType } = props.match.params

  async function fetchData () {
    const res = await fetch(`/api/items?class=${dbClassMapping[itemsType]}`)
    setItems(await res.json())
    setLoadedType(itemsType)
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
            key={item._id}
            label={item.code}
            href={`/${itemsType}/${item.code}`}
            imgUrl={`${cloudinaryPath}/${dbClassMapping[itemsType]}/${item.code}.png`}
          />
        ))
      }
    </CardsWrapper>
  )
}
