import React from 'react';
import { useContext, createContext } from "react"
import { Image } from 'react-bootstrap'

export const MovieContext = createContext()

//function moveis that renders children
export default function Movie (props) {

  const {children, onClick, sizeX, sizeY } = props

  return (
    //PROVIDE EVERYTHtING TO CHILDREN via PROVIDER
    <MovieContext.Provider value={{ 
      onClick: onClick,
      sizeX: sizeX,
      sizeY: sizeY
      }}>
      <div>{children}</div>
    </MovieContext.Provider>
  )
}

//function poster
export function Poster (props) {

	const { posterUrl } = props
  	const { onClick } = useContext(MovieContext)

	return (
		<div onClick={onClick}>
			<Image src={posterUrl} fluid/>
		</div>
	)
}

//function Actors
export function BigActorList (props) {
	//const { actors } = props 
	const { children } = props
	const { onClick } = useContext(MovieContext)
	return (
		<h4>{children}</h4>
	)
}

export function SmallActorList (props) {
	const { children } = props 
	const { onClick } = useContext(MovieContext)
	return (
		<p 
		onClick={onClick}>
		{children}</p>
	)
}
//function Year

