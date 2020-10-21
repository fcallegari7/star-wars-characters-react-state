import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import CharacterList from './CharacterList';

import dummyData from './dummy-data';

import './styles.scss';

import endpoint from './endpoint';

const initialState = {
  result: null,
  loading: true,
  error: null,
};

const fetchReducer = (state, action) => {
  if (action.type === 'LOADING') {
    return {
      result: null,
      loading: true,
      error: null,
    };
  }
  if (action.type === 'RESPONSE_COMPLETE') {
    return {
      result: action.payload.response,
      loading: false,
      error: null,
    };
  }
  if (action.type === 'ERROR') {
    return {
      result: null,
      loading: false,
      error: action.payload.error,
    };
  }
  return state;
};

const useFetch = (url) => {
  // const [response, setResponse] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    // setLoading(true);
    // setResponse([]);
    // setError(null);

    dispatch({ type: 'LOADING' });
    //async await solutionm
    const fetchUrl = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        // setResponse(data);
        dispatch({ type: 'RESPONSE_COMPLETE', payload: { response: data } });
      } catch (error) {
        // setError(error);
        dispatch({ type: 'ERROR', payload: { error } });
      }
      // } finally {
      //   setLoading(false);
      // }
    };

    fetchUrl();
    // Promise chaining solution
    // fetch(endpoint + '/characters')
    //   .then((response) => response.json())
    //   .then((response) => {
    //     setLoading(false);
    //     setResponse(response.characters);
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     setError(error);
    //   });
  }, []);
  return [state.result, state.loading, state.error];
};

const Application = () => {
  const [response, loading, error] = useFetch(endpoint + '/characters');
  const characters = (response && response.characters) || [];
  return (
    <div className="Application">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <CharacterList characters={characters} />
          )}
          {error && <p className="error">{error.message}</p>}
        </section>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router>
    <Application />
  </Router>,
  rootElement,
);
