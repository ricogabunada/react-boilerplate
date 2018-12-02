import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import './index.css';

class CommonModal extends Component {
	componentWillMount() {
		this.setState({
			visible: false,
		});
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.visible) {
			this.setState({visible: nextProps.visible});
			this.props.resetVisible(false);
		}

		if(nextProps.hasError) {
			this.setState({visible: true});
		}
	}

	showModal = () => {
		this.setState({visible: true,});
	}

	handleAfterClose = () => {
		if (typeof this.props.onAfterClose === "function") { 
			return this.props.onAfterClose();
		}

		return true;
	}

	handleOk = (e) => {
		this.props.onOk();
	}

	handleCancel = (e) => {
		this.props.onCancel();
		this.setState({visible: false,});
		this.props.resetVisible(false);
	}

	render() {
		return (
			<div className="container-modal">
				<Modal
					maskClosable={false}
					keyboard={this.props.keyboard !== 'undefined' ? this.props.keyboard : true}
					footer={this.props.footer !== 'undefined' ? this.props.footer : true}
					okText={this.props.okText !== 'undefined' ? this.props.okText : 'Ok'}
					width={this.props.width}
					style={this.props.style}
					title={this.props.header}
					visible={this.state.visible}
					afterClose={this.handleAfterClose}
					onOk={this.handleOk}
					onCancel={this.handleCancel}>
					{this.props.children}
				</Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(CommonModal);
