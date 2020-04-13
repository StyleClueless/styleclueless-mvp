import ImagePalette from 'react-image-palette'
import React, {Component} from 'react';

export const renderPalette=(image)=> {
    return(
    <ImagePalette crossOrigin={true} image={image}>
        {({backgroundColor, color, alternativeColor}) => (
            <div style={{backgroundColor, color}}>
                backgroundColor
                {backgroundColor}
                color
                {color}
                This div has been themed based on
                <span style={{color: alternativeColor}}>{image}</span>
            </div>
        )}
    </ImagePalette>
    )
}
