import React, { Component } from 'react';
import { connect } from 'react-redux';
import Format from '../../utils/format';

// components
import {
	Row,
    Tag,
	Table,
	Divider,
	Button,
	Icon,
	Dropdown,
    Menu,
    Modal,
	notification,
} from 'antd';
import ICOTrancheModal from './modal';
 
// actions
import {
    setICOTrancheDetails,
} from '../../reducers/ico-tranches/actions';

// resources
import {
    deleteICOTranche,
    activateICOTranche,
    updateICOTrancheStatus
} from '../../reducers/ico-tranches/resources'

class ICOTrancheList extends Component {
    componentWillMount() {
		this.setState({
            modal: {
                header: '',
                show: false,
            },
            action: 'Add',
            saveAsNew: false,
            disablePage: true,
            selectedRowKeys: [],
            defaultTransactionName: '',
        });
        
        this.columns = [{
            title: 'Name',
            dataIndex: 'name',
        }, {
            title: 'Token Price USD',
            key: 'usd_price',
            render: (text, record) => (
                <span>{Format.number(record.transaction_settings.usd_price, '$', '', 4)}</span>
            )
        }, {
            title: 'Token in Tranche',
            key: 'volume_for_sale',
            render: (text, record) => (
                <span>{Format.number(record.transaction_settings.volume_for_sale, '', '', 0)}</span>
            )
        }, {
            title: 'Token Sold',
            key: 'volume_sold',
            render: (text, record) => (
                <span>{Format.number(record.transaction_settings.volume_sold, '', '', 0)}</span>
            )
        }, {
            title: 'Status',
            key: 'status',
            render: (text, record) => (
                <span>
                    <Tag color={record.status.toLowerCase() === 'finished' || record.is_deleted ? "red" : (record.status.toLowerCase() === 'on going' ? "green" : "gray")}>
                        {record.is_deleted ? 'Deactivated' : record.status}
                    </Tag>
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
                                onClick={this.showModal('Update', record)}
                                key={'edit-' + record.id}>
                                <Icon type="edit"/> Edit
                            </Menu.Item>
                            <Menu.Item
                                style={{'display': record.status === 'Pending' || (record.status === 'Finished' || record.is_deleted) ? 'none' : 'block'}}
                                onClick={this.showConfirmationModal('Pending', record)}
                                key={`pending-status` + record.id}>
                                <Icon type="edit"/> Pending
                            </Menu.Item>
                            <Menu.Item
                                style={{'display': record.status === 'On Going' || (record.status === 'Finished' || record.is_deleted) ? 'none' : 'block'}}
                                onClick={this.showConfirmationModal('Start', record)}
                                key={`start-status` + record.id}>
                                <Icon type="edit"/> Start
                            </Menu.Item>
                            <Menu.Item
                                style={{'display': record.status !== 'On Going' || record.is_deleted ? 'none' : 'block'}}
                                onClick={this.showConfirmationModal('End', record)}
                                key={`end-status` + record.id}>
                                <Icon type="edit"/> End
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

    componentWillReceiveProps (nextProps) {
        this.setState({ disablePage: !nextProps.ICO.details.hasOwnProperty('id')});
    }

    /**
     * Show modal
     * @param {String} action
     * @param {object} record
     * @return {void} execute process
     */
    showModal = (action = 'Add', record = {}) => {
        return () => {
            this.props.setICOTrancheDetails({details: record});
            return this.setState({
                action: action,
                modal: {
                    header: `${action} Tranche`,
                    show: true,
                }
            });
        }
    }

    /**
     * Show confirmation modal
     * @param {String} action 
     * @param {object} icoTranche 
     */
    showConfirmationModal(action, icoTranche) {
		return () => {
            let description = '';
            
			const afterUpdate = description => {
				notification['success']({
					message: 'Success',
					description: description,
				});

				this.props.getICOTranches({...this.props.ICOTranches.pagination});
			}

			const errorUpdate = (message = '') => {
				notification['error']({
					message: 'Error',
					description: message || 'There is something wrong. Please contact your system administrator.',
				});
			}

			const onOk = () => {
                switch(action) {
                    case 'deactivate':
                        description = 'ICO Tranche has successfully been deactivated.';
                        return deleteICOTranche(icoTranche.id)
							.then(res => {
								afterUpdate(description);
							})
							.catch(err => {
								errorUpdate(); 
                            });
                            
                        break;
    
                    case 'activate':
                        description = 'ICO Tranche has successfully been activated.';
                        return activateICOTranche(icoTranche.id)
                            .then(res => {
                                afterUpdate(description);
                            })
                            .catch(err => {
                                errorUpdate();
                            });

                        break;
                    
                    case 'Pending':
                    case 'Start':
                    case 'End':
                        let status =  action === 'Start' ? 'On Going' : action === 'End' ? 'Finished' : action;
                        description = 'ICO Tranche has successfully been updated.';
                        return updateICOTrancheStatus(status, icoTranche.id)
                            .then(res => {
                                afterUpdate(description);
                            })
                            .catch(err => {
                                if (err.status === 302) {
                                    return errorUpdate(err.data);
                                }
                                
                                errorUpdate();
                            });

                        break;
                    
                    default:
                        break;
                }
			}

			Modal.confirm({
				title: `${action.charAt(0).toUpperCase() + action.slice(1)} tranche`,
				content: `Do you want to ${action.toLowerCase()} this ICO Tranche?`,
				okText: 'Yes',
				okType: action === 'deactivate' ||  action === 'End' ? 'danger' : '',
				cancelText: 'No',
				...{onOk}
			});
		}
	}

    /**
     * On selected row key change
     * @param {Object} selectedRowKeys
     * @return {void} set state
     */
    onSelectedRowKeysChange = selectedRowKeys => {
		this.setState({ selectedRowKeys });
	}

    /**
     * Handle table change
     * @param {Object} pagination
     * @return {Promise} get new set of ICO Tranches
     */
	handleTableChange = pagination => {
        this.props.getICOTranches({...this.props.ICOTranches.pagination,
            current: pagination.current
        });
    }

    /**
     * Reset modal
     * @return {void} hide or remove modal
     */
    onResetModal = () => {
        return () => {
            this.setState({
                modal: {...this.state.modal,
                    header: '',
                    show: false
                }
            });
        }
    }

    /**
     * After close
     * @return {void} hide or remove modal
     */
    onAfterClose = () => {
        this.setState({
            modal: {...this.state.modal,
                header: '',
                show: false
            }
        });
    }

    render () {
        const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectedRowKeysChange,
        };

        return (
            <div>
				<h1>ICO Tranches</h1>  
				<Divider />
				
				<Row>
					<Button type="primary" disabled={this.state.disablePage} onClick={this.showModal('Add', {})}>
						<Icon type="plus-circle-o" />Add
					</Button>
				</Row>

				<Table
					columns={this.columns}
					style={{marginTop: 20}}
					rowSelection={rowSelection}
					onChange={this.handleTableChange}
					loading={this.props.ICOTranches.load}
					dataSource={this.props.ICOTranches.list}
					pagination={this.props.ICOTranches.pagination}/>

				<ICOTrancheModal
					width={640}
					style={{ top: 25 }}
                    modal={this.state.modal}
                    action={this.state.action}
                    onAfterClose={this.onAfterClose}
					onResetModal={this.onResetModal}
					getICOTranche={this.props.getICOTranche}
                    getICOTranches={this.props.getICOTranches}/>
			</div>
        )
    }
}

const mapStateToProps = state => {
    return {
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
        setICOTrancheDetails(details) {
            dispatch(setICOTrancheDetails(details));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ICOTrancheList);