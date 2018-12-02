import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import moment from 'moment';
import {
	Row,
	Table,
	Divider,
	Button,
	Icon,
	Dropdown,
	Menu,
	Modal,
	notification,
} from 'antd';
import {
	setICODetails,
	setICOList,
} from '../../reducers/icos/actions';
import {
	setCoinDetails,
	setCoinList,
} from '../../reducers/coins/actions';
import {
	deleteICO,
	activateICO,
} from '../../reducers/icos/resources';

import ICOModal from './modal';
import Config from '../../config';

const Confirm = Modal.confirm;

class ICOList extends Component {
	componentWillMount() {
		this.setState({
			header: '',
			action: 'add',
			selectedICO: {},
			selectedRowKeys: [],
			showModal: false,
			showConfirmationModal: false,
		});

		this.columns = [{
                title: 'Coin Name',
				key: 'coin_name',
                render: (text, record) => (
                    <span>
                        <img className='coin' src={record.coin.logo ? `${Config.s3LogoPath}${record.coin.logo}` : Config.defaultLogo} width="50" height="50"/>
                        &nbsp;
						<a href="" onClick={this.props.goTo(`/icos/${record.key}`)}> 
							{record.coin.name} ({record.coin.abbreviation})
						</a>
                    </span>
                )
			}, {
			    title: 'Start Date',
				key: 'start_date',
				render: (text, record) => (
					<span>{this.formatDateDisplay(record.start_date)}</span>
				)
			}, {
			    title: 'End Date',
                key: 'end_date',
				render: (text, record) => (
					<span>{this.formatDateDisplay(record.end_date)}</span>
				)
			}, {
			    title: 'Status',
				key: `status`,
                render: (text, record) => (
                    <span style={{color: this.setStatusColor(record)}}>
                        { this.setDisplayStatus(record) }
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
									style={{'display': record.is_deleted ? 'none' : 'block'}}
									onClick={this.showEditForm('edit', record)}
									key={'edit-' + record.id}>
									<Icon type="edit"/> Edit
								</Menu.Item>
								<Menu.Item
									onClick={this.showConfirmationModal(record.is_deleted ? 'activate' : 'deactivate', record)}
									key={record.is_deleted ? 'activate-' + record.id : 'deactivate-' + record.id}>
									<Icon type={record.is_deleted ? 'check' : 'delete'}/> { record.is_deleted ? 'Activate' : 'Deactivate' }
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

	setStatusColor = ico => {
		const today = moment(new Date, 'MM/DD/YYYY');
		const start_date =  moment(new Date(ico.start_date), 'MM/DD/YYYY');
		const end_date =  moment(new Date(ico.end_date), 'MM/DD/YYYY');

		if (ico.is_deleted) {
			return '#C0392B';
		}

		if (today > start_date && today < end_date) {
			return '#27AE60';
		}

		if (today >= end_date) {
			return '#BDC3C7';
		}

		return '#2888cc';
	}

	setDisplayStatus = ico => {
		const today = moment(new Date, 'MM/DD/YYYY');
		const start_date =  moment(new Date(ico.start_date), 'MM/DD/YYYY');
		const end_date =  moment(new Date(ico.end_date), 'MM/DD/YYYY');

		if (ico.is_deleted) {
			return 'Deleted';
		}
		
		if (today > start_date && today < end_date) {
			return 'In Progress';
		}

		if (today >= end_date) {
			return 'Closed';
		}

		return 'Upcoming';
	}

	formatDateDisplay(date) {
		return moment(new Date(date)).format('MM-DD-YYYY');
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

	handleTableChange = pagination => {
		const newPagination = {...this.props.ICOs.pagination, ...{current: pagination.current}};
		this.props.getICOs({...newPagination});
	}	

	showEditForm(action, ICO) {
		return () => {
			this.setState({
				action: action,
				showModal: true,
				header: 'Edit ICO',
				selectedICO: ICO
			});

			this.props.setICODetails({
				load: false,
				details: {...ICO, ...{ 
					coin_name: `${ICO.coin.name} (${ICO.coin.abbreviation})`,
					date_range: [
						moment(new Date(ICO.start_date), 'MM/DD/YYYY'),
						moment(new Date(ICO.end_date), 'MM/DD/YYYY'),
					]}
				}
			});

			this.props.setCoinDetails({
				load: false,
				details: ICO.coin
			});
		}
	}

	showModal(header, action) {
		return () => {
			this.props.setICODetails({details: {}});
			this.props.setCoinDetails({details: {}});

			this.setState({
				action: action,
				header: header,
				showModal: true,
			});
		}
	}

	showConfirmationModal(action, ico) {
		return () => {
			let description = '';

			switch(action) {
				case 'deactivate':
					description = 'ICO has successfully been deactivated.';
					break;

				case 'activate':
					ico = {...ico, is_deleted: 0}
					description = 'ICO has successfully been activated.';
					break;
				
				default:
					break;
			}

			const afterUpdate = description => {
				notification['success']({
					message: 'Success',
					description: description,
				});

				this.props.setICOList({
					list: [],
					load:true
				});

				this.props.getICOs({...this.props.ICOs.pagination});
			}

			const errorUpdate = () => {
				notification['error']({
					message: 'Error',
					description: 'There is something wrong. Please contact your system administrator.',
				});
			}

			const onOk = () => {
				if (action === 'deactivate') {
					return deleteICO(ico.id)
							.then(res => {
								afterUpdate(description);
							})
							.catch(err => {
								errorUpdate();
							});
				}

				return activateICO(ico.id)
						.then(res => {
							afterUpdate(description);
						})
						.catch(err => {
							errorUpdate();
						});
			}

			Confirm({
				title: `${action.charAt(0).toUpperCase() + action.slice(1)} coin`,
				content: `Do you want to ${action} this ICO?`,
				okText: 'Yes',
				okType: action == 'deactivate' ? 'danger' : '',
				cancelText: 'No',
				...{onOk}
			});
		}
	}

	resetShowModal = () => {
		this.setState({showModal: false});
	}
 
	resetConfirmationModal = () => {
		this.setState({showConfirmationModal: false});
	}

	render() {
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectedRowKeysChange,
		};

		return (
			<div>
				<h1>ICO</h1>  
				<Divider />
				
				<Row>
					<Button type="primary" onClick={this.showModal('Add ICO', 'add')}>
						<Icon type="plus-circle-o" />Add
					</Button>
				</Row>

				<Table
					style={{marginTop: 20}}
					columns={this.columns}
					dataSource={this.props.ICOs.list}
					rowSelection={rowSelection}
					onChange={this.handleTableChange}
					pagination={this.props.ICOs.pagination}
					loading={this.props.ICOs.load}/>

				<ICOModal
					style={{ top: 25 }}
					width={640}
					action={this.state.action}	
					visible={this.state.showModal}
					header={this.state.header}
					selectedICO={this.state.selectedICO}
					resetVisible={this.resetShowModal}
					getICO={this.props.getICO}
					getICOs={this.props.getICOs}
					getCoins={this.props.getCoins}/>
			</div>
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

		// redirecting
		goTo(url) {
			return () => {
				dispatch(push(url));
			}
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ICOList);
