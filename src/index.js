import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// Stile di base applicato
import './style.css';

import App from './components/App/App';
import NotFound from './components/NotFound'

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
