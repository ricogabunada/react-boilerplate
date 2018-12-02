import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Input,
	Select,
	Spin,
	Form,
	Col,
	AutoComplete,
	TimePicker
} from 'antd';
import {
	setSustainableDevGoalDetails,
	setSustainableDevGoalList,
} from '../../reducers/sustainable-dev-goals/actions';

import _ from 'lodash';
import moment from 'moment';
import CountryCodes from '../../shared-components/form/phone-number/country-codes.json';

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

const phoneNumberCountryCodeFields = [
	'contact_no_country_code',
	'contact_no_secondary_country_code'
];

const bestTimeToCallFields = [
	'best_time_to_call_from',
	'best_time_to_call_to'
];

const companyRoles = [
	'VP/Director',
	'Marketing Manager',
	'Chief Engineer',
	'Analyst',
	'External Relations',
	'Network Admin / System Admin',
	'Community Member',
];

const CoinForm = Form.create()(
	class extends React.Component {
		componentWillMount() {
			this.setState({
				autoCompleteResult: [],
				coin: this.props.coin,
				visible: this.props.visible,
			});
		}
		componentWillReceiveProps(nextProps) {
			this.setState({
				coin: nextProps.coin,
				visible: nextProps.visible,
			});
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

		formatData(data, field) {
			if (data && data[field]) {
				if (bestTimeToCallFields.indexOf(field) >= 0) {
					return moment(data[field], 'h:mm a');
				}

				if (field === 'goals' && data[field].length > 0) {
					return _.map(data[field], item => {return item.id.toString()});
				}

				return data[field];
			}

			if (phoneNumberCountryCodeFields.indexOf(field) >= 0) {
				return CountryCodes[0].dial_code;
			}

			if (field === 'company_role') {
				return companyRoles.indexOf(data[field]) >= 0 ? data[field] : '';
			}

			if (field === 'best_time_to_call_from') {
				return moment('00:00 a', 'h:mm a');
			}

			if (field === 'best_time_to_call_to') {
				return moment('11:59 p', 'h:mm a');
			}

			return field === 'goals' ? [] : '';
		}

		render() {
			const { getFieldDecorator } = this.props.form;
			const { autoCompleteResult } = this.state;
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

			// phone country codes
			let newCountryCodes = [];
			CountryCodes.map((item) => {
				let inArray = newCountryCodes.indexOf(parseInt(item.dial_code));
				if (inArray < 0) {
					newCountryCodes.push(parseInt(item.dial_code));
				}
			});

			newCountryCodes.sort();
			const countryCodes = newCountryCodes.map((item, index) =>
				<Option key={index} value={'+' + item}>+{item}</Option>
			);
			const countryCodeOptions = <Select style={{ width: 100 }}>{countryCodes}</Select>;

			// website
			const websiteOptions = autoCompleteResult.map(website => (
				<AutoCompleteOption key={website}>{website}</AutoCompleteOption>
			));

			// company roles
			const companyRoleOptions = companyRoles.map((item, index) =>
				<Option key={index} value={item}> {item} </Option>
			);
			const companyRolesSelection = <Select>{companyRoleOptions}</Select>;

			// rules
			const urlPattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

			const rules = {
				socialMediaPages: [{
					pattern: urlPattern,
					message: 'Please input a valid url.'
				}, {
					max: 255,
					message: 'Maximum character length is 255.'
				}]
			};

			return (
				<Form layout="horizontal">
					<FormItem label="Email address" {...formItemSize}>
						{getFieldDecorator('email', {
							rules: [{
								required: true,
								message: 'Please input Email.'
							}, {
								type: 'email',
								message: 'Please input valid email.'
							}, {
								max: 255,
								message: 'Maximum character length is 255.'
							}],
							initialValue: this.formatData(this.state.coin, 'email')
						})(<Input />)}
					</FormItem>
					<FormItem label="First name" {...formItemSize}>
						{getFieldDecorator('first_name', {
							rules: [{
								required: true,
								message: 'Please input first name.'
							}, {
								max: 255,
								message: 'Maximum character length is 255.'
							}],
							initialValue: this.formatData(this.state.coin, 'first_name')
						})(<Input />)}
					</FormItem>
					<FormItem label="Last name" {...formItemSize}>
						{getFieldDecorator('last_name', {
							rules: [{
								required: true,
								message: 'Please input last name.'
							}, {
								max: 255,
								message: 'Maximum character length is 255.'
							}],
							initialValue: this.formatData(this.state.coin, 'last_name')
						})(<Input />)}
					</FormItem>
					<FormItem label="Contact number" {...formItemSize}>
						{getFieldDecorator('contact_no', {
							rules: [{
								required: true,
								message: 'Please input contact number.',
							}, {
								max: 255,
								message: 'Maximum character length is 255.'
							}],
							initialValue: this.formatData(this.state.coin, 'contact_no')
						})(<Input addonBefore={
								getFieldDecorator('contact_no_country_code', {
									rules: [{
										required: true,
										message: 'Please input contact number country code.',
									}, {
										max: 10,
										message: 'Maximum character length is 10.'
									}],
									initialValue: this.formatData(this.state.coin, 'contact_no_country_code'),
								})(countryCodeOptions)} />)}
					</FormItem>
					<FormItem label="Company email address" {...formItemSize}>
						{getFieldDecorator('company_email', {
							rules: [{
								required: true,
								message: 'Please input company email address.'
							}, {
								type: 'email',
								message: 'Please input valid email address.'
							}, {
								max: 255,
								message: 'Maximum character length is 255.'
							}],
							initialValue: this.formatData(this.state.coin, 'company_email')
						})(<Input />)}
					</FormItem>
					<FormItem label="Contact number (secondary)" {...formItemSize}>
						{getFieldDecorator('contact_no_secondary', {
							initialValue: this.formatData(this.state.coin, 'contact_no_secondary')
						})(<Input addonBefore={
								getFieldDecorator('contact_no_secondary_country_code', {
									rules: [{
										required: true,
										message: 'Please input secondary contact number country code.',
									}, {
										max: 10,
										message: 'Maximum character length is 10.'
									}],
									initialValue: this.formatData(this.state.coin, 'contact_no_secondary_country_code'),
								})(countryCodeOptions)} />)}
					</FormItem>
					<FormItem label="Coin name" {...formItemSize}>
						{getFieldDecorator('name', {
							rules: [{
								required: true,
								message: 'Please input coin name.'
							}, {
								max: 255,
								message: 'Maximum character length is 255.'
							}],
							initialValue: this.formatData(this.state.coin, 'name')
						})(<Input />)}
					</FormItem>
					<FormItem label="Coin abbreviation" {...formItemSize}>
						{getFieldDecorator('abbreviation', {
							rules: [{
								required: true,
								message: 'Please input coin abbreviation.'
							}, {
								max: 255,
								message: 'Maximum character length is 255.'
							}],
							initialValue: this.formatData(this.state.coin, 'abbreviation')
						})(<Input />)}
					</FormItem>
					<FormItem label="Website" {...formItemSize}>
						{getFieldDecorator('website', {
							rules: [{
								required: true,
								message: 'Please input coin website.'
							}, {
								pattern: urlPattern,
								message: 'Please input a valid url.'
							}, {
								max: 255,
								message: 'Maximum character length is 255.'
							}],
							initialValue: this.formatData(this.state.coin, 'website')
						})(
							<AutoComplete
								dataSource={websiteOptions}
								onChange={this.handleWebsiteChange} >
								<Input />
							</AutoComplete>
						)}
					</FormItem>
					<FormItem label="Role in the company" {...formItemSize}>
						{getFieldDecorator('company_role', {
							rules: [{
								required: true,
								message: 'Please input user\'s role in the company.'
							}, {
								max: 255,
								message: 'Maximum character length is 255.'
							}],
							initialValue: this.formatData(this.state.coin, 'company_role'),
						})(companyRolesSelection)}
					</FormItem>
					<FormItem label="Best time to call (EDT)" {...formItemSize}>
						<Col span={7}>
							<FormItem>
								{getFieldDecorator('best_time_to_call_from', {
									rules: [{
										required: true,
										message: 'Please input best time to call (from).'
									}],
									initialValue: this.formatData(this.state.coin, 'best_time_to_call_from')
								})(
									<TimePicker
										use12Hours
										format="h:mm a"
										placeholder="from"/>
								)}
							</FormItem>
						</Col>
						<Col span={2}>
							<span>&nbsp;-&nbsp;</span>
						</Col>
						<Col span={7}>
							<FormItem>
								{getFieldDecorator('best_time_to_call_to', {
									rules: [{
										required: true,
										message: 'Please input best time to call (to).'
									}],
									initialValue: this.formatData(this.state.coin, 'best_time_to_call_to')
								})(
									<TimePicker
										use12Hours
										format="h:mm a"
										placeholder="to"/>
								)}
							</FormItem>
						</Col>
					</FormItem>
					<FormItem label="Coin hastags (comma separated)" {...formItemSize}>
						{getFieldDecorator('hashtags', {
							rules: [{
								required: true,
								message: 'Please input coin hashtags.'
							}, {
								max: 255,
								message: 'Maximum character length is 255.'
							}],
							initialValue: this.formatData(this.state.coin, 'hashtags')
						})(<Input />)}
					</FormItem>
					<FormItem label="Twitter handle" {...formItemSize}>
						{getFieldDecorator('twitter_handle', {
							rules: [{
								required: true,
								message: 'Please input twitter handle.'
							},  {
								max: 255,
								message: 'Maximum character length is 255.'
							}],
							initialValue: this.formatData(this.state.coin, 'twitter_handle')
						})(<Input addonBefore={'@'} />)}
					</FormItem>
					<FormItem label="Facebook page" {...formItemSize}>
						{getFieldDecorator('facebook_page', {
							rules: rules.socialMediaPages,
							initialValue: this.formatData(this.state.coin, 'facebook_page')
						})(<Input />)}
					</FormItem>
					<FormItem label="LinkedIn page" {...formItemSize}>
						{getFieldDecorator('linkedin_page', {
							rules: rules.socialMediaPages,
							initialValue: this.formatData(this.state.coin, 'linkedin_page')
						})(<Input />)}
					</FormItem>
					<FormItem label="Telegram page" {...formItemSize}>
						{getFieldDecorator('telegram_page', {
							rules: rules.socialMediaPages,
							initialValue: this.formatData(this.state.coin, 'telegram_page')
						})(<Input />)}
					</FormItem>
					<FormItem label="Reddit page" {...formItemSize}>
						{getFieldDecorator('reddit_page', {
							rules: rules.socialMediaPages,
							initialValue: this.formatData(this.state.coin, 'reddit_page')
						})(<Input />)}
					</FormItem>
					<FormItem label="Youtube page" {...formItemSize}>
						{getFieldDecorator('youtube_page', {
							rules: rules.socialMediaPages,
							initialValue: this.formatData(this.state.coin, 'youtube_page')
						})(<Input />)}
					</FormItem>
					<FormItem label="Medium page" {...formItemSize}>
						{getFieldDecorator('medium_page', {
							rules: rules.socialMediaPages,
							initialValue: this.formatData(this.state.coin, 'medium_page')
						})(<Input />)}
					</FormItem>
					<FormItem label="Discord page" {...formItemSize}>
						{getFieldDecorator('discord_page', {
							rules: rules.socialMediaPages,
							initialValue: this.formatData(this.state.coin, 'discord_page')
						})(<Input />)}
					</FormItem>
					<FormItem label="Steemit page" {...formItemSize}>
						{getFieldDecorator('steemit_page', {
							rules: rules.socialMediaPages,
							initialValue: this.formatData(this.state.coin, 'steemit_page')
						})(<Input />)}
					</FormItem>
					<FormItem label="Sustainable Dev Goals" {...formItemSize}>
						{getFieldDecorator('goals', {
							rules: [{
								required: true,
								message: 'Please select sustainable goal\/s',
							}],
							initialValue: this.formatData(this.state.coin, 'goals')
						})(<Select
							mode="multiple"
							placeholder="Select sustainable goals"
							notFoundContent={this.props.sustainableDevGoals.load ? <Spin size="small" /> : null}
							style={{ width: '100%' }}>
								{this.props.sustainableDevGoals.list.map((item, index) =>
									<Option key={item.id}>{item.name}</Option>
								)}
						  </Select>)}
					</FormItem>
				</Form>
			);
		}
	}
);

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

export default connect(mapStateToProps, mapDispatchToProps)(CoinForm);
