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
				coinId: '',
				query: '',
				coinOptions: [],
				isLoading: false,
			})
			let duration = [];
		}

		componentWillReceiveProps(nextProps) {
			if(nextProps.coinId && nextProps.coinId !== this.state.coinId) {
				this.setState({
					coinId: nextProps.coinId,
				});
			}

			if(Object.keys(nextProps.phaseDetails || {}).length) {
				this.duration = [
					moment((nextProps.phaseDetails || {}).airdrop_start, 'YYYY-MM-DD'),
					moment((nextProps.phaseDetails || {}).airdrop_end, 'YYYY-MM-DD')
				];
			}
		}

		onPaginate = val => {
			console.log(val);
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
				phaseDetails,
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
						{this.props.coinId ? null : <FormItem label="Coins" {...formItemSize}>
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
										if ( selected.length ) {
											return this.setState( { coinId : selected[ 0 ].id} );
										}
										return this.setState( { 'coinId' : '' } );
									} }
									options={ this.state.coinOptions } />
							)}
						</FormItem>}
						<FormItem label="Phase Number" {...formItemSize}>
							{getFieldDecorator('phase_number', {
								rules: [{ required: true, message: 'Please input Phase Number!' }],
								initialValue: (phaseDetails || {}).phase_number
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
								initialValue: (phaseDetails || {}).timezone
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
						<Divider />
						<TransactionSettings
							recordDetails={phaseDetails}
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
