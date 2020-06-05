import React from 'react';
import {ApolloProvider} from 'react-apollo';
import {apollo_client} from './apolloClient';
import Home from './routes/home.js'
import {
    Switch,
    Route,
    Link, BrowserRouter
} from 'react-router-dom'
import {categories} from './categories-config'
import ItemsList from './routes/items-list'
import ItemView from './routes/item-view'
import onBoardClient from "./onBoardClient";
import Tagging from "./Tagging";
import onBoardingDashboard from "./onBoardingDashboard";
import {SnackbarProvider, withSnackbar} from 'notistack';
import onBoardTagging from "./onBoardTagging";
import Login from "./routes/login";
import {renderS3UrlFromPrefix} from "./utils";
import onBoardOutfits from "./onBoardOutfits";
import './older.css'
import useEventListener from '@use-it/event-listener'

const ESCAPE_KEYS = ['27', 'Escape'];
const ENTER_KEYS = ['13', 'Enter'];


export const App = () => {
    let scrollEl
    let lastRouteName
    // localStorage.setItem('url_type','jpg');/// set default type of url
    const scrollToTop = () => {
        console.log('scroolontop')
        if (scrollEl) scrollEl.scrollTop = 0
        if (typeof window !== 'undefined') window.scrollTop = 0
    }
    function handler({ key }) {
        if (ESCAPE_KEYS.includes(String(key))) {
            console.log('Escape key pressed - setting PNG URL - REFRESH TO APPLY!');
            localStorage.setItem('url_type','png');/// set default type of url to png now!

        }
        if (ENTER_KEYS.includes(String(key))) {
            console.log('ENTER key pressed - setting JPG URL - REFRESH TO APPLY!');
            localStorage.setItem('url_type','jpg');/// set default type of url to png now!
        }
    }
        useEventListener('keydown', handler);

    const logoUrl = () => {
        // debugger;
        let logo_url = localStorage.getItem('styleClueLessCompany') ?
            renderS3UrlFromPrefix(JSON.parse(localStorage.getItem("styleClueLessCompany")).logo_url,70) : '';
        return logo_url;
    }
    return (
        <SnackbarProvider maxSnack={3}>

            <ApolloProvider client={apollo_client}>
                {/*<Switch>*/}


                <div className='flex justify-center pt2 mh3'>
                    <img className='mw6-ns mw-100' src={logoUrl()}/>
                </div>
                {/*</Switch>*/}
                <div style={{display: 'block'}} className='pv2 h-100 flex flex-column'>
                    <div className='flex justify-center baskerville'>
                        <div className='dib relative bt bb b--dark-gray w-100 w-60-l'>
                            {['Home'].concat(categories).map(catName => (
                                <Route key={catName} path='/:routeName' children={({match}) => {
                                    const isMatching = !match && catName === 'Home' || (match && catName.toLowerCase() === match.params.routeName)
                                    if (match && match.params.routeName !== lastRouteName) {
                                        lastRouteName = match.params.routerName
                                        scrollToTop()
                                    }
                                    return (
                                        <div
                                            className={'dib tc pv1 w-20 relative' + (isMatching ? ' bg-dark-gray' : '')}>
                                            <Link
                                                className={'link dib pv2 w-100 f6 f5-ns ' + (isMatching ? 'white' : 'dark-gray')}
                                                to={catName === 'Home' ? '/' : `/store/${catName.toLowerCase()}`}
                                            >
                                                {catName.charAt(0).toUpperCase() + catName.slice(1)}
                                            </Link>
                                        </div>
                                    )
                                }}/>
                            ))}
                        </div>
                    </div>
                    <div className='container' ref={el => {
                        scrollEl = el
                    }}>
                        <Switch>

                            <Route exact path="/StartOnBoarding/" component={onBoardingDashboard} exact/>
                            <Route exact path="/onBoardingCompany/:company_id/:company_name"
                                   component={onBoardClient} exact/>
                            <Route exact path="/onBoardingOutfits/:company_id/:company_name"
                                   component={onBoardOutfits} exact/>
                            <Route exact path="/onBoardingTagging/:company_id/:company_name"
                                   component={onBoardTagging} exact/>

                            <Route exact path="/OnBoarding/Tagging/:tagging_id/:tagging_sku/:tagging_info" component={Tagging}
                                   exact/>
                            {/*<Route path="/store/:itemsType/:itemCode" exact render={(props) => (<ItemView client={apollo_client} {...props}/>)} />*/}
                            {/*<Route path="/store/:itemsType" exact render={(props) => (<ItemsList client={apollo_client} {...props}/>)}/>*/}
                            {/*<Route path="/" exact  render={(props) => (<Home test="hi" client={apollo_client}{...props}/>)} /> */}
                            <Route path="/store/:itemsType/:itemCode" exact
                                   render={(props) => (<ItemView test="hi" client={apollo_client} {...props}/>)}/>
                            <Route path="/store/:itemsType" exact
                                   render={(props) => (<ItemsList test="hi" client={apollo_client} {...props}/>)}/>
                            <Route path="/" exact
                                   render={(props) => (<Home test="hi" client={apollo_client}{...props}/>)}/>
                            <Route path="/Login" exact render={(props) => (
                                <Login test="login page" client={apollo_client}{...props}/>)}/>

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
        </SnackbarProvider>

    )
}
