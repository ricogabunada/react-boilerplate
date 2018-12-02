import React, { Component } from 'react';
import { connect } from 'react-redux';

// component
import {
    EditorState,
    ContentState,
} from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { notification } from 'antd';
import HighLeverageTaskList from './list';

// reducers
import {
    setCoinList,
    setCoinDetails
} from '../../reducers/coins/actions';
import {
    setHighLeverageTaskList,
    setHighLeverageTaskDetails,
    setHighLeverageTaskNewDescription
} from '../../reducers/high-leverage-tasks/actions';

import { getCoins } from '../../reducers/coins/resources';
import {
    getHighLeverageTask,
    getHighLeverageTasks
} from '../../reducers/high-leverage-tasks/resources';

const defaultCoinPagination = {
    total: 0,
	current: 1,
	filters: {},
	relationships: [],
	orderBy: {name: 'Asc'},
	pageSize: 25,
};

const defaultHighLeverageTasksPagination = {
    total: 0,
	current: 1,
	filters: {},
	relationships: ['coin'],
	orderBy: {name: 'Asc'},
	pageSize: 25,
};

class HighLeverageTask extends Component {
    componentWillMount() {
        this.setState({});
        this.displayDefaultNotification();
        this.getCoins({...defaultCoinPagination});
        this.getHighLeverageTasks({...defaultHighLeverageTasksPagination});
    }

    /**
     * Display default notification
     * @return {void} show notification
     */
    displayDefaultNotification = () => {
        notification['info']({
            message: 'Click the "+" button in each table row to view the description for each task.',
        }, 10000);
    }

    /**
     * Get coins
     * @param {Object} options
     * @param {Boolean} cancellable
     * @return {Promise} set coins store
     */
    getCoins = (options = {}, cancellable = false) => {
        this.props.setCoinList({
            list: [],
            load: true
        });

        return getCoins(options, cancellable)
            .then( res => {
                let list = res.data.map(item => {
                    return {...item, key: item.id}
                });
                
                this.props.setCoinList({
                    list: list,
                    load: false,
                    pagination: {...options, total: res.total}
                });
            }).catch( err => {
                this.props.setCoinList({
                    laod: false,
                    pagination: {...options, total: 0}
                });
            });
    }

    /**
     * Get high leverage task
     * @param {Object} options
     * @param {Boolean} cancellable
     * @return {Promise} set high leverage task store
     */
    getHighLeverageTask = highLeverageTaskId => {
        this.props.setHighLeverageTaskNewDescription('');
        this.props.setHighLeverageTaskDetails({
            load: true,
            details: {},
        });

        return getHighLeverageTask(highLeverageTaskId)
            .then( res => {
                const blocksFromHtml = htmlToDraft(res.description);
                const { contentBlocks, entityMap } = blocksFromHtml;
                const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
                const editorState = EditorState.createWithContent(contentState);
                
                this.props.setCoinDetails({details: res.coin});
                this.props.setHighLeverageTaskNewDescription(editorState);
                this.props.setHighLeverageTaskDetails({
                    load: false,
                    details: res,
                });
            }).catch( err => {
                this.props.setHighLeverageTaskDetails({load: false});
            });
    }

    /**
     * Get high leverage tasks
     * @param {Object} options
     * @param {Boolean} cancellable
     * @return {Promise} set high leverage task store
     */
    getHighLeverageTasks = (options = {}, cancellable = false) => {
        this.props.setHighLeverageTaskList({
            list: [],
            load: true,
        });

        return getHighLeverageTasks(options, cancellable)
            .then( res => {
                let list = res.data.map( item => {
                    return {...item, key: item.id}
                });

                this.props.setHighLeverageTaskList({
                    list: list,
                    load: false,
                    pagination: {...options, total: res.total}
                });
            }).catch( err => {
                this.props.setHighLeverageTaskList({
                    load: false,
                    pagination: {...options, total: 0}
                });
            });
    }

    render() {
        return(
            <div>
                <HighLeverageTaskList
                    getCoins={this.getCoins}
                    getHighLeverageTask={this.getHighLeverageTask}
                    getHighLeverageTasks={this.getHighLeverageTasks}/>
            </div>
        );
    }
}

const mapStateToProps = state => {
	return {
        // coins
        coins: state.coins.coins,

        // high leverage tasks
        highLeverageTask: state.highLeverageTasks.highLeverageTask,
        highLeverageTasks: state.highLeverageTasks.highLeverageTasks,
    };
};

const mapDispatchToProps = dispatch => {
	return {
        // coins
        setCoinList(list) {
            dispatch(setCoinList(list));
        },
        setCoinDetails(details) {
            dispatch(setCoinDetails(details));
        },

        // high leverage task
        setHighLeverageTaskList(list) {
            dispatch(setHighLeverageTaskList(list));
        },
        setHighLeverageTaskDetails(details) {
            dispatch(setHighLeverageTaskDetails(details));
        },
        setHighLeverageTaskNewDescription(description) {
            dispatch(setHighLeverageTaskNewDescription(description));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HighLeverageTask);