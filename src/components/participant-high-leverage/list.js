import React, { Component } from 'react';
import { connect } from 'react-redux';

// components
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
	Tag
} from 'antd';
import ParticipantHighLeverageTaskModal from './modal';

// reducers
import {
	updateParticipantHighLeverageTasks
} from '../../reducers/participant-high-leverage-tasks/resources';
import './index.css';

const Confirm = Modal.confirm;

class ParticipantTaskList extends Component {

	componentWillMount() {
		this.setState({
			selectedRowKeys: [],
			pagination: {},
			currentPage: 1,
			participantTasks: [],
			action: 'add',
			modal: {
				show: false,
				header: '',
			},
		});

		this.columns = [
			{
				title: 'Phase Number',
				dataIndex: 'phase_participant.phase.phase_number',
			},
			{
				title: 'Task',
				dataIndex: 'leverage_task.name',
			}, {
				title: 'Participant',
				dataIndex: 'phase_participant.coin.name'
			}, {
				title: 'URL',
				dataIndex: 'url',
				render: url => (
					<a href={url} target="_blank">{url}</a>
				)
			}, {
				title: 'Status',
				dataIndex: 'status',
				render: status => (
					<span>
						<Tag color={status=='approved' ? "green":(status=='rejected' ? "red":"gray")}>{status}</Tag>
					</span>
				)
			}, {
				title: 'Points',
				dataIndex: 'points'
			}, {
				title: '',
				key: 'action',
				render: (text, record) => (
                    <div>
						<Dropdown overlay={(
							<Menu>
								<Menu.Item
									style={{display: record.is_deleted ? 'none' : 'block'}}
									onClick={this.showConfirmationModal((record.status == 'pending' || record.status == 'rejected') ? 'approved' : 'pending', record)}
									key={(record.status == 'pending' || record.status == 'rejected') ? 'approved-' + record.id : 'pending-' + record.id}>
									<Icon type={(record.status == 'pending' || record.status == 'rejected') ? 'check' : 'minus'}/> 
										{ (record.status == 'pending' || record.status == 'rejected') ? 'Approve' : 'Pending' }
								</Menu.Item>
								<Menu.Item
									style={{display: record.is_deleted ? 'none' : 'block'}}
									onClick={this.showConfirmationModal((record.status == 'approved' || record.status == 'pending') ? 'rejected' : 'pending', record)}
									key={(record.status == 'approved' || record.status == 'pending') ? 'rejected-' + record.id : 'pending-' + record.id}>
									<Icon type={(record.status == 'approved' || record.status == 'pending') ? 'close' : 'minus'}/> 
									{ (record.status == 'approved' || record.status == 'pending')  ? 'Reject' : 'Pending' }
								</Menu.Item>
							</Menu>)}>
							<Button style={{ marginLeft: 8 }}>
								Action <Icon type="down" />
							</Button>
						</Dropdown>
                    </div>
                ), 
			}
		];
	}

	componentWillReceiveProps(nextProps) {}

	/**
	 * Show modal
	 * @param {String} header
	 * @param {String} action
	 * @return {void} display modal
	 */
	showModal = (header, action) => {
		return () =>  {
			this.setState({
				action: action,
				modal: {
					show: true,
					header: header,
				}
			});
		}
	}

	showConfirmationModal = (status, task) => {
		return () => {
			
			let description = '';
			const data = {
				status: status
			};

			switch(status) {
				case 'pending':
					description = 'Task status is pending';
					break;
				case 'approved':
					description = 'Task status is approved';
					break;
				case 'rejected':
					description = 'Task status is rejected';
					break;
				default:
					break;
			}


			const afterUpdate = description => {
				notification['success']({
					message: 'Success',
					description: description,
				});

				this.props.getParticipantTasks({...this.props.participantTaskList.pagination})
			}

			const onOk = () => {
				return updateParticipantHighLeverageTasks(data, task.id)
					.then(()=>{
						afterUpdate(description);
					});
			}

			Confirm({
				title: ``,
				content: `Status will be set to ${status}`,
				okText: 'Yes',
				okType: '',
				cancelText: 'No',
				...{onOk}
			});
		}
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
		return (
			<div className="high-leverage-task">
				<Row style={{marginTop: 16}}>
					<div style={{ padding: 24, background: '#fff'}}>
						<h1>Participant High Leverage Tasks</h1>
						<Divider />

						<Row>
							<Button type="primary" onClick={this.showModal('Add Call Booking', 'add')}>
								<Icon type="plus-circle-o" />Add
							</Button>
						</Row>

						<Table
							style={{marginTop: 20}}
							columns={this.columns}
							dataSource={this.props.participantTaskList.list}/>

						<ParticipantHighLeverageTaskModal
							width={1000}
							style={{ top: 25 }}
							modal={this.state.modal}
							action={this.state.action}
							onResetModal={this.onResetModal}
							onAfterClose={this.onAfterClose}
							getCoins={this.props.getCoins}
							getCoinPhases={this.props.getCoinPhases}
							getHighLeverageTasks={this.props.getHighLeverageTasks}
							getCoinPhaseParticipants={this.props.getCoinPhaseParticipants}
							getParticipantTasks={this.props.getParticipantTasks}/>
					</div>
				</Row>
			</div>
		);
	}

}

const mapStateToProps = state => {
	return {
		participantTaskList: state.participantTaskLists.participantTaskList
	};
};

const mapDispatchToProps = dispatch => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantTaskList);
