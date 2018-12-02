import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Input,
	Select,
	Form,
	notification,
} from 'antd';
import CommonModal from '../../shared-components/modal';
import PermissionForm from './form';
import {
	addRole,
	updateRole,
} from '../../reducers/roles/resources';

const openNotificationWithIcon = (type, title, message) => {
	notification[type]({
		message: title,
		description: message,
	});
};

class Role extends Component {
	componentWillMount () {
	}

	handleOnOk = () => {
		const form = this.formRef.props.form;
		const roleDetails = this.props.roleDetails;

		form.validateFields((err, values) => {
			let body = [];

			if (err) {
				return;
			}

			if(Object.keys(roleDetails).length) {
				updateRole(roleDetails.key, values)
					.then(res => {
						openNotificationWithIcon(
							'success',
							'Success',
							'Role successfully updated.'
						);
						this.props.getRoles(this.props.currentPage, 25);
						this.props.getRole(this.props.roleDetails.key);
					});
				return form.resetFields();
			}

			addRole(values)
				.then(res => {
					openNotificationWithIcon(
						'success',
						'Success',
						'Role successfully added.'
					);
					this.props.getRoles(this.props.currentPage, 25);
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
				<PermissionForm
					wrappedComponentRef={this.saveFormRef}
					visible={this.props.visible}
					roleDetails={this.props.roleDetails}
					permissions={this.props.permissions}
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

export default connect(mapStateToProps, mapDispatchToProps)(Role);
