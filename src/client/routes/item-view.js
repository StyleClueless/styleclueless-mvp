import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dbClassMapping } from '../categories-config'
import { ItemLabel } from '../components/item-label'
import { envVars } from '../util/env-vars'
import { CardsWrapper } from '../components/cards-wrapper'

const outfitParts = [
  {
    name: 'bottoms',
    classes: 'bottom-0 left-1 w3 w4-ns'
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

export const ItemView = props => {
  // const outfitParts = JSON.parse(envVars().CATEGORIES_CONFIG)
  const { itemsType, itemCode } = props.match.params

  const [outfits, setOutfits] = useState(null)
  const fetchData = async () => {
    const res = await fetch(`/api/items/${itemCode}/outfits`)
    setOutfits(await res.json())
  }
  useEffect(() => {
    fetchData()
  }, [itemCode])

  return (
    <div>
      <div className='flex justify-center'>
        <img className='vh-third' src={`${envVars().CLOUDINARY_BASE_URL}/${dbClassMapping[itemsType]}/${itemCode}.png`} />
      </div>
      <ItemLabel>{itemCode}</ItemLabel>
      <div className='mv3 tc roboto f3 dark-gray'>
        Pick an outfit to match
      </div>
      {outfits && (
        <CardsWrapper>
          {outfits.map(outfit => (
            <div className='pa2 mb4 w-50 relative flex flex-column items-center' key={outfit._id}>
              <div className='w4 w5-ns h4 h5-ns relative'>
                {outfitParts.map(part => (
                  <OutfitPart key={part.name} outfit={outfit} partName={part.name} classes={part.classes} />
                ))}
              </div>
            </div>
          ))}
        </CardsWrapper>
      )}
    </div>
  )
}

const OutfitPart = ({ outfit, partName, classes }) => {
  const dbClass = dbClassMapping[partName]
  return outfit[dbClass] ? (
    <Link className={'link absolute ' + classes} to={`/${partName}/${outfit[dbClass]}`}>
      <img
        className='w-100'
        src={`${envVars().CLOUDINARY_BASE_URL}/${dbClass}/${outfit[dbClass]}.png`}
      />
    </Link>
  ) : <div />
}
