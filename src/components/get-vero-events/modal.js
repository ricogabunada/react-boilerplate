import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Input,
	Select,
	Form,
	notification,
} from 'antd';
import CommonModal from '../../shared-components/modal';
import GetVeroEventForm from './form';
import {
	addGetVeroEvent,
	updateGetVeroEvent,
} from '../../reducers/get-vero-events/resources';

const openNotificationWithIcon = (type, title, message) => {
	notification[type]({
		message: title,
		description: message,
	});
};

class GetVeroEvent extends Component {
	componentWillMount () {
		this.setState({
			getVeroEventDetails: {},
		})
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.getVeroEventDetails) {
			this.setState({
				getVeroEventDetails: nextProps.getVeroEventDetails,
			});
		}
	}

	handleOnOk = () => {
		const form = this.formRef.props.form;
		const getVeroEventDetails = this.props.getVeroEventDetails;

		form.validateFields((err, values) => {
			let body = {};

			if (err) {
				return;
			}

			if(Object.keys(getVeroEventDetails).length) {
				return updateGetVeroEvent(getVeroEventDetails.key, values)
					.then(res => {
						this.setState({
							getVeroEventDetails: res,
						});
						openNotificationWithIcon(
							'success',
							'Success',
							'GetVero Event successfully updated.'
						);
						this.props.getGetVeroEvents(this.props.currentPage, 25);
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

			return addGetVeroEvent(values)
				.then(res => {
					openNotificationWithIcon(
						'success',
						'Success',
						'GetVeroEvent successfully added.'
					);
					this.props.getGetVeroEvents(this.props.currentPage, 25);
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
			getVeroEventDetails: {},
		});
		form.resetFields();
	}

	saveFormRef = (formRef) => {
		this.formRef = formRef;
	}

	render() {

		return (
			<div>
				<GetVeroEventForm
					wrappedComponentRef={this.saveFormRef}
					visible={this.props.visible}
					getVeroEventDetails={this.state.getVeroEventDetails}
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

export default connect(mapStateToProps, mapDispatchToProps)(GetVeroEvent);
