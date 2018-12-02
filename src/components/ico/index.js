import React, { Component } from 'react';
import { connect } from 'react-redux';
import ICOList from './list';
import {
	getICO,
	getICOs,
} from '../../reducers/icos/resources';
import './index.css';
import { getCoins } from '../../reducers/coins/resources';
import {
	setICODetails,
	setICOList,
} from '../../reducers/icos/actions';
import {
	setCoinDetails,
	setCoinList,
} from '../../reducers/coins/actions';
import moment from 'moment';

const defaultICOListOptions = {
	total: 0,
	current: 1,
	filters: {},
	relationships: ['coin'],
	orderBy: {created_at: 'Asc'},
	pageSize: 25,
};

const defaultCoinListOptions = {
	total: 0,
	current: 1,
	filters: {
		'is_verified': '=|1',
		'is_deleted': '=|0',
	},
	orderBy: {name: 'Asc'},
	pageSize: 25,
};

class ICOs extends Component {
	componentWillMount () {
		this.getICOs({...defaultICOListOptions});
		this.getCoins({...defaultCoinListOptions});
	}

	getICOs = (options, cancellable) => {
		this.props.setICOList({
			list: [],
			load: true,
		});

		return getICOs(options, cancellable)
			.then(res => {
				let list = res.data.map(item => {
					return {...item, ...{ key: item.id }};
				});

				this.props.setICOList({
					list: list,
					load: false,
					pagination: {...options, total: res.total},
				});
			})
			.catch(err => {
				this.props.setICOList({
					load: false,
					pagination: {...options, total: 0},
				});
			});
	}

	getICO = ICOId => {
		this.props.setCoinDetails({details: {}});
		this.props.setICODetails({
			load: true,
			details: {}
		});

		return getICO(ICOId)
				.then(res => {
					this.props.setCoinDetails({details: res.coin});
					this.props.setICODetails({
						load: false,
						details: {...res, ...{
							coin_name: `${res.coin.name} (${res.coin.abbreviation})`,
							date_range: [
								moment(new Date(res.start_date), 'MM/DD/YYYY'),
								moment(new Date(res.end_date), 'MM/DD/YYYY'),
							]}
						}
					});
				})
				.catch(err => {
					this.props.setICODetails({load: false});
				});;
	}
		
	getCoins = (options, cancellable) => {
		this.props.setCoinList({
			list: [],
			load: cancellable ? false : true,
		});

		return getCoins(options, cancellable)
			.then(res => {
				let list = res.data.map(item => {
					return {...item, ...{ key: item.id }};
				});

				this.props.setCoinList({
					list: list,
					load: false,
					pagination: {...options, total: res.total},
				});
			})
			.catch(err => {
				this.props.setCoinList({
					load: false,
					pagination: {...options, total: 0},
				});
			});
	}

	render() {
		return (
			<div>
				<ICOList
					getICO={this.getICO}
					getICOs={this.getICOs}
					getCoins={this.getCoins}/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		// ico
		ICO: state.icos.ICO,
		ICOs: state.icos.ICOs,

		// coin
		coin: state.coins.coin,
		coins: state.coins.coins,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		// ico
		setICODetails(details) {
			dispatch(setICODetails(details));
		},
		setICOList(list) {
			dispatch(setICOList(list));
		},

		// coin
		setCoinDetails(details) {
			dispatch(setCoinDetails(details));
		},
		setCoinList(list) {
			dispatch(setCoinList(list));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ICOs);
