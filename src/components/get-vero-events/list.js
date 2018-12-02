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
	updateGetVeroEvent,
} from '../../reducers/get-vero-events/resources';
import GetVeroEventsModal from './modal';
import './index.css';

const Confirm = Modal.confirm;
const openNotificationWithIcon = (type, title, message) => {
	notification[type]({
		message: title,
		description: message,
	});
};

class GetVeroEventList extends Component {
	componentWillMount() {
		this.setState({
			selectedRowKeys: [],
			pagination: {},
			currentPage: 1,
			showModal: false,
			header: '',
			getVeroEvents: [],
			getVeroEventDetails: {},
		});

		this.columns = [{
			title: 'Coin',
			  dataIndex: 'coin',
			}, {
			  title: 'Date Created',
			  dataIndex: 'created_at',
			}, {
			  title: 'Date Updated',
			  dataIndex: 'updated_at',
			}, {
			  title: '',
			  key: 'action',
			  render: (text, record) => (
				<div>
					<Button onClick={this.showModal('Edit User', record)}> View Details </Button>
				</div>
			  ),
			}];
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			pagination: nextProps.pagination,
			getVeroEvents: nextProps.getVeroEvents,
		});
	}

	componentWillUnmount() {
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

	showModal = (header, getVeroEventDetails) => {
		return () =>  {
			this.setState({
				getVeroEventDetails: getVeroEventDetails,
				showModal: true,
				header: header,
			});
		}
	}

	showConfirmationModal = (header, getVeroEventDetails) => {
		return () =>  {
			let onOk = () => {
				let updateDetails = {
					is_active: 0,
					updated_by: 1,
				};

				updateGetVeroEvent(getVeroEventDetails.key, updateDetails)
					.then(res => {
						openNotificationWithIcon(
							'success',
							'Success',
							'GetVero Event successfully updated.'
						);
						this.props.getGetVeroEvents(this.state.currentPage, 25);
					});
			};

			Confirm({
				title: `${header} User`,
				content: `Are you sure you want to ${header.toLowerCase()} ${getVeroEventDetails.email}?`,
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
				<h1>GetVero Events</h1>
				<Divider />

				<Row>
					<Button type="primary" onClick={this.showModal('Add GetVero Event', {})}>
						<Icon type="plus-circle-o" />Add
					</Button>
				</Row>

				<Table
					style={{marginTop: 20}}
					columns={this.columns}
					dataSource={this.state.getVeroEvents}
					rowSelection={rowSelection}
					onChange={this.handleTableChange}
					pagination={this.state.pagination}
					loading={this.props.loading}/>

				<GetVeroEventsModal
					getGetVeroEvents={this.props.getGetVeroEvents}
					currentPage={this.state.currentPage}
					getVeroEventDetails={this.state.getVeroEventDetails}
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

export default connect(mapStateToProps, mapDispatchToProps)(GetVeroEventList);
