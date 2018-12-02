import React, { Component } from 'react';
import { connect } from 'react-redux';

// helpers
import _ from 'lodash';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

// components
import {
    Icon,
    Spin,
    notification
} from 'antd';
import CommonModal from '../../shared-components/modal';
import HighLeverageTaskForm from './form';

// reducers
import {
    addHighLeverageTask,
    updateHighLeverageTask
} from '../../reducers/high-leverage-tasks/resources';
import { setCoinDetails } from '../../reducers/coins/actions';
import {
    setHighLeverageTaskList,
    setHighLeverageTaskDetails,
    setHighLeverageTaskNewDescription,
} from '../../reducers/high-leverage-tasks/actions';

class HighLeverageTaskModal extends Component {
    componentWillMount() {
        this.setState({ 
            action: this.props.action,
            modal: {...this.props.modal}
        });
    }

    componentWillReceiveProps = nextProps => {
        this.setState({ 
            action: nextProps.action,
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
    
    /**
     * On ok modal
     * @return {Promise} add or update high leverage task
     */
    onOkModal = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) { return false; }

            const rawContentState = convertToRaw(this.props.highLeverageTask.newDescription.getCurrentContent());

            values = {...values, ...{
                coin_id: this.props.coin.details.id,
                description: draftToHtml(rawContentState)
            }};
            
            if (this.state.action == 'add') {
                return addHighLeverageTask(values)
                        .then(res => {
                            notification['success']({
                                message: 'Success',
                                description: 'Task has successfully been added.',
                            });

                            this.afterTaskAdded();
                        }).catch( err => {
                            this.displayServerErrors(err);
                        });
            }
 
            return updateHighLeverageTask(values, this.props.highLeverageTask.details.id)
                    .then(res => {
                        notification['success']({
                            message: 'Success',
                            description: 'Task has successfully been updated.',
                        });

                        this.afterTaskUpdated();
                    }).catch( err => {
                        this.displayServerErrors(err);
                    }); 
        });
    }

    /**
     * After task added
     * reset some data and get new set of high leverage tasks 
     */
    afterTaskAdded() {
        this.formRef.props.form.resetFields();
        this.props.setCoinDetails({details: {}});
        this.props.setHighLeverageTaskNewDescription('');
        this.props.setHighLeverageTaskDetails({details: {}});
        this.props.getHighLeverageTasks({...this.props.highLeverageTasks.pagination, 
            orderBy: {created_by: 'Asc'},
        });
	}

    /**
     * After task updated
     * reset some data and get new set of high leverage tasks and updated selected task data
     */
	afterTaskUpdated() {
        this.props.setCoinDetails({details: {}});
        this.props.getHighLeverageTask(this.props.highLeverageTask.details.id);
        this.props.getHighLeverageTasks({...this.props.highLeverageTasks.pagination});
	}


    /**
     * Display server errors
     * @param {Object} errors
     * @return {void} display error notification 
     */
    displayServerErrors = errors => {
		if (errors.data.reason) {
			if (Object.keys(errors.data.reason).length > 0 || errors.data.reason.length > 0) {
				let errorMessages = '';
				let counter = 1;
				_.each(errors.data.reason, (value) => {
					errorMessages += `${counter}. ${value[0]}\n`;
					counter++;
				});

				return notification.open({
					message: 'Errors',
					description: <div style={{whiteSpace: 'pre-wrap'}}>{errorMessages}</div>,
					duration: 0,
					icon: <Icon type={'exclamation-circle'}/>
				});
			}

			return notification['error']({
				message: 'Error',
				description: 'There is something wrong. Please contact your system administrator.',
			});
		}
	}

    render() {
        return (
            <div>
                <CommonModal
				    keyboard={false}
                    width={this.props.width}
                    style={this.props.style}
                    header={this.state.modal.header}
                    visible={this.state.modal.show}
                    onOk={this.onOkModal}
                    onCancel={this.onCancelModal}
                    onAfterClose={this.props.onAfterClose}
                    resetVisible ={this.props.onResetModal}>
				    <Spin spinning={this.props.highLeverageTask.load}>
                        <HighLeverageTaskForm
                            getCoins={this.props.getCoins}
                            getHighLeverageTask={this.props.getHighLeverageTask}
                            getHighLeverageTasks={this.props.getHighLeverageTasks}
                            wrappedComponentRef={this.saveFormRef}/>
                    </Spin>
                </CommonModal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        // coins
        coin: state.coins.coin,

        // high leverage task
        highLeverageTask: state.highLeverageTasks.highLeverageTask,
        highLeverageTasks: state.highLeverageTasks.highLeverageTasks,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        // coins
        setCoinDetails(details) {
            dispatch(setCoinDetails(details));
        },

        // high leverage tasks
        setHighLeverageTaskDetails(details) {
            dispatch(setHighLeverageTaskDetails(details));
        },
        setHighLeverageTaskList(list) {
            dispatch(setHighLeverageTaskList(list));
        },
        setHighLeverageTaskNewDescription(description) {
            dispatch(setHighLeverageTaskNewDescription(description));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HighLeverageTaskModal);