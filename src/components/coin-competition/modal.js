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
} from '../../reducers/coin-competition/resources';
import {
	setSaveAsNewTransaction,
} from '../../reducers/coin-transaction-settings/actions';
import { addCoinPhaseSetting, } from '../../reducers/coin-competition-settings/resources';
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
			coinId: this.props.coinId,
			phaseDetails: this.props.phaseDetails,
		});
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			coinId: nextProps.coinId,
			phaseDetails: nextProps.phaseDetails,
		});
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.phaseDetails) {
			if(Object.keys(nextProps.phaseDetails).length > 0) {
				this.setState({
					phaseDetails: nextProps.phaseDetails,
				});
			}
		}
	}

	handleOnOk = () => {
		const form = this.formRef.props.form;
		const phaseDetails = this.state.phaseDetails;

		form.validateFields((err, values) => {
			if (err) {
				return;
			}

			let body = {
				tweet_id: values.tweet_id,
				timezone: values.timezone,
				no_winners: values.no_winners,
				phase_number: values.phase_number,
				isUpdate: false,
			};

			if(this.state.coinId) {
				body.coin_id = this.state.coinId;
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
				body.coincomp_start = moment(values.duration[0]).format("YYYY-MM-DD");
				body.coincomp_end = moment(values.duration[1]).format("YYYY-MM-DD");
			}

			body.phase_banner = defaultPhaseBanner;

			if(!values.saveNewTransaction && !values.saveNewPhase) {
				body.transaction_setting_id = values.transaction_setting_id;
				body.phase_settings_id = values.phase_settings_id;
			}

			/**
			 * Save as new phase
			 */
			if(values.saveNewPhase && !values.saveNewTransaction) {
				let phaseSettings = {
					coin_id: body.coin_id,
					settings_name: values.settings_name,
					max_points: values.max_points,
					min_points: values.min_points,
					high_leverage_max_points: values.high_leverage_max_points,
					social_share_max_points: values.social_share_max_points,
					social_follow_max_points: values.social_follow_max_points,
					social_share_points_multiplier: values.social_share_points_multiplier,
					social_follow_points_multiplier: values.social_follow_points_multiplier,
					congratulatory_event: values.congratulatory_event,
					leverage_task_event: values.leverage_task_event,
					thank_you_event: values.thank_you_event,
					welcome_email_event: values.welcome_email_event,
					dollar_points_multiplier: values.dollar_points_multiplier,
					mechanics_url: values.mechanics_url,
				};
				body.transaction_setting_id = values.transaction_setting_id;

				if(phaseDetails && Object.keys(phaseDetails).length) {
					body.isUpdate = true;
					body.phaseDetails = phaseDetails;
				}
				body.status = 'Pending';

				return this.addCoinPhaseAndPhaseSetting(phaseSettings, body);
			}

			/**
			 * Save as new transaction
			 */
			if(!values.saveNewPhase && values.saveNewTransaction) {
				let transactionSettings = {
					coin_id: body.coin_id,
					name: values.name,
					minimum_buy_in: values.minimum_buy_in,
					volume_for_sale: values.volume_for_sale,
					volume_sold: values.volume_sold,
					usd_price: values.usd_price,
				};
				body.phase_settings_id = values.phase_settings_id;

				if(phaseDetails && Object.keys(phaseDetails).length) {
					body.isUpdate = true;
					body.phaseDetails = phaseDetails;
				}
				body.status = 'Pending';

				return this.addCoinTransactionAndPhase(transactionSettings, body);
			}

			/**
			 * Save as new transaction and new phase
			 */
			if(values.saveNewPhase && values.saveNewTransaction) {
				let transactionSettings = {
					coin_id: body.coin_id,
					name: values.name,
					minimum_buy_in: values.minimum_buy_in,
					volume_for_sale: values.volume_for_sale,
					volume_sold: values.volume_sold,
					usd_price: values.usd_price,
				};
				let phaseSettings = {
					coin_id: body.coin_id,
					settings_name: values.settings_name,
					max_points: values.max_points,
					min_points: values.min_points,
					high_leverage_max_points: values.high_leverage_max_points,
					social_share_max_points: values.social_share_max_points,
					social_follow_max_points: values.social_follow_max_points,
					social_share_points_multiplier: values.social_share_points_multiplier,
					social_follow_points_multiplier: values.social_follow_points_multiplier,
					congratulatory_event: values.congratulatory_event,
					leverage_task_event: values.leverage_task_event,
					thank_you_event: values.thank_you_event,
					welcome_email_event: values.welcome_email_event,
					dollar_points_multiplier: values.dollar_points_multiplier,
					mechanics_url: values.mechanics_url,
				};
				body.phase_settings_id = values.phase_settings_id;

				return addCoinTransactionSetting(transactionSettings)
					.then(res => {
						body.transaction_setting_id = res.id;

						if(phaseDetails && Object.keys(phaseDetails).length) {
							body.isUpdate = true;
							body.phaseDetails = phaseDetails;
						}

						this.addCoinPhaseAndPhaseSetting(phaseSettings, body);
					});
			}

			if(phaseDetails && Object.keys(phaseDetails).length) {
				body.isUpdate = true;
				body.status = phaseDetails.status;

				return this.updateCoinPhase(body, phaseDetails.id);
			}
			
			body.status = 'Pending';
			this.addCoinPhase(body);
		});
	}

	addCoinPhaseAndPhaseSetting = (phaseSettings, body) => {
		addCoinPhaseSetting(phaseSettings)
			.then(res => {
				body.phase_settings_id = res.id;

				openNotificationWithIcon(
					'success',
					'Success',
					'Phase setting successfully added.'
				);

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

	addCoinTransactionAndPhase = (transactionSettings, body) => {
		addCoinTransactionSetting(transactionSettings)
			.then(res => {
				body.transaction_setting_id = res.id;

				openNotificationWithIcon(
					'success',
					'Success',
					'Transaction setting successfully added.'
				);

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
				const form = this.formRef.props.form;

				openNotificationWithIcon(
					'success',
					'Success',
					'Phase successfully added.'
				);
				this.state.fetchPhases(this.props.defaultOptions, false);
				form.resetFields();
				return this.props.setSaveAsNewTransaction(false);
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
				const form = this.formRef.props.form;

				openNotificationWithIcon(
					'success',
					'Success',
					'Phase successfully updated.'
				);
				this.state.fetchPhases(this.props.defaultOptions, false);
				this.props.getCoinPhase(id);
				form.resetFields();
				return this.props.setSaveAsNewTransaction(false);
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

		this.setState({
			phaseDetails: {},
		})
		this.props.setSaveAsNewTransaction(false);
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
					coinId={this.state.coinId}
					phaseDetails={this.state.phaseDetails}
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
	return {
		setSaveAsNewTransaction(saveAsNew) {
			dispatch(setSaveAsNewTransaction(saveAsNew));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CoinPhase);
