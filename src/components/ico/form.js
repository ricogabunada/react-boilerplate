import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Form,
	TreeSelect,
	DatePicker,
	Select,
	InputNumber,
} from 'antd';

import _ from 'lodash';
import moment from 'moment';
import timezones from '../../utils/timezones.json';
import Format from '../../utils/format';

import {
	setICODetails,
	setICOList,
} from '../../reducers/icos/actions';
import {
	setCoinDetails,
	setCoinList,
} from '../../reducers/coins/actions';
import {
	setCoinTransactionSettingDetails,
	setCoinTransactionSettingList,
} from '../../reducers/coin-transaction-settings/actions';

const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'MM/DD/YYYY';
const Option = Select.Option;
const defaultDateRange = [
	moment(new Date(), dateFormat),
	moment(new Date(), dateFormat)
];

const ICOForm = Form.create()(
	class extends Component {
		componentWillMount () {
			this.setState({
				totalDays: this.setTotalDays(this.props.ICO.details.date_range || defaultDateRange)
			});
		}

		componentWillReceiveProps(nextProps) {
			if (nextProps.ICO.details && nextProps.ICO.details.date_range !== this.props.ICO.details.date_range) {
				this.setState({
					totalDays: this.setTotalDays(nextProps.ICO.details.date_range || defaultDateRange)
				});
			}
		}

		formatData(data, field, type = 'alphabet') {
			if (data && Object.keys(data).length > 0 && data[field]) {
				return data[field];
			}

			if (field === 'date_range') {
				return defaultDateRange
			}

			if (type === 'number') {
				return 0;
			}

			return '';
		}

		/**
		 * Set total days
		 * @param {Object} dateRange
		 * @return {void} set total days state
		 */
		setTotalDays = dateRange => {
			if (dateRange.length > 0) {
				const start = moment(dateRange[0]);
				const end = moment(dateRange[1]);
				const daysDiff = moment.range(start, end);
				const rangeInDays = daysDiff.snapTo('day');
				return rangeInDays.diff('days');
			}

			return 0;
		}

        onCoinChange = value => {
			let selectedCoin = _.filter(this.props.coins.list, item => {
				return value === `${item.name} (${item.abbreviation})`
			});
			
			this.props.setCoinDetails({
				details: selectedCoin.length > 0 ? selectedCoin[0] : {},
			});
		}

		onCoinSearch = value => {
			let newFilters = this.props.coins.pagination.filters;

			// remove name filter
			if (newFilters.hasOwnProperty('name')) {
				delete newFilters.name;
			}

			if (value) {
				newFilters = {...newFilters, name : `like|${value}`}
			}

			this.props.setCoinDetails({details:{}});
			this.props.setCoinList({list:[]});

			return this.props.getCoins({...this.props.coins.pagination, filters: newFilters}, true);
		}

		/**
		 * On date range change
		 * @param {object} value moment object
		 * @return {void} set date range 
		 */
		onDateRangeChange = value => {
			this.setState({ totalDays: this.setTotalDays(value) });
		}


		render() {
			const { getFieldDecorator } = this.props.form;
			const formItemSize = {
				labelCol: {
					xs: { span: 24 },
					sm: { span: 8 },
				},
				wrapperCol: {
					xs: { span: 24 },
					sm: { span: 16 },
				},
			};

			// timezones
			let newTimezones = [];
			timezones.map((item) => {
				if (item.utc.length > 0) {
					_.each(item.utc, utc => {
						if (newTimezones.indexOf(utc) < 0) {
							newTimezones.push(utc);
						}
					});
				}
			});

			newTimezones.sort();
			const timezoneOptions = newTimezones.map((item, index) =>
				<Option key={index} value={item}>{item}</Option>
			);

			return (
				<Form layout="horizontal">
					<FormItem label="Coin" {...formItemSize}>
						{getFieldDecorator('coin_name', {
							rules: [{
								required: true,
								message: 'Please select a coin.'
							}],
							initialValue: this.formatData(this.props.ICO.details, 'coin_name'),
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
									return <TreeNode key={index}
													className="coin-name"
													title={`${coin.name} (${coin.abbreviation})`}
													value={`${coin.name} (${coin.abbreviation})`}/>
								})}
							</TreeSelect>
						)}
					</FormItem>
					<FormItem label="Date Range" {...formItemSize}
						extra={`${this.state.totalDays} days`}>
						{getFieldDecorator('date_range', {
							rules: [{
								required: true,
								message: 'Please set date range.'
							}],
							initialValue: this.formatData(this.props.ICO.details, 'date_range')
						})(<RangePicker style={{width: 395}}
								format={dateFormat}
								onChange={this.onDateRangeChange}/>)}
					</FormItem>
					<FormItem label="Timezone" {...formItemSize}>
						{getFieldDecorator('timezone', {
							rules: [{
								required: true,
								message: 'Please select timezone.'
							}],
							initialValue: this.formatData(this.props.ICO.details, 'timezone')
						})(<Select>{timezoneOptions}</Select>)}
					</FormItem>
					<FormItem label="Token Soft Cap" {...formItemSize}>
						{getFieldDecorator('volume_soft_cap', {
							rules: [{
								required: true,
								message: 'Please input token soft cap.'
							}, {
								pattern: /^[0-9.,]+$/,
								message: 'Please input a valid amount.'
							}],
							initialValue: this.formatData(this.props.ICO.details, 'volume_soft_cap') || 0
						})(<InputNumber type='text'
								style={{'width': '100%'}}
								formatter={value => Format.number(value)}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}/>)}
					</FormItem>
					<FormItem label="Token Hard Cap" {...formItemSize}>
						{getFieldDecorator('volume_hard_cap', {
							rules: [{
								required: true,
								message: 'Please input token hard cap.'
							}, {
								pattern: /^[0-9.,]+$/,
								message: 'Please input a valid amount.'
							}],
							initialValue: this.formatData(this.props.ICO.details, 'volume_hard_cap') || 0
						})(<InputNumber type='text'
								style={{'width': '100%'}}
								formatter={value => Format.number(value)}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}/>)}
					</FormItem>
					<FormItem label="Total number of tokens" {...formItemSize}>
						{getFieldDecorator('volume_for_sale', {
							rules: [{
								required: true,
								message: 'Please input total number of tokens.'
							}, {
								pattern: /^[0-9.,]+$/,
								message: 'Please input a valid amount.'
							}],
							initialValue: this.formatData(this.props.ICO.details, 'volume_for_sale') || 0
						})(<InputNumber type='text'
								disabled={true}
								style={{'width': '100%'}}
								formatter={value => Format.number(value)}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}/>)}
					</FormItem>
					<FormItem label="Token price" {...formItemSize}>
						{getFieldDecorator('usd_price', {
							rules: [{
								required: true,
								message: 'Please input token price.'
							}, {
								pattern: /^[0-9.,]+$/,
								message: 'Please input a valid amount.'
							}],
							initialValue: this.formatData(this.props.ICO.details, 'usd_price') || 0
						})(<InputNumber type='text'
								disabled={true}
								style={{'width': '100%'}}
								formatter={value => Format.number(value, '$', '', 4)}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}/>)}
					</FormItem>
					<FormItem label="Minimum Purchase USD" {...formItemSize}>
						{getFieldDecorator('minimum_buy_in', {
							rules: [{
								required: true,
								message: 'Please input minimum purchase USD.'
							}, {
								pattern: /^[0-9.,]+$/,
								message: 'Please input a valid amount.'
							}],
							initialValue: this.formatData(this.props.ICO.details, 'minimum_buy_in') || 0
						})(<InputNumber type='text'
								style={{'width': '100%'}}
								formatter={value => Format.number(value, '$', '', 4)}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}/>)}
					</FormItem>
				</Form>
			);
		}
	}
);

const mapStateToProps = state => {
	return {
		// ico
		ICO: state.icos.ICO,
		ICOs: state.icos.ICOs,

		// coin
		coin: state.coins.coin,
		coins: state.coins.coins,

		// coin transaction setting
		coinTransactionSetting: state.coinTransactionSettings.coinTransactionSetting,
		coinTransactionSettings: state.coinTransactionSettings.coinTransactionSettings,
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

		// coin transaction setting
		setCoinTransactionSettingDetails(details) {
			dispatch(setCoinTransactionSettingDetails(details));
		},
		setCoinTransactionSettingList(list) {
			dispatch(setCoinTransactionSettingList(list));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ICOForm);
