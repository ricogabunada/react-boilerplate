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
		//temporary login for demo
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const {remember, ...data} = values;
				return console.log(data);

				authenticate(data)
					.then(res => {
						console.log('Received values of form: ', res);
						session.set('userData', res)
						session.set('token', res.remember_token);
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
						<Button type="primary" htmlType="submit" className="login-form-button">
							Reset Password
						</Button>
						<a onClick={this.props.goTo('login')}><Icon type="arrow-left" /> Login</a>
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
