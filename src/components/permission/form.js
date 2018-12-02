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

const PermissionForm = Form.create()(
	class extends React.Component {
		render() {
			const {
				visible,
				resetVisible,
				onCreate,
				onCancel,
				form,
				permissionDetails,
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
						<FormItem label="Permission" {...formItemSize}>
							{getFieldDecorator('name', {
								rules: [{ required: true, message: 'Please input Permission!' }],
								initialValue: (permissionDetails || {}).name
							})(<Input />)}
						</FormItem>
						<FormItem label="Description" {...formItemSize}>
							{getFieldDecorator('description', {
								rules: [{ required: true, message: 'Please input Description!' }],
								initialValue: (permissionDetails || {}).description
							})(<Input />)}
						</FormItem>
					</Form>
				</CommonModal>
			);
		}
	}
);

export default PermissionForm;
