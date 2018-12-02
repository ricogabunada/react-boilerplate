import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Redirect } from 'react-router-dom';
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
// For AsyncTypeahead
import 'bootstrap/dist/css/bootstrap.css';

// Components
import Login from './components/login';
import ForgotPassword from './components/login/forgot-password';
import ResetPassword from './components/login/reset-password';
import Dashboard from './components/dashboard';
import User from './components/user';
import Role from './components/role';
import Permission from './components/permission';
import Department from './components/department';
import Coin from './components/coin';
import GetVeroEvents from './components/get-vero-events';
import CoinCompetition from './components/coin-competition';
import PhaseList from './components/coin-competition/phase-list';
import Airdrop from './components/airdrop';
import AirdropPhaseList from './components/airdrop/phase-list';
import Report from './components/report';
import ICO from './components/ico';
import ICOTranche from './components/ico-tranche';
import ParticipantHighLeverageTask from './components/participant-high-leverage';
import HighLeverageTask from './components/high-leverage-task';
import Transaction from './components/transaction';
import CoinListingApplications from './components/coin-listing-application';

// Layouts
import DefaultLayout from './layouts/default';
import LoginLayout from './layouts/login';
import ForgotPasswordLayout from './layouts/forgot-password';
import ResetPasswordLayout from './layouts/reset-password';

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
							component={RouteBaseComponent([isAuthenticated], Dashboard)}
						/>
						<DefaultLayout
							exact
							path="/users"
							component={RouteBaseComponent([isAuthenticated], User)}
						/>
						<DefaultLayout
							exact
							path="/roles"
							component={RouteBaseComponent([isAuthenticated], Role)}
						/>
						<DefaultLayout
							exact
							path="/permissions"
							component={RouteBaseComponent([isAuthenticated], Permission)}
						/>
						<DefaultLayout
							exact
							path="/coins"
							component={RouteBaseComponent([isAuthenticated], Coin)}
						/>
						<DefaultLayout
							exact
							path="/get-vero-events"
							component={RouteBaseComponent([isAuthenticated], GetVeroEvents)}
						/>
						<DefaultLayout
							exact
							path="/departments"
							component={RouteBaseComponent([isAuthenticated], Department)}
						/>
						<DefaultLayout
							exact
							path="/reports"
							component={RouteBaseComponent([isAuthenticated], Report)}
						/>
						<DefaultLayout
							exact
							path="/coin-competitions"
							component={RouteBaseComponent([isAuthenticated], CoinCompetition)}
						/>
						<DefaultLayout
							exact
							path="/coin-competitions/:coinId"
							component={RouteBaseComponent([isAuthenticated], PhaseList)}
						/>
						<DefaultLayout
							exact
							path="/airdrops"
							component={RouteBaseComponent([isAuthenticated], Airdrop)}
						/>
						<DefaultLayout
							exact
							path="/airdrops/:coinId"
							component={RouteBaseComponent([isAuthenticated], AirdropPhaseList)}
						/>
						<DefaultLayout
							exact
							path="/icos"
							component={RouteBaseComponent([isAuthenticated], ICO)}
						/>
						<DefaultLayout
							exact
							path="/icos/:icoId"
							component={RouteBaseComponent([isAuthenticated], ICOTranche)}
						/>
						<DefaultLayout
							exact
							path="/participant-high-leverage-tasks"
							component={RouteBaseComponent([isAuthenticated], ParticipantHighLeverageTask)}
						/>
						<DefaultLayout
							path="/high-leverage-tasks"
							component={RouteBaseComponent([isAuthenticated], HighLeverageTask)}
						/>
						<DefaultLayout
							path="/transactions"
							component={RouteBaseComponent([isAuthenticated], Transaction)}
						/>
						<DefaultLayout
							path="/coin-listing-applications"
							component={RouteBaseComponent([isAuthenticated], CoinListingApplications)}
						/>
						<LoginLayout
							exact
							path="/login"
							component={RouteBaseComponent([isAuthenticated], Login)}
						/>
						<ForgotPasswordLayout
							exact
							path="/forgot-password"
							component={RouteBaseComponent([isAuthenticated], ForgotPassword)}
						/>
						<ResetPasswordLayout
							exact
							path="/reset-password/:token"
							component={RouteBaseComponent([isAuthenticated], ResetPassword)}
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
