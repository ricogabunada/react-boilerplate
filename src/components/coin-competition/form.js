import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Divider,
	Input,
	Select,
	Form,
	DatePicker,
} from 'antd';
import moment from 'moment';
import CommonModal from '../../shared-components/modal';
import TransactionSettings from '../../shared-components/transaction-settings';
import PhaseSettings from '../../shared-components/phase-settings';
import { getCoins } from '../../reducers/coins/resources';
import { asyncContainer, Typeahead } from 'react-bootstrap-typeahead';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const AsyncTypeahead = asyncContainer(Typeahead);
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

const PhaseForm = Form.create()(
	class extends React.Component {
		componentWillMount() {
			this.setState({
				query: '',
				coinOptions: [],
				isLoading: false,
				coinId: this.props.coinId,
				phaseDetails: this.props.phaseDetails,
			})
			let duration = [];
		}

		componentWillReceiveProps(nextProps) {
			this.setState({
				phaseDetails: nextProps.phaseDetails,
			});

			if(Object.keys(nextProps.phaseDetails || {}).length) {
				this.duration = [
					moment((nextProps.phaseDetails || {}).coincomp_start, 'YYYY-MM-DD'),
					moment((nextProps.phaseDetails || {}).coincomp_end, 'YYYY-MM-DD')
				];
			} else {
				this.duration = [];
			}
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

		render() {
			const {
				visible,
				resetVisible,
				onCreate,
				onCancel,
				form,
				header,
			} = this.props;
			const { getFieldDecorator } = form;
			const formItemSize = {
				labelCol: {span: 6},
				wrapperCol: {span: 18}
			};

			return (
				<CommonModal
					visible={visible}
					width={900}
					resetVisible={resetVisible}
					onOk={onCreate}
					onCancel={onCancel}
					header={header}>
					<Form layout="vertical">
						{this.state.coinId && ((this.props.match || {}).params || {}).coinId ? null : <FormItem label="Coins" {...formItemSize}>
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
									onChange={ selected => {
										if ( selected.length > 0) {
											return this.setState({ coinId : selected[ 0 ].id });
										}
										return this.setState({ coinId : null });
									} }
									options={ this.state.coinOptions } />
							)}
						</FormItem>}
						<FormItem label="Phase Number" {...formItemSize}>
							{getFieldDecorator('phase_number', {
								rules: [{ required: true, message: 'Please input Phase Number!' }],
								initialValue: (this.state.phaseDetails || {}).phase_number
							})(<Input type="number"/>)}
						</FormItem>
						<FormItem label="Duration" {...formItemSize}>
							{getFieldDecorator('duration', {
								rules: [{ required: true, message: 'Please input Duration!' }],
								initialValue: this.duration,
							})(<RangePicker/>)}
						</FormItem>
						<FormItem label="Timezone" {...formItemSize}>
							{getFieldDecorator('timezone', {
								rules: [{ required: true, message: 'Please input Timezone!' }],
								initialValue: (this.state.phaseDetails || {}).timezone
							})(
								<Select>
									<Option key="AST" value="AST">AST</Option>
									<Option key="EST" value="EST">EST</Option>
									<Option key="EDT" value="EDT">EDT</Option>
									<Option key="CST" value="CST">CST</Option>
									<Option key="CDT" value="CDT">CDT</Option>
									<Option key="MST" value="MST">MST</Option>
									<Option key="MDT" value="MDT">MDT</Option>
									<Option key="PST" value="PST">PST</Option>
									<Option key="PDT" value="PDT">PDT</Option>
									<Option key="AKST" value="AKST">AKST</Option>
									<Option key="AKDT" value="AKDT">AKDT</Option>
									<Option key="HST" value="HST">HST</Option>
									<Option key="HAST" value="HAST">HAST</Option>
									<Option key="HADT" value="HADT">HADT</Option>
									<Option key="SST" value="SST">SST</Option>
									<Option key="SDT" value="SDT">SDT</Option>
									<Option key="CHST" value="CHST">CHST</Option>
								</Select>
							)}
						</FormItem>
						<FormItem label="Number of Winners" {...formItemSize}>
							{getFieldDecorator('no_winners', {
								rules: [{ required: true, message: 'Please input Number of Winners!' }],
								initialValue: (this.state.phaseDetails || {}).no_winners,
							})(<Input type="number"/>)}
						</FormItem>
						<FormItem label="Tweet ID" {...formItemSize}>
							{getFieldDecorator('tweet_id', {
								rules: [{ required: true, message: 'Please input Tweet ID!' }],
								initialValue: (this.state.phaseDetails || {}).tweet_id,
							})(<Input type="text"/>)}
						</FormItem>
						<Divider />
						<TransactionSettings
							recordDetails={this.state.phaseDetails}
							coinId={this.state.coinId}
							form={form}
							formItemSize={formItemSize}/>
						<Divider/>
						<PhaseSettings
							phaseDetails={this.state.phaseDetails}
							coinId={this.state.coinId}
							form={form}
							formItemSize={formItemSize}/>
					</Form>
				</CommonModal>
			);
		}
	}
);

export default PhaseForm;
