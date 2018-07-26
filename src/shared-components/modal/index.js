import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Modal,
  Button
} from 'antd';
import moment from 'moment';
import './index.css';

class CommonModal extends Component {
	componentWillMount() {
    this.setState({
      visible: false,
    });
	}

  componentWillReceiveProps (nextProps) {
    if (nextProps.visible) {
      this.setState({
        visible: nextProps.visible
      });
      this.props.resetVisible(false);
    }

    if(nextProps.hasError) {
      this.setState({
        visible: true
      });
    }
  }

	componentWillUnmount() {
	}

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    this.props.onOk();

    if(!this.props.visible) {
      this.setState({
        visible: false,
      });
      this.props.resetVisible(false);
    }
  }

  handleCancel = (e) => {
    this.props.onCancel();
    this.setState({
      visible: false,
    });
    this.props.resetVisible(false);
  }

	render() {
		return (
      <div className="container-modal">
        <Modal
            title={this.props.header}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
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
