import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// components
import {
    Icon,
    notification
} from 'antd';
import CommonModal from '../../shared-components/modal';
import ParticipantHighLeverageTaskForm from './form';

// reducers
// resources
import { addParticipantHighLeverageTask } from '../../reducers/participant-high-leverage-tasks/resources';

// actions
import { 
    setCoinDetails,
    setCoinList
} from '../../reducers/coins/actions';
import {
    setCoinCompPhaseDetails,
    setCoinCompPhaseList
} from '../../reducers/coin-competition/actions';
import {
    setHighLeverageTaskDetails,
    setHighLeverageTaskList
} from '../../reducers/high-leverage-tasks/actions';
import {
    setCoinCompParticipantDetails,
    setCoinCompParticipantList
} from '../../reducers/coin-competition-participants/actions';

class ParticipantHighLeverageTask extends Component {
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
     * On ok modal
     * @return {void} execute process whenever ok button is pressed
     */
    onOkModal = () => {
        const form = this.formRef.props.form;
		form.validateFields((err, values) => {
			if (err) { return false; }
			let participantTaskValues = {
                phase_participant_id: this.props.coinCompParticipant.details.id || null,
                high_leverage_id: this.props.highLeverageTask.details.id || null,
                status : 'pending',
                points : 0
            };
            
            return addParticipantHighLeverageTask(participantTaskValues)
                    .then(res => {
                        notification['success']({
                            message: 'Success',
                            description: 'Participant\'s task has successfully been added.',
                        });

                        this.afterParticipantTaskAdded();
                    }).catch( err => {
                        this.displayServerErrors(err);
                    });
        });
    }

    /**
     * After participant task added
     * @return {void} reset form data
     */
    afterParticipantTaskAdded = () => {
        this.formRef.props.form.resetFields();

        // reset lists
        this.props.setCoinCompPhaseList({list: []});
        this.props.setHighLeverageTaskList({list: []});
        this.props.setCoinCompParticipantList({list: []});
        
        // reset selected details
        this.props.setCoinCompPhaseDetails({details: {}});
        this.props.setHighLeverageTaskDetails({details: {}});
        this.props.setCoinCompParticipantDetails({details: {}});

        // reload list
        this.props.getParticipantTasks({...this.props.participantTaskList.pagination})
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
                        <ParticipantHighLeverageTaskForm
                            getCoins={this.props.getCoins}
                            getCoinPhases={this.props.getCoinPhases}
                            getHighLeverageTasks={this.props.getHighLeverageTasks}
                            getCoinPhaseParticipants={this.props.getCoinPhaseParticipants}
                            getParticipantTasks={this.props.getParticipantTasks}
                            wrappedComponentRef={this.saveFormRef}/>
                </CommonModal>
            </div>   
        );
    };
}

const mapStateToProps = state => {
    return {
        // high leverage task
        highLeverageTask: state.highLeverageTasks.highLeverageTask,
        highLeverageTasks: state.highLeverageTasks.highLeverageTasks,

        // coin comp participant
        coinCompParticipant: state.coinCompParticipants.coinCompParticipant,
        coinCompParticipants: state.coinCompParticipants.coinCompParticipants,

        // participants - tasks
        participantTaskList: state.participantTaskLists.participantTaskList,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        // coin comp phases
        setCoinCompPhaseDetails(details) {
            dispatch(setCoinCompPhaseDetails(details));            
        },
        setCoinCompPhaseList(list) {
            dispatch(setCoinCompPhaseList(list));            
        },

        // high leverage tasks
        setHighLeverageTaskDetails(details) {
            dispatch(setHighLeverageTaskDetails(details));            
        },
        setHighLeverageTaskList(list) {
            dispatch(setHighLeverageTaskList(list));            
        },

        // coin comp phase participants
        setCoinCompParticipantDetails(details) {
            dispatch(setCoinCompParticipantDetails(details));            
        },
        setCoinCompParticipantList(list) {
            dispatch(setCoinCompParticipantList(list));            
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantHighLeverageTask);