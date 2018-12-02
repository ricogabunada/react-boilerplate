import React, { Component } from 'react';
import { connect } from 'react-redux';
import Config from '../../config'

// helpers
import {
    EditorState,
    ContentState,
} from 'draft-js';
import htmlToDraft from 'html-to-draftjs';

// components
import {
    Dropdown,
    Menu,
    Icon,
    Button,
    Divider,
    Row,
    Table,
    Modal,
    notification
} from 'antd';
import HighLeverageTaskModal from './modal';

// reducers
import {
    setCoinList,
    setCoinDetails,
} from '../../reducers/coins/actions';
import {
    setHighLeverageTaskList,
    setHighLeverageTaskDetails,
    setHighLeverageTaskNewDescription,
} from '../../reducers/high-leverage-tasks/actions';

import {
    deleteHighLeverageTask,
    activateHighLeverageTask,
} from '../../reducers/high-leverage-tasks/resources';

class HighLeverageTaskList extends Component {
    componentWillMount() {
        this.setState({
            action: 'add',
            selectedRowKeys: [],
            modal: {
                header: '',
                show: false,
            }
        });

        this.columns = [{
            title: 'Name',
            dataIndex: 'name',
        }, {
            title: 'Coin',
            key: 'coin',
            render: (text, record) => (
                <span>
                    <img className={'coin'} src={record.coin.logo ? record.coin.logo_url : Config.defaultLogo} width="50" height="50"/>
                    &nbsp; <a href={record.coin.website} target={'_blank'}> {record.coin.name} ({record.coin.abbreviation})</a>
                </span>
            )
        }, {
            title: 'Points',
            width: 100,
            dataIndex: 'points'
        }, {
            title: 'Type',
            width: 150,
            key: 'type',
            render: (text, record) => (
                <span>{this.formatData(record, 'type')}</span>
            )
        }, {
            title: 'Status',
            key: `status`,
            width: 100,
            render: (text, record) => (
                <span style={{color: record.is_deleted ? '#C0392B' : ''}}>
                    { record.is_deleted ? 'Deleted' : 'Active' }
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
                                onClick={this.showConfirmationModal('update', record)}
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
            )
        }];
    };

    /**
     * Format data
     * @param {Object} data
     * @param {String} field
     * @return {String|Number} 
     */
    formatData = (data, field) => {
        if (data && data[field] && data[field] !== 'undefined') {
            if (field === 'type') {
                var newData = data[field].split('_');
                return newData.join(' ');
            }

            return data[field];
        }

        return '';
    }
    
    /**
     * Show confirmation modal
     * @param {String} action
     * @param {Object} highLeverageTask
     * @return {void}
     */
    showConfirmationModal = (action, highLeverageTask) => {
        return () => {
            if (action === 'update') {
                const blocksFromHtml = htmlToDraft(highLeverageTask.description);
                const { contentBlocks, entityMap } = blocksFromHtml;
                const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
                const editorState = EditorState.createWithContent(contentState);
    
                this.props.setHighLeverageTaskNewDescription(editorState);
                this.props.setHighLeverageTaskDetails({details: highLeverageTask});
                this.props.setCoinDetails({details: highLeverageTask.coin});
    
                return this.setState({
                    action: 'update',
                    modal: {...this.state.modal,
                        header: `${action.charAt(0).toUpperCase() + action.slice(1)} task`,
                        show: true
                    }
                });
            }

            const afterUpdate = description => {
				notification['success']({
					message: 'Success',
					description: description,
				});
				
				this.props.getHighLeverageTasks({...this.props.highLeverageTasks.pagination});
			}

			const errorUpdate = () => {
				notification['error']({
					message: 'Error',
					description: 'There is something wrong. Please contact your system administrator.',
				});
			}

            const onOk = () => {
                if (action === 'activate') {
                    return activateHighLeverageTask(highLeverageTask.id)
                        .then(res => {
                            afterUpdate('Task successfully been activated.');
                        })
                        .catch(err => {
                            errorUpdate();
                        });
                }

                return deleteHighLeverageTask(highLeverageTask.id)
                        .then(res => {
                            afterUpdate('Task successfully been deactivated.');
                        })
                        .catch(err => {
                            errorUpdate();
                        });
            }
            
            Modal.confirm({
				title: `${action.charAt(0).toUpperCase() + action.slice(1)} task`,
				content: `Do you want to ${action} this task?`,
				okText: 'Yes',
				okType: action == 'deactivate' ? 'danger' : '',
				cancelText: 'No',
				onOk: onOk
			});
        }
    }

    /**
     * Show modal
     * @return {void}
     */
    showModal = (title, action) => {
        return () => {
            this.props.setHighLeverageTaskDetails({details: {}});
            this.props.setHighLeverageTaskNewDescription('');
            this.props.setCoinDetails({details: {}});
            this.setState({
                action: 'add',
                modal: {...this.state.modal,
                    header: title,
                    show: true
                }
            });
        }
    }

    /**
     * On selected row keys change
     * @param {Object} record
     * @return {void} set selected row keys
     */
    onSelectedRowKeysChange = record => {
		const selectedRowKeys = [...this.state.selectedRowKeys];

		if (selectedRowKeys.indexOf(record.key) >= 0) {
			selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
		} else {
			selectedRowKeys.push(record.key);
		}

		this.setState({ selectedRowKeys });
    }
    
    /**
     * Handle table change
     * @param {Object} pagination
     * @return {Promise} 
     */
    handleTableChange = pagination => {
		this.props.getHighLeverageTasks({...this.props.highLeverageTasks.pagination, current: pagination.current});
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

    render() {
        const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectedRowKeysChange,
        };
        
        return (
            <div>
				<h1>High Leverage Task</h1>  
				<Divider />
				
				<Row>
					<Button type="primary" onClick={this.showModal('Add High Leverage Task', 'add')}>
						<Icon type="plus-circle-o" />Add
					</Button>
				</Row>

				<Table
                    style={{marginTop: 20}}
                    dataSource={this.props.highLeverageTasks.list}
					columns={this.columns}
                    expandedRowRender={ record => <div dangerouslySetInnerHTML={{ __html: record.description }} /> }
					rowSelection={rowSelection}
					onChange={this.handleTableChange}
					pagination={this.props.highLeverageTasks.pagination}
					loading={this.props.highLeverageTasks.load}/>

				<HighLeverageTaskModal
                    width={800}
                    style={{ top: 25 }}
                    modal={this.state.modal}
                    action={this.state.action}
                    description={this.state.description}
                    onResetModal={this.onResetModal}
                    onAfterClose={this.onAfterClose}
                    getCoins={this.props.getCoins}
                    getHighLeverageTask={this.props.getHighLeverageTask}
                    getHighLeverageTasks={this.props.getHighLeverageTasks}/>
			</div>
        );
    }
}

const mapStateToProps = state => {
    return {
        // coins
        coins: state.coins.cons,

        // high leverage tasks
        highLeverageTask: state.highLeverageTasks.highLeverageTask,
        highLeverageTasks: state.highLeverageTasks.highLeverageTasks,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        // coins
        setCoinList(list) {
            dispatch(setCoinList(list));
        },
        setCoinDetails(details) {
            dispatch(setCoinDetails(details));
        },
        
        // high leverage tasks
        setHighLeverageTaskDetails(details) {
            dispatch(setHighLeverageTaskDetails(details));
        },
        setHighLeverageTaskList(list) {
            dispatch(setHighLeverageTaskList(list));
        },
        setHighLeverageTaskNewDescription(description) {
            dispatch(setHighLeverageTaskNewDescription(description));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HighLeverageTaskList);