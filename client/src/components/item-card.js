import React from 'react'
import {Link} from 'react-router-dom'
import {ItemLabel} from './item-label'

export const ItemCard = ({href, imgUrl, label}) => (
    <Link
        // className='link pa2 w-50 relative flex flex-column items-center'
        className='prod-link'
        to={href}
    >
        {imgUrl !== '' ?
            <img

                className='product-image'
                // className='w-70-ns w-100 vh-third obj-contain'
                src={imgUrl}/> : <img  className={'product-image'} src={"https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled-1150x647.png"}></img>}
        {/*<ItemLabel>{label}</ItemLabel>*/}
        <ItemLabel>{label}</ItemLabel>
    </Link>
)
