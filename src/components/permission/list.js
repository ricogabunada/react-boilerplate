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
	getPermission,
	updatePermission,
} from '../../reducers/permissions/resources';
import {
	setCurrentPageNumber,
} from '../../reducers/permissions/actions';
import PermissionModal from './modal';
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
			permissionDetails: {},
		});

		this.columns = [{
			title: 'Permission',
			  dataIndex: 'name',
			}, {
			title: 'Description',
			  dataIndex: 'description',
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
		});
	}

	componentWillUnmount() {
	}

	getPermission = id => {
		getPermission(id)
			.then(res => {
				this.setState({
					permissionDetails: {
						key: res.id,
						name: res.name,
						description: res.description,
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
		this.props.getPermissions(pager.current, 5);
		this.props.setCurrentPageNumber(pager.current);
	}

	showModal = (header, permissionDetails) => {
		return () =>  {
			this.setState({
				permissionDetails: permissionDetails,
				showModal: true,
				header: header,
			});
		}
	}

	showConfirmationModal = (header, permissionDetails) => {
		return () =>  {
			const onOk = () => {
				updatePermission(permissionDetails.key, {is_deleted: 1})
					.then(res => {
						openNotificationWithIcon(
							'success',
							'Success',
							'Permission successfully updated.'
						);
						this.props.getPermissions(this.state.currentPage, 5);
					});
			};

			Confirm({
				title: 'Delete Permission',
				content: `Are you sure you want to delete ${permissionDetails.name}?`,
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
				<h1>Permissions</h1>
				<Divider />
				
				<Row>
					<Button type="primary" onClick={this.showModal('Add Permission', {})}>
						<Icon type="plus-circle-o" />Add
					</Button>
				</Row>

				<Table
					style={{marginTop: 20}}
					columns={this.columns}
					dataSource={this.state.permissions}
					rowSelection={rowSelection}
					onChange={this.handleTableChange}
					pagination={this.state.pagination}
					loading={this.props.loading}/>

				<PermissionModal
					getPermissions={this.props.getPermissions}
					getPermission={this.getPermission}
					currentPage={this.state.currentPage}
					permissionDetails={this.state.permissionDetails}
					header={this.state.header}
					visible={this.state.showModal}
					resetVisible={this.resetShowModal} />
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		currentPageNumber: state.permissions.currentPageNumber,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setCurrentPageNumber(pageNumber) {
			dispatch(setCurrentPageNumber(pageNumber));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PermissionList);
