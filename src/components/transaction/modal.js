import React, { Component } from 'react';
import { connect } from 'react-redux';

// reducers
// actions
import {
    setTransactionList,
    setTransactionDetails
} from '../../reducers/transactions/actions';

// component
import { Spin } from 'antd';
import CommonModal from '../../shared-components/modal';
import TransactionForm from './form';

class TransactionModal extends Component {
    componentWillMount () {
        this.setState({
            modal: {...this.props.modal}
        });
    }

    componentWillReceiveProps = nextProps => {
        this.setState({
            modal: {...nextProps.modal}
        });
    }

    /**
     * On cancel modal
     * execute on cancel modal processes
     */
    onCancelModal = () => {
        this.formRef.props.form.resetFields();
    }

    /**
     * Save form reference
     */
    saveFormRef = formRef => {
        this.formRef = formRef;
    }

    render () {
        return (
            <div>
                <CommonModal
                    footer={null}
                    width={this.state.width}
                    style={this.state.style}
                    onCancel={this.onCancelModal}
                    header={this.props.modal.header}
                    visible={this.props.modal.show}
                    onAfterClose={this.props.onAfterClose}
                    resetVisible ={this.props.onResetModal}>
				    <Spin spinning={this.props.transaction.load}>
                        <TransactionForm
                            formatStatus={this.props.formatStatus}
                            wrappedComponentRef={this.saveFormRef}/>
                    </Spin>
                </CommonModal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        transaction: state.transactions.transaction,
        transactions: state.transactions.transactions,
    }
}

const mapStateToDispatch = dispatch => {
    return {
        setTransactionList(list) {
            dispatch(setTransactionList(list));
        },
        setTransactionDetails(details) {
            dispatch(setTransactionDetails(details));
        },
    }
}

export default connect(mapStateToProps, mapStateToDispatch)(TransactionModal);