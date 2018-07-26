import React from 'react';
import ReactDOM from 'react-dom';
import {Switch, Redirect} from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';
import createHistory from 'history/createBrowserHistory';

/**
 * Redux Thunk
 */
import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import {
	ConnectedRouter,
	routerReducer,
	routerMiddleware
} from 'react-router-redux';


/**
 * Components, Middlewares, Reducers and CSS
 */

// Main CSS
import './main.css';

// Components
import Login from './components/login';
import ForgotPassword from './components/login/forgot-password';
import Dashboard from './components/dashboard';

// Layouts
import DefaultLayout from './layouts/default';
import LoginLayout from './layouts/login';

// routes ACL
import RouteBaseComponent from './shared-components/route-base-component';

// Get all reducers
import reducers from './reducers';

// custom middlewares
import { isAuthenticated } from './utils/auth-helpers';

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history);

//import { isAdmin } from './utils/is-admin';

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
const store = createStore(
	combineReducers({
		...reducers,
		router: routerReducer
	}),
	applyMiddleware(thunk),
	applyMiddleware(middleware),
);

ReactDOM.render(
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<div className="container-fluid">
				<div className="row app-container">
					<Switch>
						<DefaultLayout
							exact
							path="/dashboard"
							component={Dashboard}
						/>
						<LoginLayout
							exact
							path="/login"
							component={Login}
						/>
						<LoginLayout
							exact
							path="/forgot-password"
							component={ForgotPassword}
						/>
						<Redirect
							to="/login" />
					</Switch>
				</div>
			</div>
		</ConnectedRouter>
	</Provider>,
	document.getElementById('root')
);
registerServiceWorker();
