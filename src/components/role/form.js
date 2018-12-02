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

const RoleForm = Form.create()(
	class extends React.Component {
		componentWillMount() {
			this.setState({
				permissions: [],
				permissionOptions: [],
			});
		}

		componentWillReceiveProps(nextProps) {
			if(nextProps.permissions.length) {
				let permissionOptions = nextProps.permissions.map(permission => {
					return <Option key={permission.key} value={permission.key}>
						{permission.name}
					</Option>;
				});

				this.setState({
					permissionOptions: permissionOptions,
				});
			}

			if(Object.keys(nextProps.roleDetails).length) {
				if(nextProps.roleDetails.permissions.length) {
					let permissions = nextProps.roleDetails.permissions;
					let data = [];

					permissions.map(val => {
						data.push(val.id);
					});

					this.setState({
						permissions: data,
					});
				}
			}
		}

		render() {
			const {
				visible,
				resetVisible,
				onCreate,
				onCancel,
				form,
				header,
			} = this.props;
			const { getFieldDecorator } = form;
			const formItemSize = {
				labelCol: {span: 6},
				wrapperCol: {span: 18}
			};

			return (
				<CommonModal
					visible={visible}
					resetVisible={resetVisible}
					onOk={onCreate}
					onCancel={onCancel}
					header={header}>
					<Form layout="vertical">
						<FormItem label="Role" {...formItemSize}>
							{getFieldDecorator('name', {
								rules: [{ required: true, message: 'Please input Role Name!' }],
								initialValue: (this.props.roleDetails || {}).name
							})(<Input/>)}
						</FormItem>
						<FormItem label="Permissions" {...formItemSize}>
							{getFieldDecorator('permissions', {
								rules: [{ required: true, message: 'Please select Permissions!' }],
								initialValue: this.state.permissions
							})(
								<Select
									mode="multiple"
									style={{ width: '100%' }}
									placeholder="Please select permissions">
									{this.state.permissionOptions}
								</Select>
							)}
						</FormItem>
					</Form>
				</CommonModal>
			);
		}
	}
);

export default RoleForm;
