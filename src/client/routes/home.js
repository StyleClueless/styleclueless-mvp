import React from 'react'
import { categories, coverImages } from '../categories-config'
import { ItemCard } from '../components/item-card'
import { CardsWrapper } from '../components/cards-wrapper'

export const Home = () => (
  <CardsWrapper>
    {categories.map(cat => (
      <ItemCard
        key={cat}
        href={`/${cat.toLowerCase()}`}
        imgUrl={coverImages[cat]}
        label={cat}
      />
    ))}
  </CardsWrapper>
)
