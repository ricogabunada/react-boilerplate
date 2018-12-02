import React, { Component } from 'react';
import { connect } from 'react-redux';

/**
 * Helpers
 */
import _ from 'lodash';
import Format from '../../utils/format';

/**
 * Components
 */
import {
    Form,
    Input,
    InputNumber,
} from 'antd';

/**
 * ICO tranche form
 */
const ICOTrancheForm = Form.create()(
    class extends Component {
        /**
         * Format data
         * @param {Object} data
         * @param {String} field
         * @return {mixed}
         */
        formatData(data, field) {
			if (data && Object.keys(data).length > 0 && data[field]) {
				return data[field];
			}

			return '';
        }
        
        /**
         * Render
         */
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
                <Form layout="horizontal">
                    <Form.Item label="Tranche Name" {...formItemSize}>
                        {getFieldDecorator('name', {
							rules: [{
								required: true,
								message: 'Please input tranche name.'
							}],
                            initialValue: this.formatData(this.props.ICOTranche.details, 'name')
                        })(<Input type='text'/>)}
                    </Form.Item>
                    <Form.Item label="Token Price USD" {...formItemSize}>
						{getFieldDecorator('usd_price', {
							rules: [{
								required: true,
								message: 'Please input token price USD.'
							}, {
								pattern: /^[0-9.,]+$/,
								message: 'Please input a valid amount.'
							}],
							initialValue: this.formatData(this.props.ICOTranche.details.transaction_settings, 'usd_price') || 0
                        })(<InputNumber type='text'
								style={{'width': '100%'}}
								formatter={value => Format.number(value, '$', '', 4)}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}/>)}
					</Form.Item>
                    <Form.Item label="Tokens in Tranche" {...formItemSize}>
						{getFieldDecorator('volume_for_sale', {
							rules: [{
								required: true,
								message: 'Please input tokens in tranche.'
							}, {
								pattern: /^[0-9.,]+$/,
								message: 'Please input a valid amount.'
							}],
							initialValue: this.formatData(this.props.ICOTranche.details.transaction_settings, 'volume_for_sale') || 0
                        })(<InputNumber type='text'
								style={{'width': '100%'}}
								formatter={value => Format.number(value, '', '', 0)}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}/>)}
					</Form.Item>
                    <Form.Item label="Tokens Sold" {...formItemSize}
                        style={{display: this.props.action.toLowerCase() === 'update' ? 'block' : 'none'}}>
						{getFieldDecorator('volume_sold', {
							rules: [{
								required: true,
								message: 'Please input tokens sold.'
							}, {
								pattern: /^[0-9.,]+$/,
								message: 'Please input a valid amount.'
							}],
							initialValue: this.formatData(this.props.ICOTranche.details.transaction_settings, 'volume_sold') || 0
                        })(<InputNumber type='text'
                                disabled={true}
								style={{'width': '100%'}}
								formatter={value => Format.number(value, '', '', 0)}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}/>)}
					</Form.Item>
                    <Form.Item label="Token Discount USD" {...formItemSize}
                        style={{display: this.props.action.toLowerCase() === 'update' ? 'block' : 'none'}}>
						{getFieldDecorator('discount_usd_price', {
							rules: [{
								required: true,
								message: 'Please input token discount USD.'
							}, {
								pattern: /^[0-9.,]+$/,
								message: 'Please input a valid amount.'
							}],
							initialValue: this.formatData(this.props.ICOTranche.details, 'discount_usd_price') || 0
                        })(<InputNumber type='text'
                                disabled={true}
								style={{'width': '100%'}}
								formatter={value => Format.number(value, '$', '', 4)}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}/>)}
					</Form.Item>
                    <Form.Item label="Token Discount Percentage" {...formItemSize}
                        style={{display: this.props.action.toLowerCase() === 'update' ? 'block' : 'none'}}>
						{getFieldDecorator('discount_percentage', {
							rules: [{
								required: true,
								message: 'Please input token discount percentage.'
							}, {
								pattern: /^[0-9.,]+$/,
								message: 'Please input a valid amount.'
							}],
							initialValue: this.formatData(this.props.ICOTranche.details, 'discount_percentage') || 0
                        })(<InputNumber type='text'
                                disabled={true}
								style={{'width': '100%'}}
								formatter={value => Format.number(value, '', '%')}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}/>)}
					</Form.Item>
                    <Form.Item label="Tranche Revenue" {...formItemSize}
                        style={{display: this.props.action.toLowerCase() === 'update' ? 'block' : 'none'}}>
						{getFieldDecorator('total_revenue', {
							rules: [{
								required: true,
								message: 'Please input token discount percentage.'
							}, {
								pattern: /^[0-9.,]+$/,
								message: 'Please input a valid amount.'
							}],
							initialValue: this.formatData(this.props.ICOTranche.details, 'total_revenue') || 0
                        })(<InputNumber type='text'
                                disabled={true}
								style={{'width': '100%'}}
								formatter={value => Format.number(value, '', '', 0)}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}/>)}
					</Form.Item>
                </Form>
            )
        }
    }
);

const mapStateToProps = state => {
    return {
        // ico
		ICO: state.icos.ICO,
		ICOs: state.icos.ICOs,

        // ico tranches
		ICOTranche: state.icoTranches.ICOTranche,
		ICOTranches: state.icoTranches.ICOTranches,
    }
}

const mapDispatchToProps = dispatch => {
    return { }
}

export default connect(mapStateToProps, mapDispatchToProps)(ICOTrancheForm);