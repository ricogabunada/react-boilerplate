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
	notification,
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class AdditionalInformation extends Component {
	componentWillMount() {
	}

	render() {
		const {
			form,
			formItemSize,
			additionalInformation,
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
				<FormItem label="Whitepaper Links" {...formItemSize}
					extra={<a href={(additionalInformation || {}).coin_whitepaper} target="_blank">
						{(additionalInformation || {}).coin_whitepaper}</a>}>
					{getFieldDecorator('coin_whitepaper', {
						initialValue: (additionalInformation || {}).coin_whitepaper
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="Is Coin a Security Coin?" {...formItemSize}
					extra={(additionalInformation || {}).coin_security === 1 ? 'Yes' : 'No'}>
					{getFieldDecorator('coin_security', {
						initialValue: (additionalInformation || {}).coin_security
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="Coin Operating Protocol" {...formItemSize}
					extra={(additionalInformation || {}).coin_based}>
					{getFieldDecorator('coin_based', {
						initialValue: (additionalInformation || {}).coin_based
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
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

export default connect(mapStateToProps, mapDispatchToProps)(AdditionalInformation);
