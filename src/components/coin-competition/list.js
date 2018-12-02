import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
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
	getCoinPhases,
} from '../../reducers/coin-competition/resources';
import PhaseModal from './modal';
import CommonModal from '../../shared-components/modal/';
import './index.css';

class CoinPhasesList extends Component {
	componentWillMount() {
		this.setState({
			phaseDetails: {},
			selectedRowKeys: [],
			pagination: {},
			currentPage: 1,
			showModal: false,
			header: '',
			coinPhases: [],
		});

		this.columns = [{
				title: 'Coin',
				dataIndex: 'name',
				width: '80%',
				render: (text, record) => (
					<a className="coin-comp-anchor"
						onClick={this.props.goTo(`/coin-competitions/${record.key}`)}>
							{text}
					</a>
				),
			}, {
				title: 'Number of Phases',
				className: 'no-of-phases',
				dataIndex: 'phases',
			}];
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			pagination: nextProps.pagination,
			coinPhases: nextProps.coinPhases,
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
		const newPagination = {...this.props.defaultOptions, ...{current: pagination.current}};

		this.setState({currentPage: pagination.current});
		this.props.getAllCoinPhases({...newPagination});
	}

	showModal = (header, phaseDetails) => {
		return () =>  {
			this.setState({
				phaseDetails: phaseDetails,
				showModal: true,
				header: header,
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
			<div className="container-dashboard">
				<Row style={{marginTop: 16}}>
					<div style={{ padding: 24, background: '#fff'}}>
						<h1>Coin Competition</h1>
						<Divider />
						<Row>
							<Button type="primary" onClick={this.showModal('Add New Phase', {})}>
								<Icon type="plus-circle-o" />Add
							</Button>
						</Row>
						<Table
							style={{marginTop: 20}}
							columns={this.columns}
							dataSource={this.state.coinPhases}
							rowSelection={rowSelection}
							onChange={this.handleTableChange}
							pagination={this.state.pagination}
							loading={this.props.loading}
						/>
					</div>

					<PhaseModal
						phaseDetails={this.state.phaseDetails}
						getAllCoinPhases={this.props.getAllCoinPhases}
						defaultOptions={this.props.defaultOptions}
						currentPage={this.state.currentPage}
						header={this.state.header}
						visible={this.state.showModal}
						resetVisible={this.resetShowModal} />
				</Row>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {
		goTo(url) {
			return () => {
				dispatch(push(url));
			}
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CoinPhasesList);
