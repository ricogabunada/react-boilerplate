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
	Tag,
	Menu,
	Modal,
	notification,
} from 'antd';
import {
	getRole,
	updateRole,
} from '../../reducers/roles/resources';
import RoleModal from './modal';
import CommonModal from '../../shared-components/modal/';
import './index.css';

const Confirm = Modal.confirm;
const openNotificationWithIcon = (type, title, message) => {
	notification[type]({
		message: title,
		description: message,
	});
};

class PermissionList extends Component {
	componentWillMount() {
		this.setState({
			selectedRowKeys: [],
			pagination: {},
			currentPage: 1,
			showModal: false,
			header: '',
			permissions: [],
			roleDetails: {},
		});

		this.columns = [{
			title: 'Role',
				dataIndex: 'name',
				width: '20%',
			}, {
				title: 'Permissions',
				key: 'permissions',
				render: (text, record) => (
					<div>
						{this.populateTags(record.permissions)}
					</div>
				),
			}, {
				title: '',
				key: 'action',
				render: (text, record) => (
					<div>
						<Dropdown overlay={(
							<Menu>
								<Menu.Item
									onClick={this.showModal('Edit Permission', record)}
									key={record.key}>
									<Icon type="edit"/> Edit
								</Menu.Item>
								<Menu.Item
									onClick={this.showConfirmationModal('delete', record)}
									key={'delete-' + record.key}>
									<Icon type="delete" /> Delete
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
			permissions: nextProps.permissions,
			roles: nextProps.roles,
		});
	}

	componentWillUnmount() {
	}

	populateTags = permissions => {
		let tags = permissions.map(permission => {
			return <Tag key={permission.id}
				color="blue"
				style={{marginTop: '5px', marginBottom: '5px'}}>
					{permission.name}
				</Tag>
		});

		return tags;
	}

	getRole = id => {
		getRole(id)
			.then(res => {
				this.setState({
					roleDetails: {
						key: res.id,
						name: res.name,
						permissions: res.permissions,
					},
				});
			});
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
		this.props.getRoles(pager.current, 25);
	}

	showModal = (header, roleDetails) => {
		return () =>  {
			this.setState({
				roleDetails: roleDetails,
				showModal: true,
				header: header,
			});
		}
	}

	showConfirmationModal = (header, roleDetails) => {
		return () =>  {
			const onOk = () => {
				updateRole(roleDetails.key, {is_deleted: 1})
					.then(res => {
						openNotificationWithIcon(
							'success',
							'Success',
							'Role successfully updated.'
						);
						this.props.getRoles(this.state.currentPage, 25);
					});
			};

			Confirm({
				title: 'Delete Role',
				content: `Are you sure you want to delete ${roleDetails.name}?`,
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
				<h1>Roles</h1>
				<Divider />
				
				<Row>
					<Button type="primary" onClick={this.showModal('Add Role', {})}>
						<Icon type="plus-circle-o" />Add
					</Button>
				</Row>

				<Table
					style={{marginTop: 20}}
					columns={this.columns}
					dataSource={this.state.roles}
					rowSelection={rowSelection}
					onChange={this.handleTableChange}
					pagination={this.state.pagination}
					loading={this.props.loading}/>

				<RoleModal
					getRoles={this.props.getRoles}
					getRole={this.getRole}
					permissions={this.state.permissions}
					currentPage={this.state.currentPage}
					roleDetails={this.state.roleDetails}
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

export default connect(mapStateToProps, mapDispatchToProps)(PermissionList);
