import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Input,
	Select,
	Form,
	notification,
} from 'antd';
import CommonModal from '../../shared-components/modal';
import UserForm from './form';
import {
	addUser,
	updateUser,
} from '../../reducers/users/resources';

const openNotificationWithIcon = (type, title, message) => {
	notification[type]({
		message: title,
		description: message,
	});
};

class User extends Component {
	componentWillMount () {
		this.setState({
			userDetails: {},
		})
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.userDetails) {
			this.setState({
				userDetails: nextProps.userDetails,
			});
		}
	}

	handleOnOk = () => {
		const form = this.formRef.props.form;
		const userDetails = this.props.userDetails;

		form.validateFields((err, values) => {
			let body = [];

			if (err) {
				return;
			}

			if(Object.keys(userDetails).length) {
				// temporary since the user id is not returned from the api(login)
				values['updated_by'] = 1;

				return updateUser(userDetails.key, values)
					.then(res => {
						this.setState({
							userDetails: res,
						});
						openNotificationWithIcon(
							'success',
							'Success',
							'User successfully updated.'
						);
						this.props.getUsers(this.props.currentPage, 25);
						return form.resetFields();
					})
					.catch(e => {
						let errors = '';
						let counter = 1;

						Object.keys(e.data.reason).map(key => {
							errors += `${counter}. ${e.data.reason[key]}\n`;
							counter++;
						})

						return openNotificationWithIcon(
							'error',
							'Error',
							errors,
						);
					});
			}
			// temporary since the user id is not returned from the api(login)
			values['created_by'] = 1;

			return addUser(values)
				.then(res => {
					openNotificationWithIcon(
						'success',
						'Success',
						'User successfully added.'
					);
					this.props.getUsers(this.props.currentPage, 25);
					return form.resetFields();
				})
				.catch(e => {
					let errors = '';
					let counter = 1;

					Object.keys(e.data.reason).map(key => {
						errors += `${counter}. ${e.data.reason[key]}\n`;
						counter++;
					})

					return openNotificationWithIcon(
						'error',
						'Error',
						errors,
					);
				});
		});
	}

	handleOnCancel = () => {
		const form = this.formRef.props.form;
		this.setState({
			userDetails: {},
		});
		form.resetFields();
	}

	saveFormRef = (formRef) => {
		this.formRef = formRef;
	}

	render() {

		return (
			<div>
				<UserForm
					wrappedComponentRef={this.saveFormRef}
					visible={this.props.visible}
					userDetails={this.state.userDetails}
					roles={this.props.roles}
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

export default connect(mapStateToProps, mapDispatchToProps)(User);
