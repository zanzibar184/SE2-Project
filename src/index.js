import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// Stile di base applicato
import './style.css';

import App from './components/App/App';
import NotFound from './components/NotFound'

import Login from './components/Login/Login';

ReactDOM.render((
    <BrowserRouter>
        <main>
            <Switch>
                <Route exact path='/' component={App}/>
                <Route path='*' component={NotFound}/>
            </Switch>
        </main>
    </BrowserRouter>
), document.getElementById('root'));

ReactDOM.render((
    <Login/>
), document.getElementById('navbarLogin'));
