import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Scoresheet from './components/Scoresheet';
// import Start from './components/Start';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import FirebaseProvider from './utils/firebase'

ReactDOM.render(
    <FirebaseProvider>
        <Router>
            <Switch>
                <Route path="/" exact component={Scoresheet} />
                {/* <Route path="/" exact component={Start} /> */}
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
