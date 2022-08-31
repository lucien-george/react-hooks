// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react';
import {ErrorBoundary} from 'react-error-boundary';

import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView
} from '../pokemon';

// because of the react-error-boundary package, we can use the ErrorBoundary component
// and don't have to write our own ErrorBoundary component.
// class ErrorBoundary extends React.Component {
//   state = { error: null }
//   static getDerivedStateFromError(error) {
//     return { error }
//   }

//   render() {
//     const {error} = this.state;
//     if (error) {
//       return <this.props.FallbackComponent error={error} />;
//     }

//     return this.props.children;
//   }
// }

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    pokemon: null,
    error: null,
    status: pokemonName ? 'pending' : 'idle'
  })

  React.useEffect(() => {
    if (!pokemonName) return;

    setState({ status: 'pending' })
    fetchPokemon(pokemonName).then(
      (pokemon) => {
        setState({
          status: 'resolved',
          pokemon
        });
      },
      (error) => {
        setState({
          status: 'rejected',
          error
        })
      }
    )
  }, [pokemonName]);

  const {status, error, pokemon} = state;

  switch (status) {
    case 'idle':
      return "Submit a pokemon";
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />;
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />;
    case 'rejected':
      throw error;
    default:
      throw new Error("This should be impossible");
  }
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('');
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {/* reset ErrorBoundary with key prop that takes a unique value */}
        {/* <ErrorBoundary key={pokemonName} FallbackComponent={ErrorFallback}> */}
        {/* resetKeys is an array of values that will reset the ErrorBoundary when their value change */}
        {/* onReset is a function called when the ErrorBoundary component resets */}
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
