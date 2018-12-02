import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Format from '../../utils/format';

// reducers
// actions
import {
    setTransactionList,
    setTransactionDetails
} from '../../reducers/transactions/actions';

// component
import {
    Tag,
    Table,
    Button,
    Divider,
} from 'antd';
import TransactionModal from './modal';

class TransactionList extends Component {
    componentWillMount() {
        this.setState({
            selectedRowKeys: [],
            modal: {
                header: '',
                show: false,
            }
        });

        this.columns = [{
            title: 'Transaction ID',
            dataIndex: 'transaction.txn_id',
        }, {
            title: 'Client Coin',
            dataIndex: 'coin.name',
        }, {
            title: 'Email',
            key: 'email',
            render: (text, record) => (
                <span> {record.user.email} </span>
            )
        }, {
            title: 'Transaction Date',
            key: 'transaction_date',
            render: (text, record) => (
                <span> {moment(new Date(record.created_at)).format('YYYY-MM-DD HH:mm')}</span>
            ),
        }, {
            title: 'Source',
            dataIndex: 'source',
        }, {
            title: 'Amount',
            className: 'column-money',
            render: (text, record) => (
                <span>{Format.number(record.amount_usd,'$','',2)}</span>
            ),
        }, {
            title: 'Tokens',
            className: 'column-money',
            render: (text, record) => (
                <span>{Format.number(record.tokens,'','',0)}</span>
            ),
        }, {
            title: 'Status',
            key: 'status',
            render: (text, record) => (
                <span>
                    <Tag color={record.transaction.status >= 100 ? "green" : 
                            (record.transaction.status < 0 ? "red" : "gray")}>
                        {this.formatStatus(record.transaction.status)}
                    </Tag>
                </span>
            )
        }, {
            title: '',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button onClick={this.onClickTableRow(record)}> View Details </Button>
                </span>
            )
        }];
    };

    /**
     * Format status
     * @param {Number} status
     * @return {String} status
     */
    formatStatus = status => {
        if (!status || (status >= 0 && status <= 99)) {
            return 'Pending';
        }

        if (status >= 100) {
            return 'Completed';
        }

        if (status < 0) {
            return 'Cancelled';
        }

        return '';
    }

    /**
     * Handle table change
     * @param {Object} pagination
     * @return {Promise} 
     */
    handleTableChange = pagination => {
		this.props.getTransactions({...this.props.transactions.pagination, current: pagination.current});
    }
    
    /**
     * On selected row key change
     * @param {array} selectedRowKeys
     * @return {void} set state on the selected row keys
     */
    onSelectedRowKeysChange = selectedRowKeys => {
		this.setState({ selectedRowKeys });
    }
    
    /**
     * On click table row
     * @param {Object} record
     * @return {void} display modal that contains transaction detail
     */
    onClickTableRow = record => {
        return () => {
            let relationships = ['user', 'transaction'];

            if (record.participant_id && record.phase_id && !record.ico_id) {
                relationships.push('coinCompPhase.coin');
                relationships.push('coinCompPhaseParticipant');
            }

            if (!record.participant_id && record.phase_id && !record.ico_id) {
                relationships.push('airdropPhase');
            }

            if (!record.participant_id && !record.phase_id && record.ico_id) {
                relationships.push('ico');
            }

            this.props.getTransaction({
                id: record.id,
                relationships: relationships
            });

            this.setState({
                modal: {
                    show: true,
                    header: `Transaction Details`
                }
            });
        }
    }

    /**
     * Reset modal
     * @return {void} hide or remove modal
     */
    onResetModal = () => {
        return () => {
            this.setState({
                modal: {...this.state.modal,
                    header: '',
                    show: false
                }
            });
        }
    }

    /**
     * After close
     * @return {void} hide or remove modal
     */
    onAfterClose = () => {
        this.setState({
            modal: {...this.state.modal,
                header: '',
                show: false
            }
        });
    }

    render () {
        const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectedRowKeysChange,
        };
        
        return (
            <div>
				<h1>Transactions</h1>  
				<Divider />

				<Table
					style={{marginTop: 20}}
					columns={this.columns}
					dataSource={this.props.transactions.list}
					rowSelection={rowSelection}
					onChange={this.handleTableChange}
					pagination={this.props.transactions.pagination}
					loading={this.props.transactions.load}/>

                <TransactionModal
                    width={800}
                    style={{ top: 25 }}
                    modal={this.state.modal}
                    formatStatus={this.formatStatus}
                    onResetModal={this.onResetModal}
                    onAfterClose={this.onAfterClose}/>
			</div>
        );
    }
}

const mapStateToProps = state => {
    return {
        // transactions
        transaction: state.transactions.transaction,
        transactions: state.transactions.transactions,
    }
}

const mapStateToDispatch = dispatch => {
    return {
        // transactions
        setTransactionList(list) {
            dispatch(setTransactionList(list));
        },
        setTransactionDetails(details) {
            dispatch(setTransactionDetails(details));
        }
    }
}

export default connect(mapStateToProps, mapStateToDispatch)(TransactionList);