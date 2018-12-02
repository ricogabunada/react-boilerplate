import React, { Component } from 'react';
import countryCodes from './country-codes.json';
import _ from 'lodash';
import {
    Form,
    Select,
    Input
} from 'antd';
import './index.css';

const FormItem = Form.Item;
const Option = Select.Option;

class PhoneNumber extends Component {
	render() {
        const {
            formProps,
            style,
            rules,
            fieldName,
            fieldLabel,
            fieldLabelName
        } = this.props;
        console.log(this.props);
        const { getFieldDecorator } = formProps;
        const initValue = countryCodes[0].dial_code;
        const prefixSelector = getFieldDecorator({fieldLabelName}, {
            initialValue: initValue,
        })(
            <Select>
                {
                    _.each(countryCodes, (country) => {
                        `${<Option value={country.dial_code}> {country.name} </Option>}`
                    })
                }
            </Select>
        );

		return (
            <div>
                <FormItem label={fieldLabel} {...style}>
                    {getFieldDecorator({fieldName}, {
                        rules: rules
                    })(
                        <Input addonBefore={prefixSelector} />
                    )}
                </FormItem>
            </div>
		);
	}
}

export default PhoneNumber;
