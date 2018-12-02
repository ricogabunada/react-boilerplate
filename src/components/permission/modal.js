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
	addPermission,
	updatePermission,
} from '../../reducers/permissions/resources';

const openNotificationWithIcon = (type, title, message) => {
	notification[type]({
		message: title,
		description: message,
	});
};

class Permission extends Component {
	componentWillMount () {
	}

	handleOnOk = () => {
		const form = this.formRef.props.form;
		const permissionDetails = this.props.permissionDetails;

		form.validateFields((err, values) => {
			let body = [];

			if (err) {
				return;
			}

			if(Object.keys(permissionDetails).length) {
				updatePermission(permissionDetails.key, values)
					.then(res => {
						openNotificationWithIcon(
							'success',
							'Success',
							'Permission successfully updated.'
						);
						this.props.getPermissions(this.props.currentPage, 5);
						this.props.getPermission(permissionDetails.key);
					});
				return form.resetFields();
			}

			addPermission(values)
				.then(res => {
					openNotificationWithIcon(
						'success',
						'Success',
						'Permission successfully added.'
					);
					this.props.getPermissions(this.props.currentPage, 5);
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
					permissionDetails={this.props.permissionDetails}
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

export default connect(mapStateToProps, mapDispatchToProps)(Permission);
