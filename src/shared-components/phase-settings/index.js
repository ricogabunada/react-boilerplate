import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
	Row,
	Col,
	Form,
	Checkbox,
	Select,
	Input,
	InputNumber,
	Icon,
	Dropdown,
	AutoComplete,
	notification,
} from 'antd';
import {
	getCoinPhaseSettings,
	getCoinPhaseSetting,
} from '../../reducers/coin-competition-settings/resources';

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const defaultOptions = {
	total: 0,
	current: 1,
	filters: {},
	orderBy: {
		settings_name: 'Desc'
	},
	pageSize: 1000,
};

class PhaseSettings extends Component {
	componentWillMount() {
		this.setState({
			saveAsNew: false,
			autoCompleteResult: [],
			coinId: '',
			phaseSettingOptions: [],
		});
	}

	componentDidMount() {
		if(this.props.coinId && this.props.phaseDetails) {
			defaultOptions.filters = {
				coin_id: `=|${this.props.coinId}`,
			};

			this.getCoinPhaseSettings();
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.coinId && nextProps.coinId !== this.state.coinId) {
			this.setState({
				coinId: nextProps.coinId,
			});

			defaultOptions.filters = {
				coin_id: `=|${nextProps.coinId}`,
			};

			this.getCoinPhaseSettings();
		}

		if(!nextProps.coinId) {
			this.setState({
				coinId: '',
				phaseSettingOptions: [],
			});
		}
	}

	componentWillUnmount() {
	}

	getCoinPhaseSettings = () => {
		getCoinPhaseSettings(defaultOptions, false)
			.then(res => {
				let phaseSettingOptions = [];

				phaseSettingOptions = res.data.map(val => {
					return <Option key={val.id} value={val.id}>{val.settings_name}</Option>
				});

				this.setState({
					phaseSettingOptions: phaseSettingOptions,
				});
			})
	}

	getCoinPhaseSetting = id => {
		getCoinPhaseSetting(id)
			.then(res => {
				this.props.form.setFieldsValue({
					max_points: res.max_points,
					min_points: res.min_points,
					high_leverage_max_points: res.high_leverage_max_points,
					social_share_max_points: res.social_share_max_points,
					social_follow_max_points: res.social_follow_max_points,
					social_share_points_multiplier: res.social_share_points_multiplier,
					social_follow_points_multiplier: res.social_follow_points_multiplier,
					dollar_points_multiplier: res.dollar_points_multiplier,
					congratulatory_event: res.congratulatory_event,
					leverage_task_event: res.leverage_task_event,
					thank_you_event: res.thank_you_event,
					welcome_email_event: res.welcome_email_event,
					mechanics_url: res.mechanics_url,
				});
			});
	}

	handleChange = value => {
		this.getCoinPhaseSetting(value);
	}

	handleWebsiteChange = (value) => {
		let autoCompleteResult;

		if (!value) {
			autoCompleteResult = [];
		} else {
			autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
		}
		this.setState({ autoCompleteResult });
	}

	handleCheck = e => {
		this.setState({
			saveAsNew: e.target.checked,
		});

		if(e.target.checked) {
			return this.props.form.setFieldsValue({
				max_points: null,
				min_points: null,
				high_leverage_max_points: null,
				social_share_max_points: null,
				social_follow_max_points: null,
				social_share_points_multiplier: null,
				social_follow_points_multiplier: null,
				dollar_points_multiplier: null,
				congratulatory_event: null,
				leverage_task_event: null,
				thank_you_event: null,
				welcome_email_event: null,
				mechanics_url: null,
			});
		}

		if(this.props.phaseDetails && this.props.phaseDetails.phase_settings_id) {
			this.getCoinPhaseSetting(this.props.phaseDetails.phase_settings_id);
		}
	}

	render() {
		const {
			form,
			formItemSize,
			phaseDetails,
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
		const { autoCompleteResult } = this.state;
		const websiteOptions = autoCompleteResult.map(website => (
			<AutoCompleteOption key={website}>{website}</AutoCompleteOption>
		));
		const urlPattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

		return (
			<div>
				{this.state.saveAsNew ? <FormItem label="Phase Name" {...formItemSize}>
					{getFieldDecorator('settings_name', {
						rules: [{ required: true, message: 'Please input Phase Name!' }],
					})(<Input type="text" />)}
				</FormItem> : <FormItem label="Phase Settings" {...formItemSize}>
					{getFieldDecorator('phase_settings_id', {
						rules: [{ required: true, message: 'Please select Phase Settings!' }],
						initialValue: (phaseDetails || {}).phase_settings_id,
					})(
						<Select
							showSearch
							placeholder="Select a phase setting"
							onChange={this.handleChange}>
							{this.state.phaseSettingOptions}
						</Select>
					)}
				</FormItem>}
				<FormItem label="Max Points" {...formItemSize}>
					{getFieldDecorator('max_points', {
						rules: [{ required: true, message: 'Please input Max Points!' }],
						initialValue: ((phaseDetails || {}).phase_setting || {}).max_points,
					})(<Input disabled={!this.state.saveAsNew} type="number"/>)}
				</FormItem>
				<FormItem label="Minimum Points" {...formItemSize}>
					{getFieldDecorator('min_points', {
						rules: [{ required: true, message: 'Please input Minimimum Points!' }],
						initialValue: ((phaseDetails || {}).phase_setting || {}).min_points,
					})(<Input disabled={!this.state.saveAsNew} type="number"/>)}
				</FormItem>
				<FormItem label="High Leverage Max Points" {...formItemSize}>
					{getFieldDecorator('high_leverage_max_points', {
						rules: [{ required: true, message: 'Please input High Leveage Max Points!' }],
						initialValue: ((phaseDetails || {}).phase_setting || {}).high_leverage_max_points,
					})(<Input disabled={!this.state.saveAsNew} type="number"/>)}
				</FormItem>
				<FormItem label="Social Share Max Points" {...formItemSize}>
					{getFieldDecorator('social_share_max_points', {
						rules: [{ required: true, message: 'Please input Social Share Max Points!' }],
						initialValue: ((phaseDetails || {}).phase_setting || {}).social_share_max_points,
					})(<Input disabled={!this.state.saveAsNew} type="number"/>)}
				</FormItem>
				<FormItem label="Social Follow Max Points" {...formItemSize}>
					{getFieldDecorator('social_follow_max_points', {
						rules: [{ required: true, message: 'Please input Social Follow Max Points!' }],
						initialValue: ((phaseDetails || {}).phase_setting || {}).social_follow_max_points,
					})(<Input disabled={!this.state.saveAsNew} type="number"/>)}
				</FormItem>
				<FormItem label="Social Share Points Multiplier" {...formItemSize}>
					{getFieldDecorator('social_share_points_multiplier', {
						rules: [{ required: true, message: 'Please input Social Share Points Multiplier!' }],
						initialValue: ((phaseDetails || {}).phase_setting || {}).social_share_points_multiplier,
					})(<Input disabled={!this.state.saveAsNew} type="number"/>)}
				</FormItem>
				<FormItem label="Social Follow Points Multiplier" {...formItemSize}>
					{getFieldDecorator('social_follow_points_multiplier', {
						rules: [{ required: true, message: 'Please input Social Share Points Multiplier!' }],
						initialValue: ((phaseDetails || {}).phase_setting || {}).social_follow_points_multiplier,
					})(<Input disabled={!this.state.saveAsNew} type="number"/>)}
				</FormItem>
				<FormItem label="Dollar Points Multiplier" {...formItemSize}>
					{getFieldDecorator('dollar_points_multiplier', {
						rules: [{ required: true, message: 'Please input Dollar Points Multiplier!' }],
						initialValue: ((phaseDetails || {}).phase_setting || {}).dollar_points_multiplier,
					})(<Input disabled={!this.state.saveAsNew} type="number"/>)}
				</FormItem>
				<FormItem label="Congratulatory Event" {...formItemSize}>
					{getFieldDecorator('congratulatory_event', {
						rules: [{ required: true, message: 'Please input Congratulatory Event!' }],
						initialValue: ((phaseDetails || {}).phase_setting || {}).congratulatory_event,
					})(<Input disabled={!this.state.saveAsNew} type="text"/>)}
				</FormItem>
				<FormItem label="Leverage Task Event" {...formItemSize}>
					{getFieldDecorator('leverage_task_event', {
						rules: [{ required: true, message: 'Please input Leverage Task Event!' }],
						initialValue: ((phaseDetails || {}).phase_setting || {}).leverage_task_event,
					})(<Input disabled={!this.state.saveAsNew} type="text"/>)}
				</FormItem>
				<FormItem label="Thank You Event" {...formItemSize}>
					{getFieldDecorator('thank_you_event', {
						rules: [{ required: true, message: 'Please input Thank You Event!' }],
						initialValue: ((phaseDetails || {}).phase_setting || {}).thank_you_event,
					})(<Input disabled={!this.state.saveAsNew} type="text"/>)}
				</FormItem>
				<FormItem label="Welcome Email Event" {...formItemSize}>
					{getFieldDecorator('welcome_email_event', {
						rules: [{ required: true, message: 'Please input Welcome Email Event!' }],
						initialValue: ((phaseDetails || {}).phase_setting || {}).welcome_email_event,
					})(<Input disabled={!this.state.saveAsNew} type="text"/>)}
				</FormItem>
				<FormItem label="Mechanics URL" {...formItemSize}>
					{getFieldDecorator('mechanics_url', {
						rules: [{
							required: true,
							message: 'Please input coin website.'
						}, {
							pattern: urlPattern,
							message: 'Please input a valid url. (e.g "https://example.com")'
						}, {
							max: 255,
							message: 'Maximum character length is 255.'
						}],
						initialValue: ((phaseDetails || {}).phase_setting || {}).mechanics_url,
					})(
						<AutoComplete
							disabled={!this.state.saveAsNew}
							dataSource={websiteOptions}
							onChange={this.handleWebsiteChange} >
							<Input />
						</AutoComplete>
					)}
				</FormItem>
				<FormItem {...tailFormItemLayout}>
					{getFieldDecorator('saveNewPhase', {
						valuePropName: 'checked',
						checked: this.state.saveAsNew,
						initialValue: this.state.saveAsNew,
					})(<Checkbox onChange={this.handleCheck}>Save as new phase setting.</Checkbox>)}
				</FormItem>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {
		goTo(url) {
			return () => {
				dispatch(push(url));
			}
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PhaseSettings);
