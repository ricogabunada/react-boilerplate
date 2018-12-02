import React, { Component } from 'react';
import { connect } from 'react-redux';

// reducers
// resources
import { getCoins } from '../../reducers/coins/resources';
import { getCoinPhases } from '../../reducers/coin-competition/resources';
import { getHighLeverageTasks } from '../../reducers/high-leverage-tasks/resources';
import { getCoinPhaseParticipants } from '../../reducers/coin-competition-participants/resources';
import { getParticipantHighLeverageTasks } from '../../reducers/participant-high-leverage-tasks/resources';
// actions
import { 
    setCoinDetails,
    setCoinList
} from '../../reducers/coins/actions';
import {
    setCoinCompPhaseDetails,
    setCoinCompPhaseList
} from '../../reducers/coin-competition/actions';
import {
    setHighLeverageTaskDetails,
    setHighLeverageTaskList
} from '../../reducers/high-leverage-tasks/actions';
import {
    setCoinCompParticipantDetails,
    setCoinCompParticipantList
} from '../../reducers/coin-competition-participants/actions';
import { setParticipantTaskList } from '../../reducers/participant-high-leverage-tasks/actions';

// component
import ParticipantTaskList from './list';

const defaultCoinPagination = {
    total: 0,
	current: 1,
	filters: {'is_verified': '=|1'},
	relationships: [],
	orderBy: {name: 'Asc'},
	pageSize: 25,
};

const defaultParticipantTasksListOptions = {
	total: 0,
	current: 1,
	filters: {},
	relationships: [
		'phaseParticipant.coin',
		'phaseParticipant.phase',
		'leverageTask'
	],
	orderBy: {created_at: 'Asc'},
	pageSize: 25,
};

class ParticipantHighLeverageTask extends Component {
	componentWillMount() {
        this.getCoins({...defaultCoinPagination});
		this.getParticipantTasks({...defaultParticipantTasksListOptions});
	}

	/**
     * Get coins
     * @param {Object} options
     * @param {Boolean} cancellable
     * @return {Promise} set coins store
     */
    getCoins = (options = {}, cancellable = false) => {
		// reset data
		this.props.setCoinDetails({details:{}});
		this.props.setCoinCompPhaseDetails({details:{}});
		this.props.setHighLeverageTaskDetails({details:{}});
		this.props.setCoinCompParticipantDetails({details:{}});

        this.props.setCoinList({
            list: [],
            load: true
        });

        return getCoins(options, cancellable)
            .then( res => {
                let list = res.data.map(item => {
                    return {...item, key: item.id}
                });
                
                this.props.setCoinList({
                    list: list,
                    load: false,
                    pagination: {...options, total: res.total}
                });
            }).catch( err => {
                this.props.setCoinList({
                    laod: false,
                    pagination: {...options, total: 0}
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
		this.props.setCoinCompParticipantList({list: []});
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
     * Get high leverage tasks
     * @param {Object} options
     * @param {Boolean} cancellable
     * @return {Promise} set high leverage task store
     */
    getHighLeverageTasks = (options = {}, cancellable = false) => {
        this.props.setHighLeverageTaskList({
            list: [],
            load: true,
        });

        return getHighLeverageTasks(options, cancellable)
            .then( res => {
                let list = res.data.map( item => {
                    return {...item, key: item.id}
                });

                this.props.setHighLeverageTaskList({
                    list: list,
                    load: false,
                    pagination: {...options, total: res.total}
                });
            }).catch( err => {
                this.props.setHighLeverageTaskList({
                    load: false,
                    pagination: {...options, total: 0}
                });
            });
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

	/**
     * Get participant tasks
     * @param {Object} options
     * @param {Boolean} cancellable
     * @return {Promise} set participant tasks store
     */
	getParticipantTasks = (options, cancellable) => {
		return getParticipantHighLeverageTasks(options, cancellable)
			.then(res => {
				let list = res.data.map(item => {
					return {...item, ...{ key: item.id }};
				});

				this.props.setParticipantTaskList({
					list: list,
					load: false,
					pagination: {...options, total: res.total},
				});
			})
			.catch(err => {
				this.props.setParticipantTaskList({
					load: false,
					pagination: {...options, total: 0},
				});
			});
	}

	render() {
		return (
			<div>
				<ParticipantTaskList
					getCoins={this.getCoins}
					getCoinPhases={this.getCoinPhases}
					getHighLeverageTasks={this.getHighLeverageTasks}
					getCoinPhaseParticipants={this.getCoinPhaseParticipants}
					getParticipantTasks={this.getParticipantTasks}/>
			</div>
		)
	}

}

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
    return {
        // coins
        setCoinDetails(details) {
            dispatch(setCoinDetails(details));
        },
        setCoinList(list) {
            dispatch(setCoinList(list));
        },

        // coin comp phases
        setCoinCompPhaseDetails(details) {
            dispatch(setCoinCompPhaseDetails(details));
        },
        setCoinCompPhaseList(list) {
            dispatch(setCoinCompPhaseList(list));
        },

        // coin comp phase participants
        setCoinCompParticipantDetails(details) {
            dispatch(setCoinCompParticipantDetails(details));
        },
        setCoinCompParticipantList(list) {
            dispatch(setCoinCompParticipantList(list));
        },

        // high leverage tasks
        setHighLeverageTaskDetails(details) {
            dispatch(setHighLeverageTaskDetails(details));
        },
        setHighLeverageTaskList(list) {
            dispatch(setHighLeverageTaskList(list));
		},
		
		// participant tasks
		setParticipantTaskList(list) {
			dispatch(setParticipantTaskList(list));
		}
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantHighLeverageTask);