import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Input,
	Select,
	Form,
	notification,
} from 'antd';
import CoinListingApplicationForm from './form';

class CoinListingApplication extends Component {
	componentWillMount () {
	}

	handleOnCancel = () => {
		const form = this.formRef.props.form;
		form.resetFields();
	}

	saveFormRef = (formRef) => {
		this.formRef = formRef;
	}

	render() {

		return (
			<div>
				<CoinListingApplicationForm
					wrappedComponentRef={this.saveFormRef}
					visible={this.props.visible}
					coinListingApplicationDetails={this.props.coinListingApplicationDetails}
					header={this.props.header}
					resetVisible={this.props.resetVisible}
					onCancel={this.handleOnCancel}/>
			</div>
		);
	}
}
const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CoinListingApplication);
