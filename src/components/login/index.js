import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button, Checkbox } from 'antd';

import {authenticate} from '../../reducers/login/resources';
import session from '../../utils/session';

import './index.css';

const FormItem = Form.Item;

class Login extends React.Component {
	componentWillMount() {
		this.setState({
			email: '',
			password: '',
			error: '',
		});
	}

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const {remember, ...data} = values;

				authenticate(data)
					.then(res => {
						session.set('userData', res)
						session.set('token', res.access_token);
						this.props.history.replace({ pathname: '/dashboard' });
					});
			}
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<div className="login-form-wrapper">
				<Form onSubmit={this.handleSubmit} className="login-form">
					<FormItem>
						{getFieldDecorator('email', {
							rules: [{ required: true, message: 'Please input your email!' }],
						})(
							<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
						)}
					</FormItem>
					<FormItem>
						{getFieldDecorator('password', {
							rules: [{ required: true, message: 'Please input your Password!' }],
						})(
							<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
						)}
					</FormItem>
					<FormItem>
						{getFieldDecorator('remember', {
							valuePropName: 'checked',
							initialValue: true,
						})(
							<Checkbox>Remember me</Checkbox>
						)}
						<a className="login-form-forgot" onClick={this.props.goTo('forgot-password')}>Forgot password</a>
						<Button type="primary" htmlType="submit" className="login-form-button">
							Log in
						</Button>
						{/* Or <a href="">register now!</a> */}
					</FormItem>
				</Form>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {
		goTo(url) {
			return () => dispatch(push(url));
		}
	};
};

const LoginForm = Form.create()(Login);

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
