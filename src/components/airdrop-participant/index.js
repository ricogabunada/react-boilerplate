import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCoins } from '../../reducers/coins/resources';
import { setCoinCompParticipantList } from '../../reducers/airdrop-participants/actions';
import {
	getCoinPhase,
	getCoinPhases
} from '../../reducers/airdrop/resources';
import {
	addCoinPhaseParticipant,
	getCoinPhaseParticipants
} from '../../reducers/airdrop-participants/resources';
import {
	setCoinCompPhaseDetails,
	setCoinCompPhaseList,
} from '../../reducers/airdrop/actions';

import { setCoinList } from '../../reducers/coins/actions';

import CoinCompParticipantList from './list';
import './index.css';

const defaultCoinListOptions = {
	total: 0,
	current: 1,
	filters: {},
	relationships: [],
	orderBy: {created_at: 'Asc'},
	pageSize: 25,
};

const defaultCoinCompParticipantListOptions = {
	total: 0,
	current: 1,
	filters: {},
	relationships: ['coin'],
	orderBy: {created_at: 'Asc'},
	pageSize: 10,
};

class CoinCompPhaseParticipants extends Component {
	componentWillMount () {
		this.getCoinPhase(this.props.phaseId);
		this.getCoins({...defaultCoinListOptions, filters: {
			...defaultCoinListOptions.filters, id: `<>|${this.props.coinId}`
		}});
	}

	/**
	 * Get coins
	 * @param {Object} options
	 * @param {Boolean} cancellable
	 * @return {Promise}
	 */
	getCoins = (options = {}, cancellable = false) => {
		this.props.setCoinList({
			coins: [],
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

	/**
	 * Get coin phases
	 * @param  {Object} options
	 * @param  {Boolean} cancellable
	 * @return {Promise}
	 */
	getCoinPhases = (options = {}, cancellable = false) => {
		this.props.setCoinCompPhaseList({
            list: [],
			load: cancellable ? false : true,
    	});

		return getCoinPhases(options, cancellable)
			.then(res => {
				let list = res.data.map(item => {
					return {...item, ...{ key: item.id }};
				});

				this.props.setCoinCompPhaseList({
					list: list,
					load: false,
					pagination: {...options, total: res.total},
				});
			})
			.catch(err => {
				this.props.setCoinCompPhaseList({
					load: false,
					pagination: {...options, total: 0},
				});
			});
	}

	/**
	 * Get coin phase
	 * @param  {Integer} options
	 * @return {Promise}
	 */
	getCoinPhase = phaseId => {
		this.props.setCoinCompPhaseDetails({
			load: true,
			details: {}
		});

		return getCoinPhase(phaseId)
			.then(res => {
				this.props.setCoinCompPhaseDetails({
					load: false,
					details: res
				});

				this.getCoinPhaseParticipants({...defaultCoinCompParticipantListOptions, phase_id: phaseId});
			})
			.catch(err => {
				this.props.setCoinCompPhaseDetails({load: false});
			});;
	}

	/**
	 * Get coin phase participants
	 * @param {Object} options
	 * @param {Boolean} cancellable
	 * @return {Promise}
	 */
	getCoinPhaseParticipants = (options = {}, cancellable = false) => {
		this.props.setCoinCompParticipantList({
			list: [],
			load: cancellable ? false : true,
		});

		return getCoinPhaseParticipants(options, cancellable)
			.then(res => {
				let list = res.data.map(item => {
					return {...item, ...{ key: item.id }};
				});

				this.props.setCoinCompParticipantList({
					list: list,
					load: false,
					pagination: {...options, total: res.total},
				});
			})
			.catch(err => {
				this.props.setCoinCompParticipantList({
					load: false,
					pagination: {...options, total: 0},
				});
			});
	}

	render() {
		return (
			<div>
				<CoinCompParticipantList
					getCoins={this.getCoins}
					phaseId={this.props.phaseId}
					getCoinPhases={this.getCoinPhases}
					wrappedComponentRef={this.props.saveFormRef}
					getCoinPhaseParticipants={this.getCoinPhaseParticipants}/>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		// coin comp phases
		coinCompPhase: state.coinCompPhases.coinCompPhase,
		coinCompPhases: state.coinCompPhases.coinCompPhases,

		// coin
		coins: state.coins.coins,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		// coin comp phases
		setCoinCompPhaseDetails(details) {
			dispatch(setCoinCompPhaseDetails(details));
		},
		setCoinCompPhaseList(list) {
			dispatch(setCoinCompPhaseList(list));
		},

		// coin comp phase participants
		setCoinCompParticipantList(list) {
			dispatch(setCoinCompParticipantList(list));
		},

		// coin
		setCoinList(list) {
			dispatch(setCoinList(list));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CoinCompPhaseParticipants);
