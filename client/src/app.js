import React from 'react';
import {ApolloProvider} from 'react-apollo';
import {apollo_client} from './apolloClient';
import {Home} from './routes/home.js'
import {
    Switch,
    Route,
    Link, BrowserRouter
} from 'react-router-dom'
import {categories} from './categories-config'
import {ItemsList} from './routes/items-list'
import {ItemView} from './routes/item-view'
import onBoardClient from "./onBoardClient";
import Tagging from "./Tagging";
import {AppClients} from "./AppClients";
import onBoardingDashboard from "./onBoardingDashboard";
export const App = () => {
    let scrollEl
    let lastRouteName
    const scrollToTop = () => {
        if (scrollEl) scrollEl.scrollTop = 0
        if (typeof window !== 'undefined') window.scrollTop = 0
    }

    return (
        <ApolloProvider client={apollo_client}>
            <Switch>
                <Route path="/" component={AppClients} exact/>

                <Route path="/onBoarding/" component={onBoardingDashboard} exact/>
                <Route path="/onBoardingCompany/:company_id" component={onBoardClient} exact/>

                <Route path="/OnBoarding/Tagging/:company_id/:tagging_id" component={Tagging} exact/>


            </Switch>
        </ApolloProvider>


    )
}
