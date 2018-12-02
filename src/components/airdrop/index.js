import React, { Component } from 'react';
import { connect } from 'react-redux';
import CoinCompList from './list';
import {
	getAllCoinPhases,
} from '../../reducers/airdrop/resources';

const defaultOptions = {
	total: 0,
	current: 1,
	filters: {},
	relationships: ['coin'],
	pageSize: 25,
	orderBy: {
		created_at: 'Asc'
	},
};

class CoinComp extends Component {
	componentWillMount () {
		this.setState({
			coinPhases: [],
			pagination: {},
			loading: false,
		});

		this.getAllCoinPhases(defaultOptions);
	}

	getAllCoinPhases = (defaultOptions, cancellable) => {
		this.setState({ loading: true });

		getAllCoinPhases(defaultOptions, cancellable)
			.then(res =>{
				let coinPhases = [];
				let pagination = {};

				coinPhases = res.data.map(val => {
					return {
						key: val.coin_id,
						name: `${val.coin.name} ${val.coin.abbreviation}`,
						phases: val.phases,
					};
				});

				pagination = {
					total: res.total,
					pageSize: defaultOptions.pageSize,
				}

				this.setState({
					pagination: pagination,
					coinPhases: coinPhases,
					loading: false,
				});
			});
	}

	render() {

		return (
			<div className="coin-competition">
				<CoinCompList
					getAllCoinPhases={this.getAllCoinPhases}
					defaultOptions={defaultOptions}
					pagination={this.state.pagination}
					coinPhases={this.state.coinPhases}
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

export default connect(mapStateToProps, mapDispatchToProps)(CoinComp);
