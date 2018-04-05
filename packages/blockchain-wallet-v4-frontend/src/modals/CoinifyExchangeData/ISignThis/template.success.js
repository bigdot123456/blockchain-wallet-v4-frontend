import React from 'react'

const ISX = (props) => {
  const { iSignThisDomain, iSignThisId } = props
  const srcUrl = `${iSignThisDomain}/landing/${iSignThisId}`
  console.log('render ISX', props, srcUrl)
  return (
    <div>
      <h3>iSignThis step</h3>
      <iframe style={{width: '80%', height: '400px'}}
        src={srcUrl}
        sandbox='allow-same-origin allow-scripts allow-forms'
        scrolling='yes'
        id='isx-iframe'
      />
    </div>
  )
}

export default ISX
