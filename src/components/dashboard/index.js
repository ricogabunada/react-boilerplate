import React, { Component } from 'react';
import { connect } from 'react-redux';
import './index.css';

class Dashboard extends Component {
	componentWillMount() {
	}

	componentWillUnmount() {
	}

	render() {
		return (
			<div className="container-dashboard">
				Hello Bitch
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
