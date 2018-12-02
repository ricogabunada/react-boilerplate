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
	getDepartment,
	updateDepartment,
} from '../../reducers/departments/resources';
import DepartmentModal from './modal';
import CommonModal from '../../shared-components/modal/';
import './index.css';

const Confirm = Modal.confirm;
const openNotificationWithIcon = (type, title, message) => {
	notification[type]({
		message: title,
		description: message,
	});
};

class DepartmentList extends Component {
	componentWillMount() {
		this.setState({
			selectedRowKeys: [],
			pagination: {},
			currentPage: 1,
			showModal: false,
			header: '',
			departmentDetails: {},
		});

		this.columns = [{
			title: 'Department',
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
								onClick={this.showModal('Edit Department', record)}
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
			departments: nextProps.departments,
		});
	}

	componentWillUnmount() {
	}

	getDepartment = id => {
		getDepartment(id)
			.then(res => {
				this.setState({
					departmentDetails: {
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
		this.props.getDepartments(pager.current, 25);
	}

	showModal = (header, departmentDetails) => {
		return () =>  {
			this.setState({
				departmentDetails: departmentDetails,
				showModal: true,
				header: header,
			});
		}
	}

	showConfirmationModal = (header, departmentDetails) => {
		return () =>  {
			const onOk = () => {
				updateDepartment(departmentDetails.key, {is_deleted: 1})
					.then(res => {
						openNotificationWithIcon(
							'success',
							'Success',
							'Department successfully updated.'
						);
						this.props.getDepartments(this.state.currentPage, 25);
					});
			};

			Confirm({
				title: 'Delete Department',
				content: `Are you sure you want to delete ${departmentDetails.name}?`,
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
				<h1>Departments</h1>
				<Divider />
				
				<Row>
					<Button type="primary" onClick={this.showModal('Add Department', {})}>
						<Icon type="plus-circle-o" />Add
					</Button>
				</Row>

				<Table
					style={{marginTop: 20}}
					columns={this.columns}
					dataSource={this.state.departments}
					rowSelection={rowSelection}
					onChange={this.handleTableChange}
					pagination={this.state.pagination}
					loading={this.props.loading}/>

				<DepartmentModal
					getDepartments={this.props.getDepartments}
					getDepartment={this.getDepartment}
					currentPage={this.state.currentPage}
					departmentDetails={this.state.departmentDetails}
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

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentList);
