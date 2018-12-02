import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import './index.css';

// Define layout
class LoginLayout extends React.Component {
	render() {
		return (
			<div>
				<div className="logo-wrapper">
					<img src="/assets/logo.png" />
				</div>
				<div className="login-wrapper">
				  {this.props.children}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {};
};

const ConnectedLayout = connect(mapStateToProps, mapDispatchToProps)(LoginLayout);

export default ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={matchProps => (
        <ConnectedLayout>
          <Component {...matchProps} />
        </ConnectedLayout>
			)}
		/>
	);
};
