import React from 'react';
// import { Route } from 'react-router';
import { ApolloConsumer } from 'react-apollo';
import { ApolloProvider } from 'react-apollo';
import { apollo_client } from './apolloClient';
import { Home } from './routes/home.js'
import {
    Switch,
    Route,
    Link, BrowserRouter
} from 'react-router-dom'
import { categories } from './categories-config'
import { ItemsList } from './routes/items-list'
import { ItemView } from './routes/item-view'
import { withApollo } from 'react-apollo';
import TestHasura from "./TestHasura";

// import Article from '../containers/Article';

export const App = () => {
  let scrollEl
  let lastRouteName
  const scrollToTop = () => {
    if (scrollEl) scrollEl.scrollTop = 0
    if (typeof window !== 'undefined') window.scrollTop = 0
  }
  return (
      <ApolloProvider client={apollo_client}>

    <div className='pv2 h-100 flex flex-column'>
   <TestHasura/>
        <div className='flex justify-center baskerville'>
        <div className='dib relative bt bb b--dark-gray w-100 w-60-l'>
          {['Home'].concat(categories).map(catName => (
            <Route key={catName} path='/:routeName' children={({ match }) => {
              const isMatching = !match && catName === 'Home' || (match && catName.toLowerCase() === match.params.routeName)
              if (match && match.params.routeName !== lastRouteName) {
                lastRouteName = match.params.routerName
                scrollToTop()
              }
              return (
                <div className={'dib tc pv1 w-20 relative' + (isMatching ? ' bg-dark-gray' : '')}>
                  <Link
                    className={'link dib pv2 w-100 f6 f5-ns ' + (isMatching ? 'white' : 'dark-gray')}
                    to={catName === 'Home' ? '/' : `/${catName.toLowerCase()}`}
                  >
                    {catName}
                  </Link>
                </div>
              )
            }} />
          ))}
        </div>
      </div>
      <div className='flex-auto overflow-auto pv2' ref={el => { scrollEl = el }}>
        <Switch>
          <Route path="/:itemsType/:itemCode" component={ItemView} exact />
          <Route path="/:itemsType" component={ItemsList} exact />
          <Route path="/" component={Home} exact />
        </Switch>
      </div>
      {/*<ItemsList />*/}
      <div className='flex justify-center'>
        <div className='roboto tc dark-gray pv2 bw1 bt bb b--dark-gray w-100 w-60-l'>
          StyleClueless™
        </div>
      </div>


    </div>
      </ApolloProvider>


      )
}
