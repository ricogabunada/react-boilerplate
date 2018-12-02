import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Input,
	Select,
	Form,
} from 'antd';
import CommonModal from '../../shared-components/modal';

const FormItem = Form.Item;
const Option = Select.Option;

const UserForm = Form.create()(
	class extends React.Component {
		componentWillMount() {
			this.setState({
				confirmDirty: false,
				roleOptions: [],
				roles: [],
			});
		}

		componentWillReceiveProps(nextProps) {
			if(nextProps.roles.length) {
				let roleOptions = nextProps.roles.map(role => {
					return <Option key={role.key} value={role.key}>
						{role.name}
					</Option>;
				});

				this.setState({
					roleOptions: roleOptions,
				});
			}

			if(Object.keys(nextProps.userDetails).length) {
				if(nextProps.userDetails.roles.length) {
					let roles = nextProps.userDetails.roles;
					let data = [];

					roles.map(val => {
						data.push(val.id);
					});

					this.setState({
						roles: data,
					});
				}
			} else {
				this.setState({
					roles: [],
				})
			}
		}

	handleConfirmBlur = (e) => {
		const value = e.target.value;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	}

	compareToFirstPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (value && value !== form.getFieldValue('password')) {
			callback('Two passwords that you enter is inconsistent!');
		} else {
			callback();
		}
	}

	validateToNextPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (value && this.state.confirmDirty) {
			form.validateFields(['confirm'], { force: true });
		}
		callback();
	}

		render() {
			const {
				visible,
				resetVisible,
				onCreate,
				onCancel,
				form,
				userDetails,
				header,
			} = this.props;
			const { getFieldDecorator } = form;
			const formItemSize = {
				labelCol: {span: 6},
				wrapperCol: {span: 18}
			};
			const passwordRequired = Object.keys(userDetails).length ? false : true;

			return (
				<CommonModal
					width={600}
					visible={visible}
					resetVisible={resetVisible}
					onOk={onCreate}
					onCancel={onCancel}
					header={header}>
					<Form layout="vertical">
						<FormItem label="Email" {...formItemSize}>
							{getFieldDecorator('email', {
								rules: [{ required: true, message: 'Please input Email!' }],
								initialValue: (userDetails || {}).email
							})(<Input />)}
						</FormItem>
						<FormItem label="Password" {...formItemSize}>
							{getFieldDecorator('password', {
								rules: [{
									required: passwordRequired, message: 'Please input Password!'
								}, {
									validator: this.validateToNextPassword,
								}],
							})(<Input type="password"/>)}
						</FormItem>
						<FormItem label="Confirm Password" {...formItemSize}>
							{getFieldDecorator('confirm', {
								rules: [{
									required: passwordRequired, message: 'Please confirm your password!',
								}, {
									validator: this.compareToFirstPassword,
								}],
							})(
							<Input type="password" onBlur={this.handleConfirmBlur} />
						  )}
						</FormItem>
						<FormItem label="Roles" {...formItemSize}>
							{getFieldDecorator('roles', {
								rules: [{ required: true, message: 'Please select Role!' }],
								initialValue: this.state.roles,
							})(
								<Select
									mode="multiple"
									style={{ width: '100%' }}
									placeholder="Please select roles.">
									{this.state.roleOptions}
								</Select>
							)}
						</FormItem>
					</Form>
				</CommonModal>
			);
		}
	}
);

export default UserForm;
