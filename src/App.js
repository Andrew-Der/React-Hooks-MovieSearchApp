import React from 'react';
import { useState, useReducer, useEffect } from 'react'
import logo from './logo.svg';
import './App.css';
import { Button } from 'react-bootstrap'
import { SearchButton } from './SearchField'
import axios from 'axios'
import logger from 'use-reducer-logger'
import { Container, Row, Col } from 'react-bootstrap'

import Movie, { Poster, BigActorList, SmallActorList } from './components/Movie'
import { Form } from 'react-bootstrap'

const apiKey = "8469727d"
const apiQueryParam = `apikey=${apiKey}`
const url = "http://www.omdbapi.com"

export class Apps extends React.Component {

  constructor(props) {
    super(props)
    this.name = "Andrew"
    this.temp = "Billy"
  }

  varA  () {
    console.log("This is a function")
  }

  render() {
    //const temp = this.name
    return (
      <h1>Variable : {this.temp}
        <Button
          onClick={() => {
            this.varA()
          }} 
        >Push message</Button>
      </h1>
    )
  }
}


export default function App() {

  const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_MOVIES' :
        return {
          ...state,
          loading: true,
          error: null
        }
      case 'FETCH_MOVIES_FULFILLED':
        return {...state, 
          loading: false,
          error: null,
          movies: action.payload}
      case 'FETCH_MOVIES_REJECTED':
        return {...state, 
          movies: [],
          loading: false,
          error: action.payload,
        }
      case 'SET_QUERY':
        return {...state,
          query: action.payload
        }
      default:
        console.log("Unknown state")
        throw new Error()
    }
  }
  const moviesPerRow = 3
  const [limit, setLimit] = useState(3)
  const [state, dispatch] = useReducer(logger(reducer), 
  {
    movies: [], 
    loading: false, 
    error: null,
    query: ""
  })

  //query for movie titles
  useEffect(() => {
    // get list of titles
  }, [state.query])

  const fetchMovies = async () => {
    dispatch({type: "FETCH_MOVIES"})

    //wait for query
    await axios.get(`${url}/?s=${state.query}&${apiQueryParam}`)
    .then( response => {

      console.log("hi")
      if (response.data.Response === "True") {
        dispatch({
          type: "FETCH_MOVIES_FULFILLED",
          payload: response.data.Search
        })
      }
      else
        throw new Error("Unable to fetch movies")

    }).catch( error => {
      dispatch({
        type: "FETCH_MOVIES_REJECTED",
        payload : error.message
      })
    })
  }

  const createTable = (movies) => {
    const movieList = []
    for (var i = 0; i < movies.length && i < limit; i++) {
      if (!(i % moviesPerRow)) {
        const children = []
        for (var j = i; j < i + moviesPerRow && j < movies.length && j < limit; j++) {
          children.push(
            <Col key={movies[j]["imdbID"]} xs={6} md={4} >{movies[j]["Title"]}
              <Movie 
                onClick={() => {console.log("Hey Im a movie")}}>
                <Poster posterUrl={movies[j]["Poster"]}/>
                <BigActorList>Robert Downey Gweneth Paltro</BigActorList>
                <SmallActorList>Joe Bones Tella Harry</SmallActorList>
              </Movie>
            </Col>)
        }
        movieList.push(
          <Row key={i}>
            {children}
          </Row> )
      }
    }
    return movieList
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchMovies()
  } 

  const numMovies = state.movies.length
  return (
    <div className="App">
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossorigin="anonymous"
      />    
      <header className="App-header">
        {numMovies > limit ?
        <Button 
          onClick={() => {
            setLimit(limit + 3)
          }}>View More
        </Button> : <div/>}

        {numMovies && limit ? 
        <Button 
          onClick={() => {
            let newLimit = limit - 3
            if (newLimit < 0) newLimit = 0
            setLimit(newLimit)
          }}>View Less
        </Button> : <div/>}


        <Form
          onSubmit={e => handleSubmit(e)}>
          <Form.Row>
            <Col xs={10}>
            <Form.Control 
              size="lg"
              onChange={e => dispatch({type: 'SET_QUERY', payload: e.target.value})}
            />
            </Col>
            <Col xs={2}>
              <SearchButton onClick={fetchMovies}>
                search
              </SearchButton>
            </Col>
          </Form.Row>
          {state.error &&
          <h2>{state.error}</h2>}
        </Form>


        
        <Container>
          {createTable(state.movies)}
        </Container>
      </header>
    </div>
  );
}

