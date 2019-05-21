import React from 'react';
import { useState, useReducer, useEffect } from 'react'
import { useContext, createContext } from "react"
import logo from './logo.svg';
import './App.css';
import { Button } from 'react-bootstrap'


const SearchFieldContext = createContext()

export default function SearchField (props) {

	const children = props
	return (
		<SearchFieldContext.Provider>
		<div>{children}</div>
		</SearchFieldContext.Provider>
	)
}

export function SearchButton(props) {
	const { children, onClick } = props
	return (

		<Button
			onClick={onClick}
		>
		{children}
		</Button>
	)
}

export function SearchTextField(props) {
	const [placeholder] = props

}