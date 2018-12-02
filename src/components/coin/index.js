import React, { Component } from 'react';
import { connect } from 'react-redux';
import CoinList from './list';

import {
	getSustainableDevGoals
} from '../../reducers/sustainable-dev-goals/resources';
import {
	getCoin,
	getCoins
} from '../../reducers/coins/resources';

import {
	setSustainableDevGoalDetails,
	setSustainableDevGoalList,
} from '../../reducers/sustainable-dev-goals/actions';

const defaultListOptions = {
	current: 1,
	filters: {},
	relationships: ['goals','apiKey'],
	orderBy: {created_at: 'Asc'},
	pageSize: 25,
};

const defaultSustainableDevGoalListOptions = {
	total: 0,
	current: 1,
	filters: {},
	relationships: [],
	orderBy: {created_at: 'Asc'},
	pageSize: 25,
};


class Coins extends Component {
	componentWillMount () {
		this.setState({
			coin: {},
			coins: [],
			loadCoins: false,
			loadCoinDetails: false,
			pagination: {...defaultListOptions},
		});

		this.getCoins({...defaultListOptions});
		this.getSustainableDevGoals({...defaultSustainableDevGoalListOptions});
	}

	getCoins = (options) => {
		this.setState({ loadCoins: true });

		let coins = [];
		let total = 0;
		let pagination = {};

		pagination = {
			total: total,
			filters: options.filters,
			orderBy: options.orderBy,
			current: options.current,
			pageSize: options.pageSize,
			relationships: options.relationships,
		};

		getCoins(options)
			.then(res => {
				coins = res.data.map(item => {
					return {...item, ...{ key: item.id }};
				});

				this.setState({
					coins: coins,
					loadCoins: false,
					pagination: {...pagination, ...{total: res.total}},
				});
			})
			.catch(err => {
				this.setState({
					coins: coins,
					loadCoins: false,
					pagination: pagination,
				});
			});
	}

	getSustainableDevGoals(options, cancellable) {
		this.props.setSustainableDevGoalList({
			list: [],
			load: true
		});

		getSustainableDevGoals(options, cancellable)
			.then(res => {
				let sustainableGoals = res.data.map(item => {
					return {...item, ...{ key: item.id }};
				});

				this.props.setSustainableDevGoalList({
					list: sustainableGoals,
					load: false,
					pagination: {...options, total: res.total},
				});
			})
			.catch(err => {
				this.props.setSustainableDevGoalList({
					load: false,
					pagination: {...options, total: 0},
				});
			});
	}

	getCoin = coinId => {
		this.setState({ loadCoinDetails: true });

		getCoin(coinId)
			.then(res => {
				this.setState({
					coin: res,
					loadCoinDetails: false,
				});
			});
	}

	setCoinDetails = details => {
		this.setState({coin: details});
	}

	render() {
		return (
			<div>
				<CoinList
					coin={this.state.coin}
					coins={this.state.coins}
					getCoin={this.getCoin}
					getCoins={this.getCoins}
					setCoinDetails={this.setCoinDetails}
					getSustainableDevGoals={this.getSustainableDevGoals}
					loadCoins={this.state.loadCoins}
					loadCoinDetails={this.state.loadCoinDetails}
					pagination={this.state.pagination}/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		sustainableDevGoal: state.sustainableDevGoals.sustainableDevGoal,
		sustainableDevGoals: state.sustainableDevGoals.sustainableDevGoals,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setSustainableDevGoalDetails(details) {
			dispatch(setSustainableDevGoalDetails(details));
		},
		setSustainableDevGoalList(list) {
			dispatch(setSustainableDevGoalList(list));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Coins);
