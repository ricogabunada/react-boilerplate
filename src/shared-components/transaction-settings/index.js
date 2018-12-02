import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
	Form,
	Spin,
	Input,
	Select,
	Checkbox,
} from 'antd';
import {
	getCoinTransactionSettings,
	getCoinTransactionSetting,
} from '../../reducers/coin-transaction-settings/resources';
import {
	setSaveAsNewTransaction
} from '../../reducers/coin-transaction-settings/actions';

const FormItem = Form.Item;
const Option = Select.Option;

let defaultOptions = {
	total: 0,
	current: 1,
	filters: {},
	orderBy: {name: 'Desc'},
	pageSize: 1000,
};

class TransactionSettings extends Component {
	componentWillMount() {
		this.setState({
			formOnLoad: false,
			transactionSettingOptions: [],
			coinId: this.setInitialStateValueFromProps('coinId', null),
			saveAsNew: this.setInitialStateValueFromProps('saveAsNew', false),
			recordDetails: this.setInitialStateValueFromProps('recordDetails', {}),
			displaySaveAsNew: this.setInitialStateValueFromProps('displaySaveAsNew', true),
			defaultTransactionName: this.setInitialStateValueFromProps('defaultTransactionName', ''),
			searchTransactionSettings: this.setInitialStateValueFromProps('searchTransactionSettings', true),
		});

		// set default transaction setting
		if (typeof this.props.recordDetails !== 'undefined') {
			defaultOptions.filters = {coin_id: `=|${this.props.coinId}`};
			return this.getCoinTransactionSettings();
		}
	}

	/**
	 * Set initial states
	 * @param {String} field
	 * @param {*} initialValue
	 * @return {*} 
	 */
	setInitialStateValueFromProps = (field, initialValue) => {
		if (typeof this.props[field] === 'undefined'
			|| (typeof this.props[field] === 'object' && Object.keys(this.props[field]).length === 0)) {
			return initialValue;
		}

		return this.props[field];
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		// when checking or unchecking of save as new transaction setting checkbox
		if (prevProps.saveAsNewTransaction !== this.props.saveAsNewTransaction) {
			if (this.props.saveAsNewTransaction) {
				return this.props.form.setFieldsValue({
					usd_price: null,
					minimum_buy_in: null,
					volume_for_sale: null,
					volume_sold: 0,
				});
			}

			// check if process is to search for transaction settings or not
			if (typeof this.props.recordDetails !== 'undefined') {
				return this.getCoinTransactionSetting(this.props.recordDetails.transaction_setting_id);
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		// if coin selected will change
		if (nextProps.coinId && nextProps.coinId != this.state.coinId) {
			this.setState({
				coinId: nextProps.coinId,
				recordDetails: nextProps.recordDetails,
				defaultTransactionName: nextProps.defaultTransactionName,
			});

			// check if process is to search for transaction settings or not
			if (this.state.searchTransactionSettings) {
				defaultOptions.filters = {
					coin_id: `=|${nextProps.coinId}`,
				};

				return this.getCoinTransactionSettings();
			}
		}

		// if default transaction name will change
		if (nextProps.defaultTransactionName
			&& nextProps.defaultTransactionName != this.state.defaultTransactionName) {
			return this.setState({
				coinId: nextProps.coinId,
				recordDetails: nextProps.recordDetails,
				defaultTransactionName: nextProps.defaultTransactionName,
			});
		}

		// if recordDetails will update
		if (nextProps.recordDetails && nextProps.recordDetails != this.state.recordDetails) {
			return this.setState({recordDetails: nextProps.recordDetails});
		}
	}

	getCoinTransactionSettings = () => {
		this.setState({formOnLoad: true});
		return getCoinTransactionSettings(defaultOptions, true)
			.then(res => {
				let transactionSettingOptions = [];
				transactionSettingOptions = res.data.map(val => {
					return <Option key={val.id} value={val.id}>{val.name}</Option>
				});

				this.setState({
					formOnLoad: false,
					transactionSettingOptions: transactionSettingOptions,
				});
			}).catch( err => {
				this.setState({
					formOnLoad: false,
					transactionSettingOptions: [],
				});
			});
	}

	getCoinTransactionSetting = id => {
		this.setState({formOnLoad: true});
		return getCoinTransactionSetting(id)
			.then(res => {
				this.setState({formOnLoad: false});
				return this.props.form.setFieldsValue({
					usd_price: res.usd_price,
					minimum_buy_in: res.minimum_buy_in,
					volume_for_sale: res.volume_for_sale,
					volume_sold: res.volume_sold,
				});
			});
	}

	handleChange = value => {
		this.getCoinTransactionSetting(value);
	}

	handleCheck = e => {
		this.props.setSaveAsNewTransaction(e.target.checked);
		if(e.target.checked) {
			return this.props.form.setFieldsValue({
				usd_price: null,
				minimum_buy_in: null,
				volume_for_sale: null,
				volume_sold: null,
			});
		}

		if(this.props.phaseDetails && this.props.phaseDetails.transaction_setting_id) {
			this.getCoinTransactionSetting(this.props.phaseDetails.transaction_setting_id);
		}
	}

	render() {
		const {
			form,
			formItemSize,
		} = this.props;
		const { getFieldDecorator } = form;
		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 24,
					offset: 0
				},
				sm: {
					span: 16,
					offset: 8
				}
			}
		};

		return (
			<div>
				<Spin spinning={this.state.formOnLoad}>
					{this.props.saveAsNewTransaction ?
						<FormItem label="Transaction Name" {...formItemSize}>
							{getFieldDecorator('name', {
								rules: [{ required: true, message: 'Please input Transaction Name!' }],
								initialValue: ((this.state.recordDetails || {}).transaction_settings || {}).name || this.state.defaultTransactionName || '',
							})(<Input disabled={!this.state.displaySaveAsNew} type="text"/>)}
						</FormItem> : 
						<FormItem label="Transaction Settings" {...formItemSize}>
							{getFieldDecorator('transaction_setting_id', {
								rules: [{ required: true, message: 'Please select Transaction Settings!' }],
								initialValue: (this.state.recordDetails || {}).transaction_setting_id,
							})(
								<Select
									showSearch
									placeholder="Select a transaction setting"
									onChange={this.handleChange}>
									{this.state.transactionSettingOptions}
								</Select>
							)}
						</FormItem>
					}
					<FormItem label="USD Price" {...formItemSize}>
						{getFieldDecorator('usd_price', {
							rules: [{ required: true, message: 'Please input USD Price!' }],
							initialValue: ((this.state.recordDetails || {}).transaction_settings || {}).usd_price,
						})(<Input disabled={!this.props.saveAsNewTransaction} type="number"/>)}
					</FormItem>
					<FormItem label="Minimum Buy-in" {...formItemSize}>
						{getFieldDecorator('minimum_buy_in', {
							rules: [{ required: true, message: 'Please input Minimimum Buy-in!' }],
							initialValue: ((this.state.recordDetails || {}).transaction_settings || {}).minimum_buy_in,
						})(<Input disabled={!this.props.saveAsNewTransaction} type="number"/>)}
					</FormItem>
					<FormItem label="Volume for Sale" {...formItemSize}>
						{getFieldDecorator('volume_for_sale', {
							rules: [{ required: true, message: 'Please input Volume for Sale!' }],
							initialValue: ((this.state.recordDetails || {}).transaction_settings || {}).volume_for_sale,
						})(<Input disabled={!this.props.saveAsNewTransaction} type="number"/>)}
					</FormItem>
					<FormItem label="Volume Sold" {...formItemSize}>
						{getFieldDecorator('volume_sold', {
							rules: [{ required: true, message: 'Please input Volume Sold!' }],
							initialValue: ((this.state.recordDetails || {}).transaction_settings || {}).volume_sold || 0,
						})(<Input disabled={true} type="number"/>)}
					</FormItem>
					{this.state.displaySaveAsNew ? 
						<FormItem {...tailFormItemLayout}>
							{getFieldDecorator('saveNewTransaction', {
								valuePropName: 'checked',
								checked: this.props.saveAsNewTransaction,
								initialValue: this.props.saveAsNewTransaction,
							})(<Checkbox onChange={this.handleCheck}>Save as new transaction setting.</Checkbox>)}
						</FormItem> : <FormItem />
					}
				</Spin>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		saveAsNewTransaction: state.coinTransactionSettings.saveAsNewTransaction,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		goTo(url) {
			return () => {
				dispatch(push(url));
			}
		},
		setSaveAsNewTransaction(saveAsNew) {
			dispatch(setSaveAsNewTransaction(saveAsNew));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionSettings);
