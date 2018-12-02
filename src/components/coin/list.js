import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Row,
	Table,
	Divider,
	Button,
	Icon,
	Dropdown,
	Menu,
	Modal,
	notification
} from 'antd';
import './index.css';
import {
	deleteCoin,
	updateCoin,
	activateCoin,
	generateAPIKey
} from '../../reducers/coins/resources';

import CoinModal from './modal';
import Config from '../../config';

const Confirm = Modal.confirm;

class CoinList extends Component {
	componentWillMount() {
		this.setState({
			header: '',
			action: 'add',
			selectedRowKeys: [],
			showModal: false,
			showConfirmationModal: false,
			coin: this.props.coin,
			coins: this.props.coins,
            pagination: this.props.pagination,
			loadCoins: this.props.loadCoins,
			loadCoinDetails: this.props.loadCoinDetails,
		});

		this.columns = [{
                title: 'Name',
                key: 'name',
                render: (text, record) => (
                    <span>
                        <img className={'coin'} src={record.logo ? record.logo_url : Config.defaultLogo} width="50" height="50"/>
						&nbsp; <a href={record.website} target={'_blank'}> {record.name} ({record.abbreviation})</a>
                    </span>
                )
			}, {
			    title: 'Email',
                dataIndex: 'company_email'
			}, {
			    title: 'Contact Person',
                key: 'contact_person',
                render: (text, record) => (
                    <span> {record.first_name} {record.last_name} </span>
                )
			}, {
			    title: 'Email (Contact Person)',
                dataIndex: 'email',
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
									style={{display: record.is_deleted ? 'none' : 'block'}}
									onClick={this.showConfirmationModal(record.is_verified ? 'unverify' : 'verify', record)}
									key={record.is_verified ? 'unverify-' + record.id : 'verify-' + record.id}>
									<Icon type={record.is_verified ? 'close' : 'check'}/> { record.is_verified ? 'Unverify' : 'Verify' }
								</Menu.Item>
								<Menu.Item
									style={{display: record.is_deleted ? 'none' : 'block'}}
									onClick={this.showEditCoinForm('edit', record)}
									key={'edit-' + record.id}>
									<Icon type="edit"/> Edit
								</Menu.Item>
								<Menu.Item
									onClick={this.showConfirmationModal(record.is_deleted ? 'activate' : 'deactivate', record)}
									key={record.is_deleted ? 'activate-' + record.id : 'deactivate-' + record.id}>
									<Icon type={record.is_deleted ? 'check' : 'delete'}/> { record.is_deleted ? 'Activate' : 'Deactivate' }
								</Menu.Item>
								<Menu.Item
									onClick={this.showConfirmationModal('generate', record)}
									key={'generate-' + record.id}>
									<Icon type='redo'/> Generate API Key
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
			coin: nextProps.coin,
			coins: nextProps.coins,
			pagination: nextProps.pagination,
			loadCoins: nextProps.loadCoins,
			loadCoinDetails: nextProps.loadCoinDetails,
		});
	}

	setStatusColor = (coin) => {
		let color = coin.is_verified ? '#27AE60' : '#BDC3C7';
		return coin.is_deleted == 1 ? '#C0392B' : color;
	}

	setDisplayStatus = (coin) => {
		if (!coin.is_deleted) {
			return coin.is_verified ? 'Verified' : 'Unverified';
		}

		return 'Deleted';
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
		const newPagination = {...this.state.pagination, ...{current: pagination.current}};
		this.props.getCoins({...newPagination});
	}	

	showEditCoinForm(action, coin) {
		return () => {
			this.setState({
				action: action,
				coin: coin,
				header: 'Edit Coin',
				showModal: true,
			});
		}
	}

	showModal(header, action) {
		return () => {
			this.setState({
				showModal: true,
				header: header,
				action: action,
				coin: {}
			});
		}
	}

	showConfirmationModal(action, coin) {
		return () => {
			let description = '';
			let data = {
				is_verified: coin.is_verified,
				is_deleted: coin.is_deleted
			}

			switch(action) {
				case 'verify':
					data = {...data, ...{is_verified: 1}};
					description = 'Coin has successfully been verified.';
					break;

				case 'unverify':
					data = {...data, ...{is_verified: 0}};
					description = 'Coin has successfully been unverified.';
					break;

				case 'deactivate':
					data = {...data, ...{is_deleted: 1}};
					description = 'Coin has successfully been deactivated.';
					break;

				case 'activate':
					data = {...data, ...{is_deleted: 0}};
					description = 'Coin has successfully been activated.';
					break;

				case 'generate':
					data = {};
					description = 'API Key has successfully been generated.';
					break;
				
				default:
					break;
			}

			const afterUpdate = description => {
				notification['success']({
					message: 'Success',
					description: description,
				});
				
				this.props.getCoins({...this.state.pagination});
			}

			const errorUpdate = () => {
				notification['error']({
					message: 'Error',
					description: 'There is something wrong. Please contact your system administrator.',
				});
			}

			const onOk = () => {
				if (action === 'deactivate') {
					return deleteCoin(coin.id)
							.then(() => {
								afterUpdate(description);
							})
							.catch(() => {
								errorUpdate();
							});
				}

				if (action === 'activate') {
					return activateCoin(coin.id)
							.then(() => {
								afterUpdate(description);
							})
							.catch(() => {
								errorUpdate();
							});
				}

				if(action === 'generate') {
					return generateAPIKey(coin.id)
						    .then(() => {
						    	afterUpdate(description);
						    })
						    .catch(() => {
						    	errorUpdate();
						    })
				}

				return updateCoin(data, coin.id)
						.then(() => {
							afterUpdate(description);
						})
						.catch(() => {
							errorUpdate();
						});
			}

			Confirm({
				title: `${action.charAt(0).toUpperCase() + action.slice(1)} coin`,
				content: `Do you want to ${action == 'generate' ? 'generate API Key': action + 'this coin'} ?`,
				okText: 'Yes',
				okType: action == 'unverify' || action == 'deactivate' ? 'danger' : '',
				cancelText: 'No',
				...{onOk}
			});

		}
	}

	resetShowModal = () => {
		this.setState({
			showModal: false,
		});
	}
 
	resetConfirmationModal = () => {
		this.setState({
			showConfirmationModal: false,
		});
	}

	render() {
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectedRowKeysChange,
		};

		return (
			<div>
				<h1>Coins</h1>  
				<Divider />
				
				<Row>
					<Button type="primary" onClick={this.showModal('Add Coin', 'add')}>
						<Icon type="plus-circle-o" />Add
					</Button>
				</Row>

				<Table
					style={{marginTop: 20}}
					columns={this.columns}
					dataSource={this.state.coins}
					rowSelection={rowSelection}
					onChange={this.handleTableChange}
					expandedRowRender={ record => <div>API Key: {(record.api_key || {}).api_key || ''}</div> }
					pagination={this.state.pagination}
					loading={this.state.loadCoins}/>
					
				<CoinModal
					width={850}
					style={{ top: 25 }}
					action={this.state.action}
					visible={this.state.showModal}
					pagination={this.state.pagination}
					header={this.state.header}
					coin={this.state.coin}
					getCoin={this.props.getCoin}
					getCoins={this.props.getCoins}
					setCoinDetails={this.props.setCoinDetails}
					getSustainableDevGoals={this.props.getSustainableDevGoals}
					loadCoinDetails={this.state.loadCoinDetails}
					resetVisible={this.resetShowModal} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CoinList);
