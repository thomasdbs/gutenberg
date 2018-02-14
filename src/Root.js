import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Home from './components/pages/Home';
import Contact from './components/pages/Contact';
import Products from './components/pages/Products';
import Orders from './components/pages/Orders';
import History from './components/pages/History';
import LegalNotice from './components/pages/LegalNotice';
import ShoppingBag from './components/pages/ShoppingBag';

const Root = () => {
    return (
        <HashRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/histoire" component={History} />
                <Route exact path="/produit/:id" component={Products} />
                <Route exact path="/commandes" component={Orders} />
                <Route exact path="/panier" component={ShoppingBag} />
                <Route exact path="/contact" component={Contact} />
                <Route exact path="/mentions-legales" component={LegalNotice} />
            </Switch>
        </HashRouter>
    )
}

export default Root;
