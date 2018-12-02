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

const DepartmentForm = Form.create()(
	class extends React.Component {
		render() {
			const {
				visible,
				resetVisible,
				onCreate,
				onCancel,
				form,
				departmentDetails,
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
						<FormItem label="Department" {...formItemSize}>
							{getFieldDecorator('name', {
								rules: [{ required: true, message: 'Please input Department!' }],
								initialValue: (departmentDetails || {}).name
							})(<Input />)}
						</FormItem>
						<FormItem label="Description" {...formItemSize}>
							{getFieldDecorator('description', {
								rules: [{ required: true, message: 'Please input Description!' }],
								initialValue: (departmentDetails || {}).description
							})(<Input />)}
						</FormItem>
					</Form>
				</CommonModal>
			);
		}
	}
);

export default DepartmentForm;
