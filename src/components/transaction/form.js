import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import './index.css';

// component
import {
    Form,
    Tag,
    Input,
} from 'antd';

const TransactionForm = Form.create()(
    class extends Component {
        componentWillMount() {
            this.setState({token: ''});
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            if (prevProps.transaction.details
                && prevProps.transaction.details.id !== this.props.transaction.details.id) {
                this.setTokenValue();
            }
        }

        /**
         * Display data
         * @param {Object} record
         * @param {String} field
         * @return {String} data
         */
        displayData = (record = {}, field = '', extra = false) => {
            if (record && (record[field] && record[field] !== 'undefined' || (field === 'status' && !record[field]))) {
                switch (field) {
                    case 'created_at':
                        return moment(new Date(record[field])).format('LL');
                        break;
                        
                    case 'amount_usd':
                    case 'token_price_usd':
                        return `$${this.formatNumber(parseFloat(record[field]))}`;
                        break;

                    case 'status':
                        if (extra) {
                            return (<span>
                                        <Tag color={record[field] >= 100 ? "green" : (record[field] < 0 ? "red" : "gray")}>
                                            {this.props.formatStatus(record[field])}
                                        </Tag>
                                    </span>);
                        }

                        return this.props.formatStatus(record[field]);
                        break;

                    case 'status_url':
                    case 'qrcode_url':
                        if (extra) {
                            return (<span><a href={record[field]} target="_blank">{`${record[field].substring(0, 25)}...`}</a></span>);
                        }

                        return record[field];
                        break;
                        

                    default:
                        return record[field];
                        break;
                }
            }

            return '';
        }

        /**
         * Format number
         * @param {String} value
         * @return {String} formatted value
         */
        formatNumber = value => {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        /**
         * Set coin label value
         * @return {String} coin value label
         */
        setTokenValue = () => {
            let token = '';

            if (this.props.transaction.details.coin_comp_phase) {
                token = this.props.transaction.details.coin_comp_phase.coin.abbreviation;
            }

            if (this.props.transaction.details.airdrop_phase) {
                token = this.props.transaction.details.airdrop_phase.coin.abbreviation;
            }

            if (this.props.transaction.details.ico) {
                token = this.props.transaction.details.ico.coin.abbreviation;
            }

            this.setState({token: token});
        }

        render () {
            const { getFieldDecorator } = this.props.form;
			const formItemSize = {
				labelCol: {
					xs: { span: 24 },
					sm: { span: 8 },
				},
				wrapperCol: {
					xs: { span: 24 },
					sm: { span: 16 },
				},
			};

            return (
                <div>
                    <div style={{textAlign: 'center'}}>
                        <img src={this.displayData(this.props.transaction.details.transaction, 'qrcode_url')}
                            width="150" height="150" />
                    </div>
                    <Form id="transaction-form" layout="horizontal">
                        <Form.Item label="Transaction ID" {...formItemSize}
                            extra={this.displayData(this.props.transaction.details.transaction, 'txn_id')}>
                            {getFieldDecorator('transaction_id', {
                                initialValue: this.displayData(this.props.transaction.details.transaction, 'txn_id')
                            })(<Input type='text' style={{display: 'none'}} disabled={true}/>)}
                        </Form.Item>
                        <Form.Item label="Email" {...formItemSize}
                            extra={this.displayData(this.props.transaction.details.user, 'email')}>
                            {getFieldDecorator('email', {
                                initialValue: this.displayData(this.props.transaction.details.user, 'email')
                            })(<Input type='text' style={{display: 'none'}} disabled={true}/>)}
                        </Form.Item>
                        <Form.Item label="Transaction Date" {...formItemSize}
                            extra={this.displayData(this.props.transaction.details, 'created_at')}>
                            {getFieldDecorator('transaction_date', {
                                initialValue: this.displayData(this.props.transaction.details, 'created_at')
                            })(<Input type='text' style={{display: 'none'}} disabled={true}/>)}
                        </Form.Item>
                        <Form.Item label="Method" {...formItemSize}
                            extra={this.displayData(this.props.transaction.details.transaction, 'currency2')}>
                            {getFieldDecorator('method', {
                                initialValue: this.displayData(this.props.transaction.details.transaction, 'currency2')
                            })(<Input type='text' style={{display: 'none'}} disabled={true}/>)}
                        </Form.Item>
                        <Form.Item label="USD Value" {...formItemSize}
                            extra={this.displayData(this.props.transaction.details, 'amount_usd')}>
                            {getFieldDecorator('usd_value', {
                                initialValue: this.displayData(this.props.transaction.details, 'amount_usd')
                            })(<Input type='text' style={{display: 'none'}} disabled={true}/>)}
                        </Form.Item>
                        <Form.Item label={`USD to ${this.state.token} Rate`} {...formItemSize}
                            extra={this.displayData(this.props.transaction.details, 'token_price_usd')}>
                            {getFieldDecorator('usd_value', {
                                initialValue: this.displayData(this.props.transaction.details, 'token_price_usd')
                            })(<Input type='text' style={{display: 'none'}} disabled={true}/>)}
                        </Form.Item>
                        <Form.Item label={`${this.state.token} Value`} {...formItemSize}
                            extra={this.displayData(this.props.transaction.details, 'tokens')}>
                            {getFieldDecorator('coin_value', {
                                initialValue: this.displayData(this.props.transaction.details, 'tokens')
                            })(<Input type='text' style={{display: 'none'}} disabled={true}/>)}
                        </Form.Item>
                        <Form.Item label="Source" {...formItemSize}
                            extra={this.displayData(this.props.transaction.details, 'source')}>
                            {getFieldDecorator('source', {
                                initialValue: this.displayData(this.props.transaction.details, 'source')
                            })(<Input type='text' style={{display: 'none'}} disabled={true}/>)}
                        </Form.Item>
                        <Form.Item label="Status" {...formItemSize}
                            extra={this.displayData(this.props.transaction.details.transaction, 'status', true)}>
                            {getFieldDecorator('status', {
                                initialValue: this.displayData(this.props.transaction.details.transaction, 'status')
                            })(<Input type='text' style={{display: 'none'}} disabled={true}/>)}
                        </Form.Item>
                        <Form.Item label="Status URL" {...formItemSize}
                            extra={this.displayData(this.props.transaction.details.transaction, 'status_url', true)}>
                            {getFieldDecorator('status_url', {
                                initialValue: this.displayData(this.props.transaction.details.transaction, 'status_url')
                            })(<Input type='text' style={{display: 'none'}} disabled={true}/>)}
                        </Form.Item>
                        <Form.Item label="QR Code URL" {...formItemSize}
                            extra={this.displayData(this.props.transaction.details.transaction, 'qrcode_url', true)}>
                            {getFieldDecorator('qr_code_url', {
                                initialValue: this.displayData(this.props.transaction.details.transaction, 'qrcode_url')
                            })(<Input type='text' style={{display: 'none'}} disabled={true}/>)}
                        </Form.Item>
                    </Form>
                </div>
            );
        }
    }
);

const mapStateToProps = state => {
    return {
        transaction: state.transactions.transaction,
        transactions: state.transactions.transactions,
    }
}

export default connect(mapStateToProps)(TransactionForm);