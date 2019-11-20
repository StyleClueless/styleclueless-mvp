import React from 'react'
import { categories, dbClassMapping } from '../categories-config'
import { ItemCard } from '../components/item-card'
import { CardsWrapper } from '../components/cards-wrapper'
import { envVars } from '../util/env-vars'

// const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

export const Home = () => {
  // const { coverImages, categories } = JSON.parse(envVars().CATEGORIES_CONFIG).reduce((all, cat) => {
  //   all.categories.push(capitalize(cat.name))
  //   all.coverImages[cat.name] = cat.coverImage
  //   return all
  // }, { coverImages: {}, categories: [] })

  return (
    <CardsWrapper>
      {categories.map(cat => (
        <ItemCard
          key={cat}
          href={`/${cat.toLowerCase()}`}
          imgUrl={`${envVars().CLOUDINARY_BASE_URL}/${dbClassMapping[cat.toLowerCase()]}/cover.png`}
          label={cat}
        />
      ))}
    </CardsWrapper>
  )
}
