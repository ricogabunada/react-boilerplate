import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Icon,
	Spin,
	notification
} from 'antd';
import {
	addICO,
	updateICO
} from '../../reducers/icos/resources';
import {
	setICODetails,
	setICOList,
} from '../../reducers/icos/actions';
import {
	setCoinDetails,
	setCoinList,
} from '../../reducers/coins/actions';


import CommonModal from '../../shared-components/modal';
import ICOForm from './form';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';

const moment = extendMoment(Moment);

class ICOModal extends Component {
	componentWillMount () {
		this.setState({action: this.props.action});
	}

	componentWillReceiveProps(nextProps) {
		this.setState({action: nextProps.action});
	}

	handleOnOk = () => {
		const form = this.formRef.props.form;
		form.validateFields((err, values) => {
			if (err) { return false; }
			let ICOValues = {};

			let coin = _.filter(this.props.coins.list, item => {
				return `${item.name} (${item.abbreviation})` === values.coin_name
			});

			ICOValues = {
				coin_id: coin[0].id,
				timezone: values.timezone,
				usd_price: values.usd_price,
				minimum_buy_in: values.minimum_buy_in,
				volume_soft_cap: values.volume_soft_cap,
				volume_hard_cap: values.volume_hard_cap,
				volume_for_sale: values.volume_for_sale,
				end_date: moment(values.date_range[1]).format('MM/DD/YYYY').toString(),
				start_date: moment(values.date_range[0]).format('MM/DD/YYYY').toString(),
			};

			if (this.state.action === 'add') {
				return addICO(ICOValues)
						.then(res => {
							notification['success']({
								message: 'Success',
								description: 'ICO has successfully been added.',
							});

							this.afterICOAdded();
						}).catch( err => {
							this.displayServerErrors(err);
						});
			}

			return updateICO(ICOValues, this.props.ICO.details.id)
					.then(res => {
						notification['success']({
							message: 'Success',
							description: 'ICO has successfully been updated.',
						});

						this.afterICOUpdated();
					}).catch( err => {
						this.displayServerErrors(err);
					});
		});
	}

	afterICOAdded() {
		this.formRef.props.form.resetFields();
		this.props.setCoinDetails({details: {}});
		this.props.getICOs({...this.props.ICOs.pagination, ...{
			current: 1,
			orderBy: {created_at: 'Desc'}
		}});
	}

	afterICOUpdated() {
		this.formRef.props.form.resetFields();
		this.props.getICO(this.props.ICO.details.id);
		this.props.getICOs({...this.props.ICOs.pagination});
	}

	displayServerErrors(errors) {
		if (errors.data.reason) {
			if (Object.keys(errors.data.reason).length > 0 || errors.data.reason.length > 0) {
				let errorMessages = '';
				let counter = 1;
				_.each(errors.data.reason, (value) => {
					errorMessages += `${counter}. ${value[0]}\n`;
					counter++;
				});

				return notification.open({
					message: 'Errors',
					description: <div style={{whiteSpace: 'pre-wrap'}}>{errorMessages}</div>,
					duration: 0,
					icon: <Icon type={'exclamation-circle'}/>
				});
			}

			return notification['error']({
				message: 'Error',
				description: 'There is something wrong. Please contact your system administrator.',
			});
		}
	}

	handleOnCancel = () => {
		this.formRef.props.form.resetFields();
		this.props.setCoinDetails({details: {}});
	}

	handleAfterClose = () => {
		this.setState({
			action: 'add',
			selectedICO: {},
		});
	}

	saveFormRef = (formRef) => {
		this.formRef = formRef;
	}

	render() {
		return (
			<CommonModal
				width={this.props.width}
				style={this.props.style}
				header={this.props.header}
				visible={this.props.visible}
				onOk={this.handleOnOk}
				onCancel={this.handleOnCancel}
				onAfterClose={this.handleAfterClose}
				resetVisible={this.props.resetVisible}>
				<Spin spinning={this.props.ICO.load}>
					<ICOForm
						action={this.props.action}
						getICO={this.props.getICO}
						getICOs={this.props.getICOs}
						getCoins={this.props.getCoins}
						selectedICO={this.props.selectedICO}
						wrappedComponentRef={this.saveFormRef}/>
				</Spin>
			</CommonModal>
		);
	}
}

const mapStateToProps = state => {
	return {
		// ico
		ICO: state.icos.ICO,
		ICOs: state.icos.ICOs,

		// coin
		coin: state.coins.coin,
		coins: state.coins.coins,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		// ico
		setICODetails(details) {
			dispatch(setICODetails(details));
		},
		setICOList(list) {
			dispatch(setICOList(list));
		},

		// coin
		setCoinDetails(details) {
			dispatch(setCoinDetails(details));
		},
		setCoinList(list) {
			dispatch(setCoinList(list));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ICOModal);
