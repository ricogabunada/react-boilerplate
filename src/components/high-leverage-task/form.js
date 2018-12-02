import React, { Component } from 'react';
import { connect } from 'react-redux';
import './index.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// helpers
import {
    EditorState,
    ContentState,
    convertToHTML,
    convertFromHTML,
} from 'draft-js';
import _ from 'lodash';
import { Editor } from 'react-draft-wysiwyg';

// components
import {
    Form,
    Input,
    Radio,
    TreeSelect,
} from 'antd';

// reducers
import {
    setCoinList,
    setCoinDetails,
} from '../../reducers/coins/actions';
import {
    setHighLeverageTaskList,
    setHighLeverageTaskDetails,
    setHighLeverageTaskNewDescription,
} from '../../reducers/high-leverage-tasks/actions';

const HighLeverageTaskForm = Form.create()(
	class extends Component {
        componentWillMount() {
            this.props.getCoins({...this.props.coins.pagination});
        }

        /**
         * Format data
         * @param {Object} data
         * @param {String} field
         * @return {String|Number} 
         */
        formatData = (data, field) => {
            if (data && data[field] && data[field] !== 'undefined') {
                if (field === 'type') {
                    var newData = data[field].split('_');
                    return newData.join(' ');
                }

                return data[field];
            }

            return '';
        }

        /**
         * On editor change
         * @param {void} set 
         */
        onEditorChange = value => {
            this.props.setHighLeverageTaskNewDescription(value);
        }

        /**
         * On coin change
         * @param {String|Number} value
         * @return {void} set selected coin details
         */
        onCoinChange = value => {
			let selectedCoin = _.filter(this.props.coins.list, item => {
				return value === `${item.name} (${item.abbreviation})`
			});
			
			this.props.setCoinDetails({
				details: selectedCoin.length > 0 ? selectedCoin[0] : {},
			});
		}

        /**
         * On coin search
         * @param {String|Number} value
         * @return {Promise} get new set of coins
         */
		onCoinSearch = value => {
			let newFilters = this.props.coins.pagination.filters;

			// remove name filter
			if (newFilters.hasOwnProperty('name')) {
				delete newFilters.name;
			}

			if (value) {
				newFilters = {...newFilters, name : `like|${value}`}
			}

			this.props.setCoinDetails({details:{}});
			return this.props.getCoins({...this.props.coins.pagination, filters: newFilters}, true);
        }
        
        /**
         * On type change
         * @param {String|Number} value
         * @return {void} update form value
         */
        onTypeChange = value => {}

        render () {
            const { getFieldDecorator } = this.props.form;
            const formItemSize = {
                labelCol: {
                    xs: { span: 16 },
                    sm: { span: 4 },
                },
                wrapperCol: {
                    xs: { span: 32 },
                    sm: { span: 20 },
                },
            };
                
            return (
                <Form id="high-leverage-task-form" layout="horizontal">
                    <Form.Item label="Coin" {...formItemSize}>
                        {getFieldDecorator('coin_name', {
                            rules: [{
                                required: true,
                                message: 'Please select coin.'
                            }],
                            initialValue: this.formatData(this.props.coin.details, 'name'),
                        })(
                            <TreeSelect
                                showSearch
                                allowClear
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="Please select coin name"
                                onChange={this.onCoinChange}
                                onSelect={this.onCoinChange}
                                onSearch={this.onCoinSearch}>
                                {this.props.coins.list.map((coin, index) => {
                                    return <TreeSelect.TreeNode key={index}
                                                    className="coin-name"
                                                    title={`${coin.name} (${coin.abbreviation})`}
                                                    value={`${coin.name} (${coin.abbreviation})`}/>
                                })}
                            </TreeSelect>
                        )}
                    </Form.Item>
                    <Form.Item label="Name" {...formItemSize}>
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true,
                                message: 'Please input task name.'
                            }],
                            initialValue: this.formatData(this.props.highLeverageTask.details, 'name'),
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Description" {...formItemSize}>
                        {getFieldDecorator('description', {
                            rules: [{
                                required: true,
                                message: 'Please input description.'
                            }],
                            initialValue: this.formatData(this.props.highLeverageTask.details, 'description'),
                        })(
                            <Editor
                                editorState={this.props.highLeverageTask.newDescription}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                onEditorStateChange={this.onEditorChange}
                                toolbar={{
                                    options: [
                                        'inline',
                                        'blockType',
                                        'fontSize',
                                        'fontFamily',
                                        'list',
                                        'textAlign',
                                        'link',
                                        'embedded',
                                        'image',
                                        'remove',
                                        'colorPicker'
                                    ]}} />
                        )}
                    </Form.Item>
                    <Form.Item label="Points" {...formItemSize}>
                        {getFieldDecorator('points', {
                            rules: [{
                                required: true,
                                message: 'Please input tasks\' points'
                            }],
                            initialValue: this.formatData(this.props.highLeverageTask.details, 'points')
                        })(<Input type={'number'} />)}
                    </Form.Item>
                    <Form.Item label="Type" {...formItemSize}>
                        {getFieldDecorator('type', {
                            rules: [{
                                required: true,
                                message: 'Please select type.'
                            }],
                            initialValue: this.props.highLeverageTask.details.type
                        })(
                            <Radio.Group onChange={this.onTypeChange}>
                                <Radio value={'url'}>URL</Radio>
                                <Radio value={'call_booking'}>Call Booking</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                </Form>
            );
        }
    }
);

const mapStateToProps = state => {
    return {
        // coins
        coin: state.coins.coin,
        coins: state.coins.coins,
        
        // high leverage tasks
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
        setCoinList(details) {
            dispatch(setCoinList(details));
        },

        // high leverage tasks
        setHighLeverageTaskDetails(details) {
            dispatch(setHighLeverageTaskDetails(details));
        },
        setHighLeverageTaskList(details) {
            dispatch(setHighLeverageTaskList(details));
        },
        setHighLeverageTaskNewDescription(description) {
            dispatch(setHighLeverageTaskNewDescription(description));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HighLeverageTaskForm);