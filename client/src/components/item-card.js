import React from 'react'
import {Link} from 'react-router-dom'
import {ItemLabel} from './item-label'

export const ItemCard = ({href, imgUrl, label}) => (
    <Link
        className='link pa2 w-50 relative flex flex-column items-center'
        to={href}
    >
        {imgUrl !== '' ?
            <img className='w-70-ns w-100 vh-third obj-contain' src={imgUrl}/> : <img src={"https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled-1150x647.png"}></img>}
        <ItemLabel>{label}</ItemLabel>
    </Link>
)
