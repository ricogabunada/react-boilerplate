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
	updateUser,
	deleteUser,
	activateUser,
} from '../../reducers/users/resources';
import {
	sendEmail,
} from '../../reducers/login/resources';
import UsersModal from './modal';
import CommonModal from '../../shared-components/modal/';
import './index.css';

const Confirm = Modal.confirm;
const openNotificationWithIcon = (type, title, message) => {
	notification[type]({
		message: title,
		description: message,
	});
};

class UserList extends Component {
	componentWillMount() {
		this.setState({
			selectedRowKeys: [],
			pagination: {},
			currentPage: 1,
			showModal: false,
			header: '',
			users: [],
			userDetails: {},
		});

		this.columns = [{
			title: 'Email',
			  dataIndex: 'email',
			}, {
			  title: 'Active',
			  key: 'is_active',
			  render: (text, record) => (
				<span>
					<Icon key={record.key} {...this.setStatus(record.is_active)} />
				</span>
			  ),
			}, {
			  title: 'Verified',
			  key: 'is_verified',
			  render: (text, record) => (
				<span>
					<Icon key={record.key} {...this.setStatus(record.is_verified)} />
				</span>
			  ),
			}, {
			  title: '',
			  key: 'action',
			  render: (text, record) => (
				<div>
					<Dropdown overlay={(
						<Menu>
							<Menu.Item
								onClick={this.showModal('Edit User', record)}
								key={record.key}>
								<Icon type="edit"/> Edit
							</Menu.Item>
							<Menu.Item
								onClick={this.showConfirmationModal('Reset Password', record)}
								key={'reset-' + record.key}>
								<Icon type="lock"/> Reset Password
							</Menu.Item>
							<Menu.Item
								style={{display: record.is_deleted ? 'none' : 'block'}}
								onClick={this.showConfirmationModal(record.is_verified ? 'Unverify' : 'Verify', record)}
								key={record.is_verified ? 'unverify-' + record.id : 'verify-' + record.id}>
								<Icon type={record.is_verified ? 'close' : 'check'}/> { record.is_verified ? 'Unverify' : 'Verify' }
							</Menu.Item>
							<Menu.Item
								onClick={this.showConfirmationModal(record.is_active? 'Deactivate' : 'Activate', record)}
								key={record.is_active ? 'activate-' + record.id : 'deactivate-' + record.id}>
								<Icon type={record.is_active? 'delete' : 'check'}/> { record.is_active ? 'Deactivate' : 'Activate' }
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
			users: nextProps.users,
		});
	}

	componentWillUnmount() {
	}

	setStatus = status => {
		if(status) {
			return {style: {color: 'green'}, type: 'check'};
		}
		return {style: {color: 'red'}, type: 'close'};
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
		const pager = { ...this.state.pagination };
		pager.current = pagination.current;

		this.setState({currentPage: pager.current});
		this.props.getUsrs(pager.current, 25);
	}

	showModal = (header, userDetails) => {
		return () =>  {
			this.setState({
				userDetails: userDetails,
				showModal: true,
				header: header,
			});
		}
	}

	showConfirmationModal = (header, userDetails) => {
		return () =>  {
			let onOk = () => {
				let updateDetails = {
					is_active: 0,
					updated_by: 1,
				};

				updateUser(userDetails.key, updateDetails)
					.then(res => {
						openNotificationWithIcon(
							'success',
							'Success',
							'User successfully updated.'
						);
						this.props.getUsers(this.state.currentPage, 25);
					});
			};

			if(header === 'Activate') {
				onOk = () => {
					activateUser(userDetails.key)
						.then(res => {
							openNotificationWithIcon(
								'success',
								'Success',
								'User successfully updated.'
							);
							this.props.getUsers(this.state.currentPage, 25);
						});
				};
			}

			if(header === 'Deactivate') {
				onOk = () => {
					deleteUser(userDetails.key)
						.then(res => {
							openNotificationWithIcon(
								'success',
								'Success',
								'User successfully updated.'
							);
							this.props.getUsers(this.state.currentPage, 25);
						});
				};
			}

			if(header === 'Unverify') {
				onOk = () => {
					let updateDetails = {
						is_verified: 0,
						updated_by: 1,
					};

					updateUser(userDetails.key, updateDetails)
						.then(res => {
							openNotificationWithIcon(
								'success',
								'Success',
								'User successfully updated.'
							);
							this.props.getUsers(this.state.currentPage, 25);
						});
				};
			}

			if(header === 'Verify') {
				onOk = () => {
					let updateDetails = {
						is_verified: 1,
						updated_by: 1,
					};

					updateUser(userDetails.key, updateDetails)
						.then(res => {
							openNotificationWithIcon(
								'success',
								'Success',
								'User successfully updated.'
							);
							this.props.getUsers(this.state.currentPage, 25);
						});
				};
			}

			if(header === 'Reset Password') {
				onOk = () => {
					sendEmail({email: userDetails.email})
						.then(res => {
							this.props.getUsers(this.state.currentPage, 25);
							if(res.success) {
								openNotificationWithIcon(
									'success',
									'Success',
									'Email has been sent to the user.'
								);

								return this.setState({
									success: true,
									error: false,
								});
							}
							this.setState({
								success: false,
								error: true,
							});
						})
						.catch(err => {
							console.log('err: ', err);
						});
				};
			}

			Confirm({
				title: `${header} User`,
				content: `Are you sure you want to ${header.toLowerCase()} ${userDetails.email}?`,
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

	render() {
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectedRowKeysChange,
		};

		return (
			<div>
				<h1>Users</h1>
				<Divider />

				<Row>
					<Button type="primary" onClick={this.showModal('Add User', {})}>
						<Icon type="plus-circle-o" />Add
					</Button>
				</Row>

				<Table
					style={{marginTop: 20}}
					columns={this.columns}
					dataSource={this.state.users}
					rowSelection={rowSelection}
					onChange={this.handleTableChange}
					pagination={this.state.pagination}
					loading={this.props.loading}/>

				<UsersModal
					getUsers={this.props.getUsers}
					currentPage={this.state.currentPage}
					userDetails={this.state.userDetails}
					roles={this.props.roles}
					header={this.state.header}
					visible={this.state.showModal}
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

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
