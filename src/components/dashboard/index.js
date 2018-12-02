import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Col, Row } from 'antd';
import './index.css';

class Dashboard extends Component {
	componentWillMount() {
	}

	componentWillUnmount() {
	}

	render() {
		return (
			<div className="container-dashboard">
				<Row gutter={16}>
					<Col span={6}>
						<Card title="Card title" bordered={false}>Card content</Card>
					</Col>
					<Col span={6}>
						<Card title="Card title" bordered={false}>Card content</Card>
					</Col>
					<Col span={6}>
						<Card title="Card title" bordered={false}>Card content</Card>
					</Col>
					<Col span={6}>
						<Card title="Card title" bordered={false}>Card content</Card>
					</Col>
				</Row>
				<Row style={{marginTop: 16}}>
					<div style={{ padding: 24, background: '#fff', height: '90vh' }}>
						Content
					</div>
				</Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
