import React, { useState, useEffect } from 'react'
import { CardsWrapper } from '../components/cards-wrapper'
import { ItemCard } from '../components/item-card'
import { dbClassMapping } from '../categories-config'
import { envVars } from '../util/env-vars'

export const ItemsList = props => {
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
            imgUrl={`${envVars().CLOUDINARY_BASE_URL}/${dbClassMapping[itemsType]}/${item.code}.png`}
          />
        ))
      }
    </CardsWrapper>
  )
}
