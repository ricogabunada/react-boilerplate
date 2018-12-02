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
	Tag,
	notification,
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class Personal extends Component {
	componentWillMount() {
	}

	render() {
		const {
			form,
			formItemSize,
			personal,
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
		const isVerified = (personal || {}).personal_email_verified ? <Tag color="green">Verified</Tag>
			: <Tag color="red">Unverified</Tag>;

		return (
			<div>
				<FormItem label="Name" {...formItemSize}
					extra={(personal || {}).first_name + ' ' + (personal || {}).last_name}>
					{getFieldDecorator('name', {
						initialValue: (personal || {}).first_name
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="Email" {...formItemSize}
					extra={isVerified}>
					{getFieldDecorator('email', {
						initialValue: (personal || {}).email
					})(<div className="ant-form-extra">{(personal || {}).email}&nbsp;</div>)}
				</FormItem>
				<FormItem label="Phone" {...formItemSize}
					extra={(personal || {}).phone}>
					{getFieldDecorator('phone', {
						initialValue: (personal || {}).phone
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="Position" {...formItemSize}
					extra={(personal || {}).position}>
					{getFieldDecorator('position', {
						initialValue: (personal || {}).position
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

export default connect(mapStateToProps, mapDispatchToProps)(Personal);
