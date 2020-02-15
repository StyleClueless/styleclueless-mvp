import React from 'react';
import { envVars } from '../util/env-vars'

const Container = (props) => {

  return (
    <html lang="en" className='h-100'>
    <head>
      <title>StyleClueless</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, height=device-height, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0" />
      <link rel="stylesheet" href="https://unpkg.com/tachyons@4/css/tachyons.min.css" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Libre+Baskerville&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto&display=swap" />
      <link rel="stylesheet" href="/client/public/main.css" />
      <script src='/dist/index.js' />
    </head>
    <body className='h-100 flex flex-column'>
      <div className='flex justify-center pt2 mh3'>
        <img className='mw6-ns mw-100' src={`${envVars().CLOUDINARY_BASE_URL}/brand-logo.png`} />
      </div>
      <div id="app" className='flex-auto'>
        {props.children}
      </div>
    </body>
    </html>
  )
}

export default Container
