import React from 'react'

export const CardsWrapper = ({ children }) => (
  <div className='flex justify-center'>
    <div className='w-60-l w-100 flex relative flex-wrap'>
      {children}
    </div>

  </div>
)
