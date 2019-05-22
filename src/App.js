import React from 'react';
import { useState, useReducer, useEffect } from 'react'
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
    //movies: [{"Title":"Beta Test","Year":"2016","imdbID":"tt4244162","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BODdlMjU0MDYtMWQ1NC00YjFjLTgxMDQtNDYxNTg2ZjJjZDFiXkEyXkFqcGdeQXVyMTU2NTcxNDg@._V1_SX300.jpg"},{"Title":"Johnny Test","Year":"2005–2014","imdbID":"tt0454349","Type":"series","Poster":"https://m.media-amazon.com/images/M/MV5BYzc3OGZjYWQtZGFkMy00YTNlLWE5NDYtMTRkNTNjODc2MjllXkEyXkFqcGdeQXVyNjExODE1MDc@._V1_SX300.jpg"},{"Title":"Test Pilot","Year":"1938","imdbID":"tt0030848","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BZjVjZmQyNzAtNTBiOC00MjNkLTk1NjktNGI1YmFmYjA0ODNmXkEyXkFqcGdeQXVyMDI2NDg0NQ@@._V1_SX300.jpg"},{"Title":"Test","Year":"2013","imdbID":"tt2407380","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMTQwMDU5NDkxNF5BMl5BanBnXkFtZTcwMjk5OTk4OQ@@._V1_SX300.jpg"},{"Title":"The Test","Year":"2012","imdbID":"tt1986180","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMTYwNTgzMjM5M15BMl5BanBnXkFtZTcwNDUzMTE1OA@@._V1_SX300.jpg"},{"Title":"Baka and Test: Summon the Beasts","Year":"2010–","imdbID":"tt1655610","Type":"series","Poster":"https://m.media-amazon.com/images/M/MV5BNThiMWI0ODktMzY5NC00YzE5LWIzMjUtYTUzYWNiYWUyZmE2XkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_SX300.jpg"},{"Title":"The Test","Year":"2013","imdbID":"tt2616114","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BMjMzMDQwMzM2M15BMl5BanBnXkFtZTcwMzA1OTg1OQ@@._V1_SX300.jpg"},{"Title":"Rabbit Test","Year":"1978","imdbID":"tt0078133","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BYmMyYzYxNmYtMGU4OC00MDFlLWJiYmQtZTJmNTMwZjg1ZTkwXkEyXkFqcGdeQXVyMTY5MDE5NA@@._V1_SX300.jpg"},{"Title":"This Is Not a Test","Year":"1962","imdbID":"tt0183884","Type":"movie","Poster":"https://m.media-amazon.com/images/M/MV5BOTU5MDkwNDAzOV5BMl5BanBnXkFtZTgwNjE4NDgwMzE@._V1._CR76,175,222,296_SY132_CR5,0,89,132_AL_.jpg_V1_SX300.jpg"}
    //],
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
                {/*<BigActorList>{movies[j]["Actors"]}</BigActorList>
                <SmallActorList>Joe Bones Tella Harry</SmallActorList>*/}
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
      <header className="App-header d-block pt-2">
      <div class="mt-9 mx-auto" style={
        {width : "400px"
        }}>
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
        </div>

        <div
        class="mx-auto" style={{
          top: "70px"
        }}
        >
        <Container className="mt-2">
        <Row>
        <Col xs={5}>
        {numMovies && limit ? 
        <Button className="d-block float-right"
          onClick={() => {
            let newLimit = limit - 3
            if (newLimit < 0) newLimit = 0
            setLimit(newLimit)
          }}>View Less
        </Button> : <div/>}
        </Col>
        {numMovies ?
        <Col xs={1}>
          {"  " + limit + "  "}
        </Col>
        :<div/>}
        <Col xs={5}>
        {numMovies > limit ?
        <Button 
          className="d-block float-left"
          onClick={() => {
            setLimit(limit + 3)
          }}>View More
        </Button> : <div/>}
        </Col>
        </Row>
        </Container>
        </div>

        <div class="mt-3">
        <Container>
          {createTable(state.movies)}
        </Container>
        </div>
      </header>      

    </div>
  );
}

