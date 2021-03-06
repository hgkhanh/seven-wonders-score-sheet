import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Score from './components/Score';
import Start from './components/Start';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import FirebaseProvider from './components/Firebase/context';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

ReactDOM.render(
    <FirebaseProvider>
        <link rel="stylesheet" href="animate.min.css"></link>
        <ReactNotification />
        <Router basename={process.env.PUBLIC_URL}>
            <Switch>
                <Route path="/game/:id" component={Score} />
                <Route path="/" exact component={Start} />
                <Route render={() => <h3>404</h3>} />
            </Switch>
        </Router>
    </FirebaseProvider>,
    document.getElementById('root')
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
