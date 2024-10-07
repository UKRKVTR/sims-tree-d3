import React from 'react'

const CustomNode = ({ nodeDatum, onClick }) => (
  <g onClick={onClick} style={{ cursor: 'pointer' }}>
    <circle r={15} fill='#fff' stroke='#000' strokeWidth='2' />

    {nodeDatum.attributes && nodeDatum.attributes.img && (
      <image
        href={nodeDatum.attributes.img}
        x='-20'
        y='-35'
        height='40'
        width='40'
      />
    )}

    <text fill='#333' x='20' y='-10'>
      {nodeDatum.name}
    </text>

    {nodeDatum.attributes && nodeDatum.attributes.age && (
      <text fill='#777' x='20' y='10'>
        Возраст: {nodeDatum.attributes.age}
      </text>
    )}
  </g>
)

export default CustomNode
