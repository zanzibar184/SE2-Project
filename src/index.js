import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// Stile di base applicato
import './style.css';

import Home from './components/Home/Home';
import NotFound from './components/NotFound'

import Login from './components/Login/Login';

ReactDOM.render((
    <BrowserRouter>
        <main>
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route path='*' component={NotFound}/>
            </Switch>
        </main>
    </BrowserRouter>
), document.getElementById('root'));

ReactDOM.render((
    <Login/>
), document.getElementById('navbarLogin'));