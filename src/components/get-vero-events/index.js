import React, { Component } from 'react';
import { connect } from 'react-redux';
import GetVeroList from './list';
import {
	getGetVeroEvents,
} from '../../reducers/get-vero-events/resources';

class GetVeroEvents extends Component {
	componentWillMount () {
		this.setState({
			getVeroEvents: [],
			pagination: {},
			loading: false,
		});

		this.getGetVeroEvents(1, 25);
	}

	getGetVeroEvents = (page, rowsPerPage) => {
		this.setState({ loading: true });

		getGetVeroEvents(page, rowsPerPage)
			.then(res =>{
				let getVeroEvents = [];
				let pagination = {};

				getVeroEvents = res.data.map(val => {
					return {
						key: val.id,
						coin: val.coin.name,
						user_email_verification_event: val.user_email_verification_event,
						coin_comp_welcome_email_event: val.coin_comp_welcome_email_event,
						coin_comp_leverage_task_event: val.coin_comp_leverage_task_event,
						coin_comp_congratulatory_event: val.coin_comp_congratulatory_event,
						coin_comp_thank_you_event: val.coin_comp_thank_you_event,
						coin_listing_application_event: val.coin_listing_application_event,
						transaction_create_event: val.transaction_create_event,
						transaction_cancelled_event: val.transaction_cancelled_event,
						transaction_completed_event: val.transaction_completed_event,
						auth_token: val.auth_token,
						created_at: val.created_at,
						updated_at: val.updated_at,
					};
				});

				pagination = {
					total: res.total,
					pageSize: rowsPerPage,
				}

				this.setState({
					pagination: pagination,
					getVeroEvents: getVeroEvents,
					loading: false,
				});
			});
	}

	render() {
		return (
			<div>
				<GetVeroList
					getGetVeroEvents={this.getGetVeroEvents}
					pagination={this.state.pagination}
					getVeroEvents={this.state.getVeroEvents}
					loading={this.state.loading}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(GetVeroEvents);
