import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import {
	Alert,
	Form,
	Icon,
	Input,
	Button,
	Checkbox,
} from 'antd';
import {sendEmail} from '../../reducers/login/resources';
import './index.css';

const FormItem = Form.Item;

class ForgotPassword extends React.Component {
	componentWillMount() {
		this.setState({
			email: '',
			password: '',
			success: false,
			error: false,
		});
	}

	handleSubmit = e => {
		//temporary login for demo
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				sendEmail(values)
					.then(res => {
						if(res.success) {
							return this.setState({
								success: true,
								error: false,
							});
						}
						this.setState({
							success: false,
							error: true,
						});
					})
					.catch(err => {
						console.log('err: ', err);
					});
			}
		});
	}

	handleClose = key => {
		return () => {
			let state = this.state;

			state[key] = false;

			this.setState(state);
		}
	}

	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<div className="login-form-wrapper">
				{ this.state.success ?
					<Alert
						closable
						message="Email has been sent."
						type="success"
						showIcon
						afterClose={this.handleClose('success')}/> : null }

				{ this.state.error ?
					<Alert
						closable
						message="Oops! Please try again."
						type="error"
						showIcon
						afterClose={this.handleClose('error')}/> : null }

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

const ForgotPasswordForm = Form.create()(ForgotPassword);

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordForm);
