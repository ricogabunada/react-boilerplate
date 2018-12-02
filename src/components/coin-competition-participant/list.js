import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import Config from '../../config';

// Components
import {
	Table,
	Button,
	Icon,
	Modal,
	notification,
	Menu,
	Dropdown,
	Form,
	TreeSelect,
} from 'antd';
import {
	asyncContainer,
	Typeahead
} from 'react-bootstrap-typeahead';
import Cropper from 'react-cropper';
import CoinParticipants from './coinParticipants';
import CommonModal from '../../shared-components/modal/';

// reducers
import {
	setICODetails,
	setICOList,
} from '../../reducers/icos/actions';
import {
	setCoinDetails,
	setCoinList,
} from '../../reducers/coins/actions';
import {
	setCoinTransactionSettingDetails,
	setCoinTransactionSettingList,
} from '../../reducers/coin-transaction-settings/actions';
import {
	setCoinCompPhaseDetails,
	setCoinCompPhaseList,
} from '../../reducers/coin-competition/actions';
import {
	setCoinCompParticipantDetails,
	setCoinCompParticipantList
} from '../../reducers/coin-competition-participants/actions';
import {
	addCoinPhaseParticipant,
	forceDeleteCoinPhaseParticipant,
	updateCoinPhaseParticipantBanner,
} from '../../reducers/coin-competition-participants/resources'

const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
const Confirm = Modal.confirm;
const AsyncTypeahead = asyncContainer( Typeahead );
const defaultStates = {
	participant: {
		bannerModal: {
			header: '',
			mode: 'Add',
			show: false,
		},
	},
	participants: {
		isLoading: false,
		options: [],
		query: '',
	},
	banner: {
		display: true
	},
	newBanner: {
		src: '',
		newSrc: '',
		display: false,
		pixelCrop: {
			x: 0,
			y: 0,
			width: '100%',
			height: 400,
		},
		crop: {
			x: 0,
			y: 0,
			width: '100%',
			height: 400,
		},
	}
};

class CoinCompParticipantList extends Component {
	componentWillMount() {
		this.setState({
			header: '',
			action: 'add',
			selectedRowKeys: [],
			showModal: false,
			showConfirmationModal: false,
			...defaultStates
		});

		this._cache = {};

		this.columns = [{
				title: 'Coin Name',
				key: 'participant',
				render: (text, record) => (
					<span>
                        <img className={'coin'} src={record.coin.logo ? record.coin.logo_url : Config.defaultLogo} width="50" height="50"/>
						&nbsp; <a href={record.coin.website} target={'_blank'}> {record.coin.name} ({record.coin.abbreviation})</a>
                    </span>
				)
			}, {
				title: '',
				key: 'action',
				render: (text, record) => (
					<div>
						<Dropdown overlay={(
							<Menu>
								<Menu.Item
									onClick={this.showParticipantBanner(record, record.coin_banner ? 'Update' : 'Add')}
									key={`edit-${record.coin.id}`}>
									<Icon type="plus-circle-o"/> {record.coin_banner ? 'Update' : 'Add'} Banner
								</Menu.Item>
								<Menu.Item
									onClick={this.showConfirmationModal('delete', record)}
									key={`delete-${record.coin.id}`}>
									<Icon type={'delete'}/> Delete Participant
								</Menu.Item>
							</Menu>)}>
							<Button style={{ marginLeft: 8 }}>
								Action <Icon type="down" />
							</Button>
						</Dropdown>
					</div>
				),
			}];
	}

	selectRow = record => {
		const selectedRowKeys = [...this.state.selectedRowKeys];

		if (selectedRowKeys.indexOf(record.key) >= 0) {
			selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
		} else {
			selectedRowKeys.push(record.key);
		}

		this.setState({ selectedRowKeys });
	}

	onSelectedRowKeysChange = selectedRowKeys => {
		this.setState({ selectedRowKeys });
	}

	/**
	 * Hander table change
	 * @param {Object} pagination
	 * @return {Promise} get coin comp phase participants
	 */
	handleTableChange = pagination => {
		this.props.getCoinPhaseParticipants({...this.props.coinCompParticipants.pagination, ...{
			relationships: ['coin'],
			current: pagination.current,
			phase_id: this.props.phaseId
		}});
	}

	

	/**
	 * Show confirmation modal
	 * @param {String} action
	 * @param {Object} participant
	 * @return {Promise|void} force delete participant and display operation messages
	 */
	showConfirmationModal(action, participant) {
		return () => {
			const afterDelete = description => {
				notification['success']({
					message: 'Success',
					description: description,
				});
				
				this.props.getCoinPhaseParticipants({...this.props.coinCompParticipants.pagination});
			}

			const errorDelete = () => {
				notification['error']({
					message: 'Error',
					description: 'There is something wrong. Please contact your system administrator.',
				});
			}

			const onOk = () => {
				return forceDeleteCoinPhaseParticipant({
						phase_id: this.props.phaseId,
						participant_id: participant.id
					}).then(() => {
						afterDelete('Participant has successfully been deleted.');
					})
					.catch(() => {
						errorDelete();
					});
			}

			Confirm({
				title: `${action.charAt(0).toUpperCase() + action.slice(1)} participant`,
				content: `Do you want to ${action} ${participant.coin.name} (${participant.coin.abbreviation}) as participant?`,
				okText: 'Yes',
				okType: 'danger',
				cancelText: 'No',
				...{onOk}
			});
		}
	}

	/**
	 * On coin change
	 * @param {String} value coin name
	 * @return {void} update coin details
	 */
	onCoinChange = value => {
		let selectedCoin = _.filter(this.props.coins.list, item => {
			return value === `${item.name} (${item.abbreviation})`
		});
		
		this.props.setCoinDetails({
			details: selectedCoin.length > 0 ? selectedCoin[0] : {},
		});
	}

	/**
	 * On coin search
	 * @param {String} value coin name
	 * @return {Promise} get coins
	 */
	onCoinSearch = value => {
		let newFilters = this.props.coins.pagination.filters;

		if (value) {
			newFilters = {...newFilters, name: `like|${value}`}
		}

		this.props.setCoinList({list:[]});
		return this.props.getCoins({ ...this.props.coins.pagination,
			filters: newFilters
		}, true);
	}

	/**
	 * Format data
	 * @param {Object} data
	 * @param {String} field
	 * @return {number|string}
	 */
	formatData(data, field) {
		if (data && Object.keys(data).length > 0 && data[field]) {
			if (field === 'name') {
				return `${data.name} (${data.abbreviation})`;
			}

			return data[field];
		}

		return '';
	}

	/**
	 * Add participant
	 * @return void
	 */
	addCoinPhaseParticipant = () => {
		if (this.props.coin.details && Object.keys(this.props.coin.details).length > 0) {
			return addCoinPhaseParticipant({
				phase_id: this.props.phaseId,
				body: {
					phase_id: this.props.phaseId,
					coin_id: this.props.coin.details.id
				}
			}).then( () => {
				notification['success']({
					message: 'Success',
					description: 'Participant has successfully been added.',
				});

				this.props.setCoinDetails({details: {}});
				this.props.getCoinPhaseParticipants({...this.props.coinCompParticipants.pagination, ...{
					current: 1,
					orderBy: { created_at: 'Desc' }
				}});
			}).catch( err => {
				this.displayServerErrors(err);
			});
		}
	}

	/**
	 * Show participant's banner
	 * @param {Object} data
	 * @param {String} mode
	 * @return {void} show modal for managing participant's banner
	 */
	showParticipantBanner(data, mode) {
		return () => {
			this.props.setCoinCompParticipantDetails({...this.props.coinCompParticipant.details, details: data});
			this.setState({participant: {...this.state.participant, ...{
				bannerModal: {
					mode: mode,
					show: true,
					header: `Phase ${this.props.phaseId} - ${data.coin.name} (${data.coin.abbreviation}) Banner`
				},
			}}});
		}
	}

	/***
	 * Reset show banner modal
	 * @return {void} hide banner modal
	 */
	resetBannerModal = () => {}

	/**
	 * On cancel banner modal
	 * @return {void}
	 */
	onCancelBannerModal = () => {}

	/**
	 * On ok banner modal
	 * @return {void}
	 */
	onOkBannerModal = () => {
		if (this.props.coinCompParticipant.details && Object.keys(this.props.coinCompParticipant.details).length > 0) {
			return updateCoinPhaseParticipantBanner({
				phase_id: this.props.phaseId,
				participant_id: this.props.coinCompParticipant.details.id,
				body: {coin_banner: this.state.newBanner.src ? this.state.newBanner.src : null}
			}).then( res => {
				notification['success']({
					message: 'Success',
					description: `Banner has successfully been ${this.state.participant.bannerModal.mode.toLowerCase()}ed.`,
				});

				this.setState({
					banner: { display: true },
					newBanner: {...this.state.newBanner, display: false }
				});

				this.refs.bannerFile.value = '';
				this.props.setCoinCompParticipantDetails({details: res});
				this.props.getCoinPhaseParticipants({...this.props.coinCompParticipants.pagination});
			}).catch( err => {
				this.displayServerErrors(err);
			});
		}
	}
	
	/**
	 * On select file
	 * @param {Event} event
	 */
	onSelectFile = event => {
		if (event.target.files && event.target.files.length > 0) {
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				this.setState({
					banner: {...this.state.banner, ...{display: false}},
					newBanner: {...this.state.newBanner, ...{
						src: reader.result,
						display: true
					}}
				});
			}, false);

			reader.readAsDataURL(event.target.files[0]);
		}
	}

	/**
	 * Crop
	 * @return {void} crop image
	 */
	_crop = () => {}

	/**
	 * On after banner modal close
	 * @return {void}
	 */
	onAfterBannerModalClose = () => {
		this.setState({...defaultStates});
		this.refs.bannerFile.value = '';
	}

	/**
	 * Display server errors
	 * @param {Array|Object} errors
	 * @return {void} display error message/s
	 */
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

	render() {
		let participantBanner = Config.defaultLogo;
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectedRowKeysChange,
		};

		if (this.props.coinCompParticipant.details.coin_banner) {
			participantBanner = this.props.coinCompParticipant.details.banner_url;
		}

		return (
			<div>
				<div className="col-md-12 no-padding-left no-padding-right">
					<TreeSelect
						showSearch
						allowClear
						className="col-md-9 select-coin"
						dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
						placeholder="Please select coin name"
						onChange={this.onCoinChange}
						onSelect={this.onCoinChange}
						onSearch={this.onCoinSearch}
						value={this.formatData(this.props.coin.details, 'name')}>
						{this.props.coins.list.map((coin, index) => {
							return <TreeNode key={index}
											className="coin-name"
											title={`${coin.name} (${coin.abbreviation})`}
											value={`${coin.name} (${coin.abbreviation})`}/>
						})}
					</TreeSelect>
					<Button type="primary"
							className="col-md-2"
							onClick={this.addCoinPhaseParticipant}>
						<Icon type="plus-circle-o" /> Add
					</Button>
				</div>

				<Table
					style={{marginTop: 20}}
					columns={this.columns}
					rowSelection={rowSelection}
					onChange={this.handleTableChange}
					loading={this.props.coinCompParticipants.load}
					dataSource={this.props.coinCompParticipants.list}
					pagination={this.props.coinCompParticipants.pagination}/>

				<CommonModal
					width={800}
					header={this.state.participant.bannerModal.header}
					okText={this.state.participant.bannerModal.mode}
					onOk={this.onOkBannerModal}
					onCancel={this.onCancelBannerModal}
					visible={this.state.participant.bannerModal.show}
					resetVisible={this.resetBannerModal}
					onAfterClose={this.onAfterBannerModalClose}>
					{this.state.banner.display && (
						<div style={{ width: '100%', height: '400px', textAlign: 'center' }}>
							<img className={'coin'} style={{ maxWidth: '100%', maxHeight: '100%', margin: 'auto' }} src={participantBanner}/>
						</div>
					)}
					{this.state.newBanner.display &&
						this.state.newBanner.src && (
						<Cropper
							style={{
								width: '100%',
								height: '300px'
							}}
							ref='cropper'
							zoomable={false}
							movable={false}
							guides={false}
							autoCrop={false}
							dragMode={'none'}
							responsive={true}
							crop={this._crop}
							aspectRatio={1 / 1}
							cropBoxResizable={false}
							src={this.state.newBanner.src}/>
					)}
					<div style={{clear: 'both', overflow: 'hidden'}}>&nbsp;</div>
					<div style={{ textAlign: 'center' }}>
						<input type="file" onChange={this.onSelectFile} ref="bannerFile"/>
					</div>
					<div style={{clear: 'both', overflow: 'hidden'}}>&nbsp;</div>
				</CommonModal>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		// coin comp phases
		coinCompPhase: state.coinCompPhases.coinCompPhase,
		coinCompPhases: state.coinCompPhases.coinCompPhases,

		// coin comp phase participants
		coinCompParticipant: state.coinCompParticipants.coinCompParticipant,
		coinCompParticipants: state.coinCompParticipants.coinCompParticipants,

		// coin
		coin: state.coins.coin,
		coins: state.coins.coins,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		// coin comp phases
		setCoinCompPhaseDetails(details) {
			dispatch(setCoinCompPhaseDetails(details));
		},
		setCoinCompPhaseList(list) {
			dispatch(setCoinCompPhaseList(list));
		},

		// coin comp phase participant
		setCoinCompParticipantDetails(list) {
			dispatch(setCoinCompParticipantDetails(list));
		},
		setCoinCompParticipantList(list) {
			dispatch(setCoinCompParticipantList(list));
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

export default connect(mapStateToProps, mapDispatchToProps)(CoinCompParticipantList);
