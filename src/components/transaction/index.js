import React, { Component } from 'react';
import { connect } from 'react-redux';

// reducers
// resources
import {
    getTransaction,
    getTransactions,
} from '../../reducers/transactions/resources';

// action
import {
    setTransactionList,
    setTransactionDetails
} from '../../reducers/transactions/actions';

// component
import TransactionList from './list';

const defaultTransactionPagination = {
    total: 0,
	current: 1,
	filters: {},
	relationships: [
        'user',
        'transaction',
        'coin'
    ],
	orderBy: {created_at: 'Desc'},
	pageSize: 25,
}

class Transactions extends Component {
    componentWillMount() {
        this.getTransactions({...defaultTransactionPagination});
    }

    /**
     * Get transaction
     * @param {Object} options
     * @return {void} set transaction details
     */
    getTransaction = options => {
        this.props.setTransactionDetails({
            load: true,
            details: {},
            options: options
        });

        return getTransaction({...options})
            .then( res => {
                this.props.setTransactionDetails({
                    load: false,
                    details: res
                });
            }).catch( err => {
                this.props.setTransactionDetails({load: false});
            });
    }

    /**
     * Get transactions
     * @param {Object} options
     * @param {boolean} cancellable
     * @return {void} set transaction list
     */
    getTransactions = (options = {}, cancellable = false) => {
        this.props.setTransactionList({
            list: [],
            load: true
        });

        return getTransactions(options, cancellable)
            .then( res => {
                let list = res.data.map(item => {
                    return {...item, key: item.id}
                });

                this.props.setTransactionList({
                    list: list,
                    load: false,
                    pagination: {...options, total: res.total}
                });
            }).catch( err => {
                this.props.setTransactionList({
                    load: false,
                    pagination: {...options, total: 0}
                });
            });
    }

    render () {
        return (
            <div>
                <TransactionList getTransaction={this.getTransaction}/>
            </div> 
        )
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

export default connect(mapStateToProps, mapStateToDispatch)(Transactions);