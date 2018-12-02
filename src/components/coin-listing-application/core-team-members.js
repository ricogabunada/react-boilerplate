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
	Divider,
	notification,
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class CoreTeamMembers extends Component {
	componentWillMount() {
	}

	render() {
		const {
			form,
			formItemSize,
			coreTeamMembers,
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
		const dividerStyle = {
			width: '75%',
			margin: '24px auto'
		};
		const ceoIsVerified = (coreTeamMembers || {}).ceo_email_verified ? <Tag color="green">Verified</Tag>
			: <Tag color="red">Unverified</Tag>;
		const cmoIsVerified = (coreTeamMembers || {}).cmo_email_verified ? <Tag color="green">Verified</Tag>
			: <Tag color="red">Unverified</Tag>;
		const ctoIsVerified = (coreTeamMembers || {}).cto_email_verified ? <Tag color="green">Verified</Tag>
			: <Tag color="red">Unverified</Tag>;

		return (
			<div>
				<FormItem label="CEO Name" {...formItemSize}
					extra={(coreTeamMembers || {}).ceo_first_name + ' ' + (coreTeamMembers || {}).ceo_last_name}>
					{getFieldDecorator('ceo_first_name', {
						initialValue: (coreTeamMembers || {}).ceo_first_name
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="CEO Email" {...formItemSize}
					extra={ceoIsVerified}>
					{getFieldDecorator('ceo_first_name', {
						initialValue: (coreTeamMembers || {}).ceo_first_name
					})(<div className="ant-form-extra">{(coreTeamMembers || {}).ceo_email}&nbsp;</div>)}
				</FormItem>
				<FormItem label="CEO Phone" {...formItemSize}
					extra={(coreTeamMembers || {}).ceo_phone}>
					{getFieldDecorator('ceo_phone', {
						initialValue: (coreTeamMembers || {}).ceo_phone
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>

				<Divider style={dividerStyle}/>

				<FormItem label="CTO Name" {...formItemSize}
					extra={(coreTeamMembers || {}).cto_first_name + ' ' + (coreTeamMembers || {}).cto_last_name}>
					{getFieldDecorator('cto_first_name', {
						initialValue: (coreTeamMembers || {}).cto_first_name
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="CTO Email" {...formItemSize}
					extra={ceoIsVerified}>
					{getFieldDecorator('cto_first_name', {
						initialValue: (coreTeamMembers || {}).cto_first_name
					})(<div className="ant-form-extra">{(coreTeamMembers || {}).cto_email}&nbsp;</div>)}
				</FormItem>
				<FormItem label="CTO Phone" {...formItemSize}
					extra={(coreTeamMembers || {}).cto_phone}>
					{getFieldDecorator('cto_phone', {
						initialValue: (coreTeamMembers || {}).cto_phone
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>

				<Divider style={dividerStyle}/>

				<FormItem label="CMO Name" {...formItemSize}
					extra={(coreTeamMembers || {}).cmo_first_name + ' ' + (coreTeamMembers || {}).cmo_last_name}>
					{getFieldDecorator('cmo_first_name', {
						initialValue: (coreTeamMembers || {}).cmo_first_name
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="CMO Email" {...formItemSize}
					extra={ceoIsVerified}>
					{getFieldDecorator('cmo_first_name', {
						initialValue: (coreTeamMembers || {}).cmo_first_name
					})(<div className="ant-form-extra">{(coreTeamMembers || {}).cmo_email}&nbsp;</div>)}
				</FormItem>
				<FormItem label="CMO Phone" {...formItemSize}
					extra={(coreTeamMembers || {}).cmo_phone}>
					{getFieldDecorator('cmo_phone', {
						initialValue: (coreTeamMembers || {}).cmo_phone
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

export default connect(mapStateToProps, mapDispatchToProps)(CoreTeamMembers);
