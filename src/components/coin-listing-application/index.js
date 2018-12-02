import React, { Component } from 'react';
import { connect } from 'react-redux';
import CoinListingApplicationList from './list';
import {
	getCoinListingApplications,
} from '../../reducers/coin-listing-application/resources';

class CoinListingApplication extends Component {
	componentWillMount () {
		this.setState({
			coinListingApplications: [],
			pagination: {},
			loading: false,
		});

		this.getCoinListingApplications(1, 25);
	}

	getCoinListingApplications = (page, rowsPerPage) => {
		this.setState({ loading: true });

		getCoinListingApplications(page, rowsPerPage)
			.then(res =>{
				let coinListingApplications = [];
				let pagination = {};

				coinListingApplications = res.data.map(val => {
					return {
						key: val.id,
						name: val.name,
						abbreviation: val.abbreviation,
						website: val.website,
						first_name: val.first_name,
						last_name: val.last_name,
						status: val.status,
						email: val.email,
					};
				});

				pagination = {
					total: res.total,
					pageSize: rowsPerPage,
				}

				this.setState({
					pagination: pagination,
					coinListingApplications: coinListingApplications,
					loading: false,
				});
			});
	}

	render() {

		return (
			<div>
				<CoinListingApplicationList
					getCoinListingApplications={this.getCoinListingApplications}
					pagination={this.state.pagination}
					coinListingApplications={this.state.coinListingApplications}
					loading={this.state.loading}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(CoinListingApplication);
