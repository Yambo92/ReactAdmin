
import React from 'react'
import './index.scss'

export default function LinkButton(props) {

// return <button onClick={props.onClick} className="link-button">{props.children}</button>
return <button {...props} className="link-button"></button>

}