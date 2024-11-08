import { Typography } from '@material-tailwind/react'
import React from 'react'

export default function Intro({title,subtitle}) {
  return (
    <div className=' my-4 dark:text-white'>
      <Typography className=' text-[2rem]'>
        {title}
      </Typography>
      <p className='dark:text-customColor-light-100'>
        {subtitle}
      </p>
    </div>
  )
}
