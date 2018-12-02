import React, { Component } from 'react';
import Cropper from 'react-cropper';
import { connect } from 'react-redux';
import {
	Icon,
	Spin,
	notification
} from 'antd';
import {
	addCoin,
	updateCoin
} from '../../reducers/coins/resources';

import CommonModal from '../../shared-components/modal';
import Config from '../../config';
import CoinForm from './form';
import moment from 'moment';
import _ from 'lodash';
import 'cropperjs/dist/cropper.css';

const defaultStates = {
	addOrUpdateCoin: false,
	logo: {display: true},
	newLogo: {
		src: '',
		newSrc: '',
		display: false,
		pixelCrop: {
			x: 0,
			y: 0,
			width: 100,
			height: 100,
		},
		crop: {
			x: 0,
			y: 0,
			width: 100,
			height: 100,
		},
	}
}

class Coin extends Component {
	componentWillMount () {
		this.setState({
			coin: this.props.coin,
			action: this.props.action,
			visible: this.props.visible,
			pagination: this.props.pagination,
			loadCoinDetails: this.props.loadCoinDetails,
			...defaultStates
		});
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			coin: nextProps.coin,
			action: nextProps.action,
			visible: nextProps.visible,
			pagination: nextProps.pagination,
			loadCoinDetails: nextProps.loadCoinDetails
		});
	}

	handleOnOk = () => {
		if (!this.state.loadCoinDetails && !this.state.addOrUpdateCoin) {
			const form = this.formRef.props.form;
			form.validateFields((err, values) => {
				if (err) { return false; }
				
				this.setState({addOrUpdateCoin: true});

				values = { ...values, ...{
					best_time_to_call_from: moment(values.best_time_to_call_from).format('h:mm a').toString(),
					best_time_to_call_to: moment(values.best_time_to_call_to).format('h:mm a').toString(),
					logo: this.state.newLogo.newSrc ? this.state.newLogo.newSrc : this.state.newLogo.src ? this.state.newLogo.src : null,
					is_verified: this.state.action == 'add' ? 1 : values.is_verified,
				}};

				if(!values.logo) {
					delete values['logo'];
				}

				if (this.state.action == 'add') {
					return addCoin(values)
							.then(res => {
								notification['success']({
									message: 'Success',
									description: 'Coin has successfully been added.',
								});

								this.afterCoinAdded();
							}).catch( err => {
								this.displayServerErrors(err);
							});
				}

				return updateCoin(values, this.state.coin.id)
						.then(res => {
							notification['success']({
								message: 'Success',
								description: 'Coin has successfully been updated.',
							});

							this.afterCoinUpdated();
						}).catch( err => {
							this.displayServerErrors(err);
						}); 
			});
		}
	}

	afterCoinAdded() {
		this.refs.logo.value = '';
		this.setState({...defaultStates});
		this.formRef.props.form.resetFields();
		this.props.getCoins({...this.state.pagination, ...{
			current: 1,
			relationships: ['goals'],
			orderBy: {
				created_at: 'Desc'
			}
		}});
	}

	afterCoinUpdated() {
		this.refs.logo.value = '';
		this.setState({...defaultStates});
		this.props.getCoin(this.state.coin.id);
		this.props.getCoins({...this.state.pagination, ...{
			current: 1,
			relationships: ['goals'],
			orderBy: {
				created_at: 'Desc'
			}
		}});
	}

	displayServerErrors(errors) {
		if (errors.data.reason) {
			this.setState({addOrUpdateCoin: false});

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
	}

	saveFormRef = (formRef) => {
		this.formRef = formRef;
	}

	onSelectFile = e => {
		if (e.target.files && e.target.files.length > 0) {
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				this.setState({
					logo: {...this.state.logo, ...{display: false}},
					newLogo: {...this.state.newLogo, ...{
						src: reader.result,
						display: true
					}}
				});
			}, false);

			reader.readAsDataURL(e.target.files[0]);
		}
	}

	_crop = () => {
		const dataUrl = this.refs.cropper.getCroppedCanvas({
			width: 300,
			height: 300,
			minWidth: 300,
			minHeight: 300,
			maxWidth: 300,
			maxHeight: 300,
			fillColor: '#fff',
			imageSmoothingEnabled: true,
			imageSmoothingQuality: 'high',
		}).toDataURL();

		let newLogo = {...this.state.newLogo, ...{newSrc: dataUrl}};
		this.setState({newLogo: newLogo});
	}

	handleAfterClose = () => {
		this.refs.logo.value = '';
		this.props.setCoinDetails({});
		this.setState({...defaultStates});
	}

	render() {
		return (
			<CommonModal
				width={this.props.width}
				style={this.props.style}
				header={this.props.header}
				visible={this.state.visible}
				onOk={this.handleOnOk}
				keyboard={false}
				onAfterClose={this.handleAfterClose}
				onCancel={this.handleOnCancel}
				resetVisible={this.props.resetVisible}>
				<Spin spinning={this.state.loadCoinDetails || this.state.addOrUpdateCoin}>
					<div style={{ width: '100%', textAlign: 'center',}}>
						{this.state.logo.display && (
							<img className={'coin'} width={200} height={200}
								src={this.state.coin.logo ? this.state.coin.logo_url : Config.defaultLogo}/>
						)}
						{this.state.newLogo.display &&
							this.state.newLogo.src && (
							<Cropper
								style={{
									width: '100%',
									height: '300px'
								}}
								ref='cropper'
								movable={true}
								guides={false}
								autoCrop={true}
								dragMode={'move'}
								responsive={true}
								crop={this._crop}
								aspectRatio={1 / 1}
								cropBoxResizable={false}
								src={this.state.newLogo.src}/>
						)}
						<div style={{clear: 'both', overflow: 'hidden'}}>&nbsp;</div>
						<input type="file" onChange={this.onSelectFile} ref="logo"/>
						<div style={{clear: 'both', overflow: 'hidden'}}>&nbsp;</div>
					</div>
					<CoinForm 
						coin={this.state.coin}
						wrappedComponentRef={this.saveFormRef}
						getSustainableDevGoals={this.getSustainableDevGoals} />
				</Spin>
			</CommonModal>
		);
	}
}
const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Coin);
