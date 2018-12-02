import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Row,
	Col,
	Table,
	Divider,
	Button,
	Form,
	Select,
	Input,
	InputNumber,
	Icon,
	Dropdown,
	Menu,
	Modal,
	notification,
} from 'antd';

import {
	getCoinPhase,
	getCoinPhases,
	updateCoinPhaseStartOrEnd,
} from '../../reducers/coin-competition/resources';
import {
	getCoinPhaseParticipant,
	getCoinPhaseParticipants,
} from '../../reducers/coin-competition-participants/resources';
import PhaseModal from './modal';
import CommonModal from '../../shared-components/modal/';
import './index.css';

import {
	setCoinCompPhaseDetails,
	setCoinCompPhaseList,
} from '../../reducers/coin-competition/actions';
import {
	setCoinCompParticipantDetails,
	setCoinCompParticipantList,
} from '../../reducers/coin-competition-participants/actions';

import CoinCompPhaseParticipants from '../coin-competition-participant'


const Confirm = Modal.confirm;
const openNotificationWithIcon = (type, title, message) => {
	notification[type]({
		message: title,
		description: message,
	});
};
const defaultOptions = {
	total: 0,
	current: 1,
	filters: {},
	relationships: ['coin'],
	pageSize: 25,
	orderBy: {
		created_at: 'Asc'
	},
};

class PhaseList extends Component {
	componentWillMount() {
		this.setState({
			header: '',
			header: '',
			phaseId: null,
			currentPage: 1,
			phases: [],
			pagination: {},
			phaseDetails: {},
			loading: false,
			showModal: false,
			showParticipantsModal: false,
		});

		defaultOptions.filters = {
			coin_id: `=|${this.props.match.params.coinId}`,
		};

		this.getCoinPhases(defaultOptions);

		this.columns = [{
			title: 'Phase #',
				dataIndex: 'phase_number',
			}, {
				title: 'Status',
				dataIndex: 'status',
			}, {
				title: 'Phase Start',
				dataIndex: 'coincomp_start',
			}, {
				title: 'Phase End',
				dataIndex: 'coincomp_end',
			}, {
				title: 'Timezone',
				dataIndex: 'timezone',
			}, {
				title: 'No. of Winners',
				dataIndex: 'no_winners',
			}, {
				title: 'Tweet ID',
				dataIndex: 'tweet_id',
			}, {
				title: '',
				key: 'action',
				render: (text, record) => (
					<div>
						<Dropdown overlay={(
							<Menu>
								<Menu.Item
									onClick={this.showModal('Edit', record)}
									key={record.key}>
									<Icon type="edit"/> Edit
								</Menu.Item>
								<Menu.Item
									onClick={this.showParticipants(record)}
									key={'participants-' + record.key}>
									<Icon type="plus"/> Participants
								</Menu.Item>
								<Menu.Item
									onClick={this.showConfirmationModal('Start', record)}
									key={'start-' + record.key}>
									<Icon type="check" /> Start
								</Menu.Item>
								<Menu.Item
									onClick={this.showConfirmationModal('End', record)}
									key={'end-' + record.key}>
									<Icon type="close" /> End
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

	componentWillReceiveProps(nextProps) {
		this.setState({
			pagination: nextProps.pagination,
		});
	}

	componentWillUnmount() {}

	selectRow = record => {
		const selectedRowKeys = [...this.state.selectedRowKeys];

		if (selectedRowKeys.indexOf(record.key) >= 0) {
			selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
		} else {
			selectedRowKeys.push(record.key);
		}

		this.setState({ selectedRowKeys });
	}

	getCoinPhases = (defaultOptions, cancellable) => {
		this.setState({ loading: true });

		getCoinPhases(defaultOptions, cancellable)
			.then(res =>{
				let phases = [];
				let pagination = {};

				this.setState({ loading: true });

				phases = res.data.map(val => {
					return {
						key: val.id,
						name: `${val.coin.name} ${val.coin.abbreviation}`,
						phase_number: val.phase_number,
						status: val.status,
						coincomp_start: val.coincomp_start,
						coincomp_end: val.coincomp_end,
						timezone: val.timezone,
						no_winners: val.no_winners,
						tweet_id: val.tweet_id,
					};
				});

				pagination = {
					total: res.total,
					pageSize: defaultOptions.pageSize,
				}

				this.setState({
					pagination: pagination,
					phases: phases,
					loading: false,
				});
			});
	}

	onSelectedRowKeysChange = selectedRowKeys => {
		this.setState({ selectedRowKeys });
	}

	handleTableChange = pagination => {
		const newPagination = {...defaultOptions, ...{current: pagination.current}};
		this.setState({currentPage: pagination.current});
		this.getCoinPhases({...newPagination});
	}

	showParticipants = record => {
		return () => {
			this.setState({
				phaseId: record.key,
				header: `Phase ${record.key} participants`,
				showParticipantsModal: true
			});
		}
	}

	getCoinPhase = id => {
		return getCoinPhase(id)
			.then(res => {
				this.setState({
					phaseDetails: res,
				});
			});
	}

	showModal = (header, phaseDetails) => {
		return () =>  {
			if(header === 'Edit') {
				return getCoinPhase(phaseDetails.key)
						.then(res => {
							this.setState({
								phaseDetails: res,
								showModal: true,
								header: header,
							});
						});;
			}

			this.setState({
				phaseDetails: phaseDetails,
				showModal: true,
				header: header,
			});
		}
	}

	showConfirmationModal = (header, phaseDetails) => {
		return () =>  {
			const onOk = () => {
				updateCoinPhaseStartOrEnd(phaseDetails.key, header.toLowerCase())
					.then(res => {
						openNotificationWithIcon(
							'success',
							'Success',
							`Phase successfully ${header.toLowerCase()}ed.`,
						);
						this.getCoinPhases(defaultOptions);
					})
					.catch(e => {
						openNotificationWithIcon(
							'error',
							'Error',
							e.data,
						);
					});
			};

			Confirm({
				title: `${header} Phase`,
				content: `Are you sure you want to ${header.toLowerCase()} Phase ${phaseDetails.phase_number}?`,
				okText: 'Yes',
				cancelText: 'No',
				okType: 'danger',
				...{onOk}
			});
		}
	}

	resetShowModal = () => {
		this.setState({
			showModal: false,
		});
	}

	resetShowParticipantsModal = () => {
		this.setState({
			showParticipantsModal: false,
		});
	}

	handleOnCancel = () => {
		// this.formRef.props.form.resetFields();
	}

	onCancelParticipantsModal = () => {}

	saveFormRef = (formRef) => {
		this.formRef = formRef;
	}

	render() {
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectedRowKeysChange,
		};

		return (
			<div className="container-dashboard">
				<Row style={{marginTop: 16}}>
					<div style={{ padding: 24, background: '#fff'}}>
						<h1>Coin Competition</h1>
						<Divider />
						<Row>
							<Button type="primary" onClick={this.showModal('Add New Phase', {})}>
								<Icon type="plus-circle-o" />Add
							</Button>
						</Row>
						<Table
							style={{marginTop: 20}}
							columns={this.columns}
							dataSource={this.state.phases}
							rowSelection={rowSelection}
							onChange={this.handleTableChange}
							pagination={this.state.pagination}
							loading={this.state.loading}/>
					</div>
				</Row>

				<CommonModal
					okText={'Add'}
					width={800}
					footer={false}
					header={this.state.header}
					onCancel={this.handleOnCancel}
					visible={this.state.showParticipantsModal}
					resetVisible={this.resetShowParticipantsModal}>
					<CoinCompPhaseParticipants
						coinId={this.props.match.params.coinId}
						phaseId={this.state.phaseId}/>
				</CommonModal>

				<PhaseModal
					getCoinPhases={this.getCoinPhases}
					getCoinPhase={this.getCoinPhase}
					defaultOptions={defaultOptions}
					currentPage={this.state.currentPage}
					phaseDetails={this.state.phaseDetails}
					coinId={this.props.match.params.coinId}
					header={this.state.header}
					visible={this.state.showModal}
					resetVisible={this.resetShowModal} />
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		// coin comp phases
		coinCompPhase: state.coinCompPhases.coinCompPhase,
		coinCompPhases: state.coinCompPhases.coinCompPhases,

		// coin comp phase participants
		coinCompParticipant: state.coinCompParticipants.coinCompParticipant,
		coinCompParticipants: state.coinCompParticipants.coinCompParticipants,
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

		// coin comp phase participants
		setCoinCompParticipantDetails(details) {
			dispatch(setCoinCompParticipantDetails(details));
		},
		setCoinCompParticipantList(list) {
			dispatch(setCoinCompParticipantList(list));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PhaseList);
