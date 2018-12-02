import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import {
	Alert,
	Form,
	Icon,
	Input,
	Button,
	Checkbox
} from 'antd';
import {resetPassword} from '../../reducers/login/resources';
import './index.css';

const FormItem = Form.Item;

class ResetPassword extends React.Component {
	componentWillMount() {
		this.setState({
			token: '',
			success: false,
			error: false,
		});
	}

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				values['token'] = this.props.match.params.token;

				resetPassword(values)
					.then(res => {
						if(res.success) {
							return this.setState({
								success: true,
								error: false,
								errors: [],
							});
						}
						this.setState({
							success: false,
							error: true,
						});
					})
					.catch(err => {
						let reason = err.data.reason;
						let errors = [];

						Object.keys(reason).map(key => {
							let errorCollection = reason[key];

							errorCollection.map((val,index) => {
								let formatError = <p key={key + index}>{val}</p>;

								errors.push(formatError);
							});
						})

						this.setState({
							error: true,
							errors: errors,
						});
					});
			}
		});
	}

	handleClose = key => {
		return () => {
			let state = this.state;

			state[key] = false;
			state['errors'] = [];

			this.setState(state);
		}
	}

	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<div className="login-form-wrapper reset-password">
				{ this.state.success ?
					<Alert
						closable
						message="Password has been successfully changed."
						type="success"
						showIcon
						afterClose={this.handleClose('success')}/> : null }

				{ this.state.error ?
					<Alert
						closable
						message={this.state.errors}
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
						{getFieldDecorator('password', {
							rules: [{ required: true, message: 'Please input your password!' }],
						})(
							<Input type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Password" />
						)}
					</FormItem>
					<FormItem>
						{getFieldDecorator('password_confirmation', {
							rules: [{ required: true, message: 'Please confirm your password!' }],
						})(
							<Input type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Confirm Password" />
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

const ResetPasswordForm = Form.create()(ResetPassword);

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(ResetPasswordForm)
);
