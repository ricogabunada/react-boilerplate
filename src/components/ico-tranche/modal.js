import React, { Component } from 'react';
import { connect } from 'react-redux';

// helpers
import _ from 'lodash';
import moment from 'moment';

// resources
import {
    addICOTranche,
    updateICOTranche,
} from '../../reducers/ico-tranches/resources';
import {
    addCoinTransactionSetting,
    updateCoinTransactionSetting,
} from '../../reducers/coin-transaction-settings/resources';

// actions
import {
    setCoinTransactionSettingDetails
} from '../../reducers/coin-transaction-settings/actions';
import {
    setICOTrancheDetails
} from '../../reducers/ico-tranches/actions';

// components
import {
    Spin,
    Icon,
    notification,
} from 'antd';
import CommonModal from '../../shared-components/modal'
import ICOTrancheForm from './form';

class ICOTrancheModal extends Component {
    componentWillMount() {
        this.setState({modal: this.props.modal});
    }

    componentWillReceiveProps(nextProps) {
        this.setState({modal: nextProps.modal});
    }

    /**
     * Handle on ok
     * @return {Promise} add or update ICO Tranche and coin transaction setting details
     */
    handleOnOk = () => {
        const now = moment(new Date(), moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
        const form = this.formRef.props.form;

        form.validateFields((err, values) => {
            if (err) { return false; }

			let ICOTrancheValues = {
                name: values.name,
                ico_id: this.props.ICO.details.id,
                transaction_setting_id: this.props.ICOTranche.details.transaction_setting_id || null,
			};
            
			let coinTransactionSettingValues = {
				name: `${this.props.ICO.details.coin.name} ICO ${values.name} ${now}`,
				coin_id: this.props.ICO.details.coin.id,
				usd_price: parseFloat(values.usd_price),
				volume_sold: parseInt(values.volume_sold),
				volume_for_sale: parseInt(values.volume_for_sale),
				minimum_buy_in: parseFloat(this.props.ICO.details.minimum_buy_in),
			};

			if (this.props.action === 'Add') {
                return addCoinTransactionSetting(coinTransactionSettingValues)
                        .then(res => {
                            addICOTranche({...ICOTrancheValues, transaction_setting_id: res.id})
                                .then( res => {
                                    notification['success']({
                                        message: 'Success',
                                        description: 'ICO tranche has been successfully added.',
                                    });

                                    this.afterICOTrancheAdded();
                                }).catch( err => {
                                    this.displayServerErrors(err);
                                });
                        }).catch( err => {
                            this.displayServerErrors(err);
                        });
			}
            
            return updateCoinTransactionSetting(coinTransactionSettingValues, this.props.ICOTranche.details.transaction_setting_id)
                    .then(res => {
                        let coinTransactionSetting = res;
                        updateICOTranche(ICOTrancheValues, this.props.ICOTranche.details.id)
                            .then( res => {
                                notification['success']({
                                    message: 'Success',
                                    description: 'ICO tranche has been successfully updated.',
                                });
    
                                this.afterICOTrancheUpdated();
                            }).catch( err => {
                                this.displayServerErrors(err);
                                this.props.setICOTrancheDetails({
                                    details: {...this.props.ICOTranche.details,
                                        transaction_settings : {...this.props.ICOTranche.details.transaction_settings,
                                            ...coinTransactionSetting
                                        }
                                    },
                                });
                            });
                    }).catch( err => {
                        this.displayServerErrors(err);
                    });
		});
    }

    /**
     * Handle on cancel
     */
    handleOnCancel = () => {
        return () => {
		    this.formRef.props.form.resetFields();
        }
    }

    /**
     * On after close
     */
    onAfterClose = () => {
        this.formRef.props.form.resetFields();
    }

    /**
     * Save form reference
     * @param {Object} formRef
     * @return {void} set form reference
     */
    saveFormRef = (formRef) => {
		this.formRef = formRef;
    }
    
    /**
     * After ICO tranche added
     * reset some data and get new set of ICO Tranche 
     */
    afterICOTrancheAdded() {
        this.formRef.props.form.resetFields();
        this.props.setICOTrancheDetails({details: {}});
        this.props.getICOTranches({...this.props.ICOTranches.pagination});
	}

    /**
     * After ICO tranche updated
     * reset some data and get new set of ICO Tranche and updated selected ICO tranche data
     */
	afterICOTrancheUpdated() {
        this.props.getICOTranche(this.props.ICOTranche.details.id);
        this.props.getICOTranches({...this.props.ICOTranches.pagination});
	}

    /**
     * Display server errors
     * @param {Object} errors
     * @return {void} display error notification 
     */
    displayServerErrors = errors => {
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

    render () {
        return (
            <CommonModal
                onOk={this.handleOnOk} 
				width={this.props.width}
				style={this.props.style}
                onCancel={this.handleOnCancel}
				visible={this.state.modal.show}
				header={this.state.modal.header}
				onAfterClose={this.props.onAfterClose}
				resetVisible={this.props.onResetModal}>
				<Spin spinning={this.props.ICOTranche.load}>
					<ICOTrancheForm
                        coinId={this.state.coinId}
                        action={this.props.action}
						wrappedComponentRef={this.saveFormRef}
						getICOTranche={this.props.getICOTranche}
                        getICOTranches={this.props.getICOTranches}/>
				</Spin>
			</CommonModal>
        )
    }
}

const mapStateToProps = state => {
    return {
        // coin transaction settings
        coinTransactionSetting: state.coinTransactionSettings.coinTransactionSetting,
        coinTransactionSettings: state.coinTransactionSettings.coinTransactionSettings,

        // ico
		ICO: state.icos.ICO,
		ICOs: state.icos.ICOs,

        // ico tranches
		ICOTranche: state.icoTranches.ICOTranche,
		ICOTranches: state.icoTranches.ICOTranches,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setCoinTransactionSettingDetails(details) {
            dispatch(setCoinTransactionSettingDetails(details));
        },
        setICOTrancheDetails(details) {
            dispatch(setICOTrancheDetails(details));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ICOTrancheModal);