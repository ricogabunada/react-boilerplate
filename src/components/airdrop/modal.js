import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Input,
	Select,
	Form,
	notification,
} from 'antd';
import moment from 'moment';
import CommonModal from '../../shared-components/modal';
import CoinPhaseForm from './form';
import {
	addCoinPhase,
	updateCoinPhase,
} from '../../reducers/airdrop/resources';
import { addCoinTransactionSetting, } from '../../reducers/coin-transaction-settings/resources';
import { defaultPhaseBanner } from '../../constants';

const openNotificationWithIcon = (type, title, message) => {
	notification[type]({
		message: title,
		description: message,
	});
};

class CoinPhase extends Component {
	componentWillMount () {
		this.setState({
			fetchPhases: () => {},
		});
	}

	handleOnOk = () => {
		const form = this.formRef.props.form;
		const phaseDetails = this.props.phaseDetails;

		form.validateFields((err, values) => {
			if (err) {
				return;
			}

			let body = {
				timezone: values.timezone,
				phase_number: values.phase_number,
				isUpdate: false,
			};

			if(this.props.coinId) {
				body.coin_id = this.props.coinId;
				this.setState({
					fetchPhases: this.props.getCoinPhases,
				});
			} else {
				body.coin_id = values.coin_id ? values.coin_id[0].id : null;
				this.setState({
					fetchPhases: this.props.getAllCoinPhases,
				});
			}

			if(values.duration.length) {
				body.airdrop_start = moment(values.duration[0]).format("YYYY-MM-DD");
				body.airdrop_end = moment(values.duration[1]).format("YYYY-MM-DD");
			}

			body.phase_banner = defaultPhaseBanner;
			body.status = 'Pending';

			if(!values.saveNewTransaction) {
				body.transaction_setting_id = values.transaction_setting_id;
			}

			/**
			 * Save as new transaction
			 */
			if(values.saveNewTransaction) {
				let transactionSettings = {
					coin_id: body.coin_id,
					name: values.name,
					minimum_buy_in: values.minimum_buy_in,
					volume_for_sale: values.volume_for_sale,
					volume_sold: values.volume_sold,
					usd_price: values.usd_price,
				};

				if(phaseDetails && Object.keys(phaseDetails).length) {
					body.isUpdate = true;
					body.phaseDetails = phaseDetails;
				}

				this.addCoinTransactionAndPhase(transactionSettings, body);
				return form.resetFields();
			}

			if(phaseDetails && Object.keys(phaseDetails).length) {
				body.isUpdate = true;

				this.updateCoinPhase(body, this.props.phaseDetails.id);
				return form.resetFields();
			}

			this.addCoinPhase(body);
			return form.resetFields();
		});
	}

	addCoinTransactionAndPhase = (transactionSettings, body) => {
		addCoinTransactionSetting(transactionSettings)
			.then(res => {
				body.transaction_setting_id = res.id;

				if(body.isUpdate) {
					return this.updateCoinPhase(body, this.props.phaseDetails.id);
				}

				this.addCoinPhase(body);
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

	addCoinPhase = body => {
		addCoinPhase(body)
			.then(res => {
				openNotificationWithIcon(
					'success',
					'Success',
					'Phase successfully added.'
				);
				this.state.fetchPhases(this.props.defaultOptions, false);
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

	updateCoinPhase = (body, id) => {
		updateCoinPhase(body, id)
			.then(res => {
				openNotificationWithIcon(
					'success',
					'Success',
					'Phase successfully updated.'
				);
				this.state.fetchPhases(this.props.defaultOptions, false);
				this.props.getCoinPhase(id);
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
				<CoinPhaseForm
					wrappedComponentRef={this.saveFormRef}
					visible={this.props.visible}
					phaseDetails={this.props.phaseDetails}
					header={this.props.header}
					resetVisible={this.props.resetVisible}
					coinId={this.props.coinId}
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

export default connect(mapStateToProps, mapDispatchToProps)(CoinPhase);
