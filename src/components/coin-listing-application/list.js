import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Row,
	Col,
	Table,
	Tag,
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
	getCoinListingApplication,
} from '../../reducers/coin-listing-application/resources';
import CoinListingApplicationModal from './modal';
import './index.css';

class CoinListingApplicationList extends Component {
	componentWillMount() {
		this.setState({
			selectedRowKeys: [],
			pagination: {},
			currentPage: 1,
			showModal: false,
			header: '',
			coinListingApplicationDetails: {},
		});

		this.columns = [{
			title: 'Coin',
			  dataIndex: 'name',
			}, {
			title: 'First name',
			  dataIndex: 'first_name',
			}, {
			title: 'Last name',
			  dataIndex: 'last_name',
			}, {
			title: 'Website',
			  dataIndex: 'website',
			}, {
				title: 'Status',
				key: 'status',
				render: (text, record) => (
					<span>
						<Tag color={record.status === 'Approved' ? "green" :
								(record.status === 'Rejected' ? "red" : "gray")}>
							{record.status}
						</Tag>
					</span>
				)
			}, {
				title: '',
				key: 'action',
				render: (text, record) => (
					<span>
						<Button onClick={this.getCoinListingApplication('View Details', record.key)}> View Details </Button>
					</span>
				)
			}];
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			pagination: nextProps.pagination,
			coinListingApplications: nextProps.coinListingApplications,
		});
	}

	componentWillUnmount() {
	}

	getCoinListingApplication = (header, id) => {
		return () => {
			getCoinListingApplication(id)
				.then(res => {
					this.setState({
						coinListingApplicationDetails: {
							key: res.id,
							first_name: res.first_name,
							last_name: res.last_name,
							position: res.position,
							email: res.email,
							phone: res.phone,
							ceo_first_name: res.ceo_first_name,
							ceo_last_name: res.ceo_last_name,
							ceo_email: res.ceo_email,
							ceo_phone: res.ceo_phone,
							cmo_first_name: res.cmo_first_name,
							cmo_last_name: res.cmo_last_name,
							cmo_email: res.cmo_email,
							cmo_phone: res.cmo_phone,
							cto_first_name: res.cto_first_name,
							cto_last_name: res.cto_last_name,
							cto_email: res.cto_email,
							cto_phone: res.cto_phone,
							name: res.name,
							abbreviation: res.abbreviation,
							website: res.website,
							company_email: res.company_email,
							logo: res.logo,
							erc: res.erc,
							coin_based: res.coin_based,
							coin_explorer: res.coin_explorer,
							coin_contract: res.coin_contract,
							coin_security: res.coin_security,
							twitter_handle: res.twitter_handle,
							facebook_page: res.facebook_page,
							linkedin_page: res.linkedin_page,
							telegram_page: res.telegram_page,
							reddit_page: res.reddit_page,
							medium_page: res.medium_page,
							youtube_page: res.youtube_page,
							steemit_page: res.steemit_page,
							discord_page: res.discord_page,
							weibo_page: res.weibo_page,
							hashtags: res.hashtags,
							coin_id: res.coin_id,
							phase_id: res.phase_id,
							status: res.status,
							updated_by: res.updated_by,
							created_at: res.created_at,
							updated_at: res.updated_at,
							coin_lifecycle: res.coin_lifecycle,
							personal_email_verified: res.personal_email_verified,
							ceo_email_verified: res.ceo_email_verified,
							cto_email_verified: res.cto_email_verified,
							cmo_email_verified: res.cmo_email_verified,
							bitcoin_talk_page: res.bitcoin_talk_page,
							vk_page: res.vk_page,
							github_page: res.github_page,
							slack_group_page: res.slack_group_page,
							logo_small: res.logo_small,
							coin_whitepaper: res.coin_whitepaper,
							coin_industry: res.coin_industry,
							logo_url: res.logo_url,
							logo_small_url: res.logo_small_url,
						},
						showModal: true,
						header: header,
					});
				});
		};
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
		this.props.getCoinListingApplications(pager.current, 25);
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
				<h1>Coin Listing Applications</h1>
				<Divider />

				<Table
					style={{marginTop: 20}}
					columns={this.columns}
					dataSource={this.state.coinListingApplications}
					rowSelection={rowSelection}
					onChange={this.handleTableChange}
					pagination={this.state.pagination}
					loading={this.props.loading}/>

				<CoinListingApplicationModal
					getCoinListingApplications={this.props.getCoinListingApplications}
					coinListingApplicationDetails={this.state.coinListingApplicationDetails}
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

export default connect(mapStateToProps, mapDispatchToProps)(CoinListingApplicationList);
