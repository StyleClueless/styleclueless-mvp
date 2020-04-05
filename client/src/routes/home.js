import React from 'react'
import { categories, dbClassMapping } from '../categories-config'
import { ItemCard } from '../components/item-card'
import { CardsWrapper } from '../components/cards-wrapper'
import { envVars } from '../util/env-vars'

const cldTransformation = 'c_scale,h_350,q_auto:good'
export const Home = () => {
  const cloudinaryPath = envVars().CLOUDINARY_BASE_URL.replace('/upload', `/upload/${cldTransformation}`)
  return (

    <CardsWrapper>
      {categories.map(cat => (
        <ItemCard
          key={cat}
          href={`/${cat.toLowerCase()}`}
          imgUrl={`${cloudinaryPath}/${dbClassMapping[cat.toLowerCase()]}/cover.png`}
          label={cat}
        />
      ))}
    </CardsWrapper>
  )
}
