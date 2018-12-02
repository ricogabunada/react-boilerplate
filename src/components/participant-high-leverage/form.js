import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// components
import {
    Form,
    Select,
    TreeSelect,
} from 'antd';

// reducers
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

const defaultCoinCompPhasePagination = {
    total: 0,
	current: 1,
	filters: {},
	relationships: [],
	orderBy: {phase_number: 'Asc'},
	pageSize: 100,
};

const defaultHighLeverageTaskPagination = {
    total: 0,
	current: 1,
	filters: {},
	relationships: [],
	orderBy: {name: 'Asc'},
	pageSize: 100,
};

const defaultCoinCompPhaseParticipantPagination = {
    total: 0,
	current: 1,
	filters: {},
	relationships: ['coin'],
	orderBy: {id: 'Asc'},
	pageSize: 100,
};

const ParticipantHighLeverageTaskForm = Form.create()(
    class extends Component {
        componentDidUpdate(prevProps, prevState, snapshot) {
            // get new set of coin comp phases
            // get new set of high leverage tasks
            if (this.props.coin.details.id !== 'undefined' && prevProps.coin.details !== this.props.coin.details) {
                this.onHighLeverageTaskSearch('', false);
                this.onCoinCompPhaseSearch('', false);
            }

            if (this.props.coinCompPhase.details.id !== 'undefined'
                && prevProps.coinCompPhase.details !== this.props.coinCompPhase.details) {
                this.searchCoinCompParticipant();
            }
        }

        /**
         * Format data
         * @param {Object} data
         * @param {String} field
         * @return {String|Number} 
         */
        formatData = (data, field) => {
            if (data && data[field] && data[field] !== 'undefined') {
                if (field === 'phase_number') {
                    return `Phase ${data.phase_number}`;
                }

                return data[field];
            }

            return '';
        }

        /**
         * On coin change
         * @param {String|Number} value
         * @return {void} set selected coin details
         */
        onCoinChange = value => {
			let selectedCoin = _.filter(this.props.coins.list, item => {
				return value === `${item.name} (${item.abbreviation})`
            });
			
			this.props.setCoinDetails({
				details: selectedCoin.length > 0 ? selectedCoin[0] : {},
            });
        }
        
        /**
         * On coin comp phase change
         * @param {String|Number} value
         * @return {void} set selected coin comp phase details
         */
        onCoinCompPhaseChange = value => {
			let selectedCoinCompPhase = _.filter(this.props.coinCompPhases.list, item => {
				return value === `Phase ${item.phase_number}`
            });
            
			
			this.props.setCoinCompPhaseDetails({
				details: selectedCoinCompPhase.length > 0 ? selectedCoinCompPhase[0] : {},
            });
        }
        
        /**
         * On coin high leverage tasks change
         * @param {String|Number} value
         * @return {void} set selected high leverage task details
         */
        onHighLeverageTaskChange = value => {
			let selectedHighLeverageTask = _.filter(this.props.highLeverageTasks.list, item => {
				return value === item.name
			});
			
			this.props.setHighLeverageTaskDetails({
				details: selectedHighLeverageTask.length > 0 ? selectedHighLeverageTask[0] : {},
            });
        }
        
        /**
         * On coin comp participant change
         * @param {String|Number} value
         * @return {void} set selected coin comp participant details
         */
        onCoinCompParticipantChange = value => {
			let selectedCoinCompParticipant = _.filter(this.props.coinCompParticipants.list, item => {
				return parseInt(value) === parseInt(item.id)
            });

			this.props.setCoinCompParticipantDetails({
				details: selectedCoinCompParticipant.length > 0 ? selectedCoinCompParticipant[0] : {},
            });
		}

        /**
         * On coin search
         * @param {String|Number} value
         * @return {Promise} get new set of coins
         */
		onCoinSearch = value => {
			let newFilters = this.props.coins.pagination.filters;

			// remove name filter
			if (newFilters.hasOwnProperty('name')) {
				delete newFilters.name;
			}

			if (value) {
				newFilters = {...newFilters, name : `like|${value}`}
			}
            
            // get all
			return this.props.getCoins({...this.props.coins.pagination, filters: newFilters}, true);
        }
        
        /**
         * On coin comp phase search
         * @param {String|Number} value
         * @return {Promise} get new set of coin competition phases
         */
		onCoinCompPhaseSearch = (value, cancellable = true) => {
            let newPagination = {...defaultCoinCompPhasePagination, ...this.props.coinCompPhase.pagination};
            newPagination = {...newPagination, filters: {...newPagination.filters,
                coin_id : `=|${this.props.coin.details.id}`
            }};

			// remove phase_number filter
			if (newPagination.filters.hasOwnProperty('phase_number')) {
				delete newPagination.filters.phase_number;
            }

			if (value) {
                newPagination = {...newPagination, filters: {...newPagination.filters,
                    phase_number : `=|${value}`
                }};
            }
            
            // get all
			return this.props.getCoinPhases({...newPagination}, cancellable);
        }

        /**
         * On high leverage task search
         * @param {String|Number} value
         * @return {Promise} get new set of high leverage task
         */
		onHighLeverageTaskSearch = (value, cancellable = true) => {
            let newPagination = {...defaultHighLeverageTaskPagination, ...this.props.highLeverageTasks.pagination};
            newPagination = {...newPagination, filters: {...newPagination.filters,
                coin_id : `=|${this.props.coin.details.id}`,
                type : `=|call_booking`
            }};

			// remove name filter
			if (newPagination.filters.hasOwnProperty('name')) {
				delete newPagination.filters.name;
            }

			if (value) {
                newPagination = {...newPagination, filters: {...newPagination.filters,
                    name : `like|${value}`
                }};
            }
            
            // get all
			return this.props.getHighLeverageTasks({...newPagination}, cancellable);
        }

        /**
         * search coin comp phase participant
         * @return {Promise} set new coin comp participant list
         */
        searchCoinCompParticipant = () => {
            let newPagination = {...defaultCoinCompPhaseParticipantPagination, ...this.props.coinCompParticipants.pagination};
            newPagination = {...newPagination,  phase_id : this.props.coinCompPhase.details.id};
            
            // get all
			return this.props.getCoinPhaseParticipants({...newPagination});
        }

        render() {
            const { getFieldDecorator } = this.props.form;
            const formItemSize = {
                labelCol: {
                    xs: { span: 32 },
                    sm: { span: 8 },
                },
                wrapperCol: {
                    xs: { span: 16 },
                    sm: { span: 16 },
                },
            };

            return (
                <Form id="participant-high-leverage-task-form" layout="horizontal">
                    <Form.Item label="Coin" {...formItemSize}>
                        {getFieldDecorator('coin_name', {
                            rules: [{
                                required: true,
                                message: 'Please select coin.'
                            }],
                            initialValue: this.formatData(this.props.coin.details, 'name'),
                        })(
                            <TreeSelect
                                showSearch
                                allowClear
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="Please select coin name"
                                onChange={this.onCoinChange}
                                onSelect={this.onCoinChange}
                                onSearch={this.onCoinSearch}>
                                {this.props.coins.list.map((coin, index) => {
                                    return <TreeSelect.TreeNode key={index}
                                                    className="coin-name"
                                                    title={`${coin.name} (${coin.abbreviation})`}
                                                    value={`${coin.name} (${coin.abbreviation})`}/>
                                })}
                            </TreeSelect>
                        )}
                    </Form.Item>
                    <Form.Item label="Coin Competition Phase" {...formItemSize}>
                        {getFieldDecorator('coin_comp_phase', {
                            rules: [{
                                required: true,
                                message: 'Please select a coin competition phase.'
                            }],
                            initialValue: this.formatData(this.props.coinCompPhase.details, 'phase_number'),
                        })(
                            <TreeSelect
                                showSearch
                                allowClear
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="Please select a coin competition phase"
                                onChange={this.onCoinCompPhaseChange}
                                onSelect={this.onCoinCompPhaseChange}
                                onSearch={this.onCoinCompPhaseSearch}
                                disabled={this.props.coinCompPhases.list.length === 0}>
                                {this.props.coinCompPhases.list.map((coinCompPhase, index) => {
                                    return <TreeSelect.TreeNode key={index}
                                                    className="coin-name"
                                                    title={`Phase ${coinCompPhase.phase_number}`}
                                                    value={`Phase ${coinCompPhase.phase_number}`}/>
                                })}
                            </TreeSelect>
                        )}
                    </Form.Item>
                    <Form.Item label="High Leverage Task" {...formItemSize}>
                        {getFieldDecorator('high_leverage_task', {
                            rules: [{
                                required: true,
                                message: 'Please select a high leverage task.'
                            }],
                            initialValue: this.formatData(this.props.highLeverageTask.details, 'name'),
                        })(
                            <TreeSelect
                                showSearch
                                allowClear
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="Please select a high leverage task"
                                onChange={this.onHighLeverageTaskChange}
                                onSelect={this.onHighLeverageTaskChange}
                                onSearch={this.onHighLeverageTaskSearch}
                                disabled={this.props.highLeverageTasks.list.length === 0}>
                                {this.props.highLeverageTasks.list.map((highLeverageTask, index) => {
                                    return <TreeSelect.TreeNode key={index}
                                                    className="coin-name"
                                                    title={`${highLeverageTask.name}`}
                                                    value={`${highLeverageTask.name}`}/>
                                })}
                            </TreeSelect>
                        )}
                    </Form.Item>
                    <Form.Item label="Participants" {...formItemSize}>
                        {getFieldDecorator('participant', {
                            rules: [{
                                required: true,
                                message: 'Please select a participant.'
                            }],
                            initialValue: this.formatData(this.props.coinCompParticipant.details, `id`),
                        })(
                            <Select
                                disabled={this.props.coinCompParticipants.list.length === 0}
                                onChange={this.onCoinCompParticipantChange}>
                                {this.props.coinCompParticipants.list.map((coinCompParticipant, index) => {
                                    return <Select.Option key={index} value={`${coinCompParticipant.id}`}>
                                                {`${coinCompParticipant.coin.name} (${coinCompParticipant.coin.abbreviation})`}
                                            </Select.Option>
                                })}
                            </Select>
                        )}
                    </Form.Item>
                </Form>
            );
        }
    }
);

const mapStateToProps = state => {
    return {
        // coins
        coins: state.coins.coins,
        coin: state.coins.coin,

        // coin comp phases
        coinCompPhases: state.coinCompPhases.coinCompPhases,
        coinCompPhase: state.coinCompPhases.coinCompPhase,

        // coin comp phase participants
        coinCompParticipants: state.coinCompParticipants.coinCompParticipants,
        coinCompParticipant: state.coinCompParticipants.coinCompParticipant,

        // high leverage tasks
        highLeverageTasks: state.highLeverageTasks.highLeverageTasks,
        highLeverageTask: state.highLeverageTasks.highLeverageTask,
    }
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
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantHighLeverageTaskForm);