import React from 'react';
import '@vime/core/themes/default.css'
import dynamic from 'next/dynamic'

const Player = dynamic(() => import('../Player'), {
  ssr: false,
})

export default function VideoHome(){
  return (
    <section className='bg-white mt-16 relative min-h-[500px]'>
        <div className='absolute -top-32 left-0 right-0'>
          <div className='h-full w-full max-w-[1100px] max-h-[60vh] aspect-video mx-auto'>
            <Player/>
            
          </div>
        </div>
    </section>
  )
}