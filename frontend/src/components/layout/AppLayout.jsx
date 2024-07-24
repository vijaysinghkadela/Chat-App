import React from 'react'
import Hander from './Hander'

const AppLayout = () =>  WrappedComponent => {
  return (props) => (
    
    <div>
        <Hander/>
        <WrappedComponent {...props} />
        <div>Footer</div>
    </div>
  )
}

export default AppLayout