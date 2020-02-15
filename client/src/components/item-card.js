import React from 'react'
import { Link } from 'react-router-dom'
import { ItemLabel } from './item-label'

export const ItemCard = ({ href, imgUrl, label }) => (
  <Link
    className='link pa2 w-50 relative flex flex-column items-center'
    to={href}
  >
    <img className='w-70-ns w-100 vh-third obj-contain' src={imgUrl} />
    <ItemLabel>{label}</ItemLabel>
  </Link>
)