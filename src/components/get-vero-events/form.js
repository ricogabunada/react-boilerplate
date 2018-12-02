import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Input,
	Select,
	Form,
} from 'antd';
import CommonModal from '../../shared-components/modal';
import { getCoins } from '../../reducers/coins/resources';
import {
	getGetVeroEvents,
} from '../../reducers/get-vero-events/resources';
import { asyncContainer, Typeahead } from 'react-bootstrap-typeahead';

const AsyncTypeahead = asyncContainer(Typeahead);
const FormItem = Form.Item;
const Option = Select.Option;
const defaultCoinListOptions = {
	total: 0,
	current: 1,
	filters: {
		'is_verified': '=|1',
		'is_deleted': '=|0',
	},
	orderBy: {
		name: 'Desc'
	},
	pageSize: 25,
};

const GetVeroForm = Form.create()(
	class extends React.Component {
		componentWillMount() {
			this.setState({
				getVeroEventDetails: {},
				coinOptions: [],
				isLoading: false,
			});
		}

		componentWillReceiveProps(nextProps) {
			this.setState({
				getVeroEventDetails: nextProps.getVeroEventDetails,
			});
		}

		getCoin = query => {
			let coinFilters = {...defaultCoinListOptions, filters: {
				...defaultCoinListOptions.filters, name: `like|${query}`}};

			this.setState({ isLoading: true });

			getCoins(coinFilters, true)
				.then(res => {
					let coins = [];

					coins = res.data.map(val => {
						return {
							id: val.id,
							name: `${val.name} ${val.abbreviation}`,
						};
					});

					this.setState({
						coinOptions: coins,
						isLoading: false,
					});
				})
				.catch(e => {
					this.setState({
						coinOptions: [],
						isLoading: false,
					});
				});
		}

		getCoins = () => {
			getCoins(defaultCoinListOptions, false)
				.then(res => {
					let coins = [];

					coins = res.data.map(val => {
						return {
							id: val.id,
							name: `${val.name} ${val.abbreviation}`,
						};
					});

					this.setState({
						coinOptions: coins,
						isLoading: false,
					});
				})
				.catch(e => {
					this.setState({
						coinOptions: [],
						isLoading: false,
					});
				});
		}

		handleAsyncChange = selected => {
			if ( selected.length > 0) {
				let coinId = selected[0].id;
				return this.setState({ coinId : coinId });
			}
			return this.setState({ coinId : null });
		}

		render() {
			const {
				visible,
				resetVisible,
				onCreate,
				onCancel,
				form,
				getVeroEventDetails,
				header,
			} = this.props;
			const { getFieldDecorator } = form;
			const formItemSize = {
				labelCol: {span: 6},
				wrapperCol: {span: 18}
			};

			return (
				<CommonModal
					width={900}
					visible={visible}
					resetVisible={resetVisible}
					onOk={onCreate}
					onCancel={onCancel}
					header={header}>
					<Form layout="vertical">
						{Object.keys(this.state.getVeroEventDetails).length ? <FormItem label="Coin" {...formItemSize}
								extra={(this.state.getVeroEventDetails || {}).coin}>
								{getFieldDecorator('coin_id', {
									initialValue: (this.state.getVeroEventDetails || {}).key,
									rules: [{ required: true, message: 'Please select Coin!' }],
								})(<Input style={{display: 'none'}}/>)}
							</FormItem> : <FormItem label="Coins" {...formItemSize}>
							{getFieldDecorator('coin_id', {
								rules: [{ required: true, message: 'Please select Coin!' }],
							})(
								<AsyncTypeahead
									paginate
									bsSize="small"
									isLoading={this.state.isLoading}
									bodyContainer={true}
									searchText="Searching..."
									emptyLabel="No matches found"
									paginationText="Display additional results..."
									placeholder="Search for coins"
									labelKey={option => option.name}
									onSearch={(query) => {
										if(!query) { return; }
										this.getCoin(query);
									} }
									onChange={this.handleAsyncChange}
									options={ this.state.coinOptions } />
							)}
						</FormItem>}
						<FormItem label="User Email Verification Event" {...formItemSize}>
							{getFieldDecorator('user_email_verification_event', {
								rules: [{ required: true, message: 'Please input User Email Verification Event!' }],
								initialValue: (this.state.getVeroEventDetails || {}).user_email_verification_event
							})(<Input type="text"/>)}
						</FormItem>
						<FormItem label="Transaction Create Event" {...formItemSize}>
							{getFieldDecorator('transaction_create_event', {
								rules: [{ required: true, message: 'Please input Transaction Create Event!' }],
								initialValue: (this.state.getVeroEventDetails || {}).transaction_create_event
							})(<Input type="text"/>)}
						</FormItem>
						<FormItem label="Transaction Cancelled Event" {...formItemSize}>
							{getFieldDecorator('transaction_cancelled_event', {
								rules: [{ required: true, message: 'Please input Transaction Cancelled Event!' }],
								initialValue: (this.state.getVeroEventDetails || {}).transaction_cancelled_event
							})(<Input type="text"/>)}
						</FormItem>
						<FormItem label="Transaction Completed Event" {...formItemSize}>
							{getFieldDecorator('transaction_completed_event', {
								rules: [{ required: true, message: 'Please input Transaction Completed Event!' }],
								initialValue: (this.state.getVeroEventDetails || {}).transaction_completed_event
							})(<Input type="text"/>)}
						</FormItem>
						<FormItem label="Congratulatory Event" {...formItemSize}>
							{getFieldDecorator('coin_comp_congratulatory_event', {
								rules: [{ required: true, message: 'Please input Congratulatory Event!' }],
								initialValue: (getVeroEventDetails || {}).coin_comp_congratulatory_event,
							})(<Input type="text"/>)}
						</FormItem>
						<FormItem label="Leverage Task Event" {...formItemSize}>
							{getFieldDecorator('coin_comp_leverage_task_event', {
								rules: [{ required: true, message: 'Please input Leverage Task Event!' }],
								initialValue: (this.state.getVeroEventDetails || {}).coin_comp_leverage_task_event,
							})(<Input type="text"/>)}
						</FormItem>
						<FormItem label="Thank You Event" {...formItemSize}>
							{getFieldDecorator('coin_comp_thank_you_event', {
								rules: [{ required: true, message: 'Please input Thank You Event!' }],
								initialValue: (this.state.getVeroEventDetails || {}).coin_comp_thank_you_event,
							})(<Input type="text"/>)}
						</FormItem>
						<FormItem label="Welcome Email Event" {...formItemSize}>
							{getFieldDecorator('coin_comp_welcome_email_event', {
								rules: [{ required: true, message: 'Please input Welcome Email Event!' }],
								initialValue: (this.state.getVeroEventDetails || {}).coin_comp_welcome_email_event,
							})(<Input type="text"/>)}
						</FormItem>
						<FormItem label="Auth Token" {...formItemSize}>
							{getFieldDecorator('auth_token', {
								rules: [{ required: true, message: 'Please input Auth Token!' }],
								initialValue: (this.state.getVeroEventDetails || {}).auth_token
							})(<Input type="text"/>)}
						</FormItem>
					</Form>
				</CommonModal>
			);
		}
	}
);

export default GetVeroForm;
