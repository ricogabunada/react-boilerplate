import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Input,
	Select,
	Form,
	notification,
} from 'antd';
import CommonModal from '../../shared-components/modal';
import DepartmentForm from './form';
import {
	addDepartment,
	updateDepartment,
} from '../../reducers/departments/resources';

const openNotificationWithIcon = (type, title, message) => {
	notification[type]({
		message: title,
		description: message,
	});
};

class Department extends Component {
	componentWillMount () {
	}

	handleOnOk = () => {
		const form = this.formRef.props.form;
		const departmentDetails = this.props.departmentDetails;

		form.validateFields((err, values) => {
			let body = [];

			if (err) {
				return;
			}

			if(Object.keys(departmentDetails).length) {
				updateDepartment(departmentDetails.key, values)
					.then(res => {
						openNotificationWithIcon(
							'success',
							'Success',
							'Department successfully updated.'
						);
						this.props.getDepartments(this.props.currentPage, 25);
						this.props.getDepartment(departmentDetails.key);
					});
				return form.resetFields();
			}

			addDepartment(values)
				.then(res => {
					openNotificationWithIcon(
						'success',
						'Success',
						'Department successfully added.'
					);
					this.props.getDepartments(this.props.currentPage, 25);
				});
			return form.resetFields();
		});
	}

	handleOnCancel = () => {
		const form = this.formRef.props.form;
		console.log('cancelled');
		form.resetFields();
	}

	saveFormRef = (formRef) => {
		this.formRef = formRef;
	}

	render() {

		return (
			<div>
				<DepartmentForm
					wrappedComponentRef={this.saveFormRef}
					visible={this.props.visible}
					departmentDetails={this.props.departmentDetails}
					header={this.props.header}
					resetVisible={this.props.resetVisible}
					onCreate={this.handleOnOk}
					onCancel={this.handleOnCancel}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Department);
