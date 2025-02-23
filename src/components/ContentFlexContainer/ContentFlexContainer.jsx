import React from 'react'
import "./index.css"
function ContentFlexContainer({children}) {
  return (
    <div className='flex_container'>
        {children}
    </div>
  )
}

export default ContentFlexContainer