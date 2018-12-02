import React, { Component } from 'react';
import { connect } from 'react-redux';
import PermissionList from './list';
import {
	getUsers,
} from '../../reducers/users/resources';
import {
	getRoles,
} from '../../reducers/roles/resources';

class Users extends Component {
	componentWillMount () {
		this.setState({
			users: [],
			roles: [],
			pagination: {},
			loading: false,
		});

		this.getRoles(1, 1000);
		this.getUsers(1, 25);
	}

	getRoles = (page, rowsPerPage) => {
		getRoles(page, rowsPerPage)
			.then(res =>{
				let roles = [];

				roles = res.data.map(val => {
					return {
						key: val.id,
						name: val.name,
					};
				});

				this.setState({
					roles: roles,
				});
			});
	}

	getUsers = (page, rowsPerPage) => {
		this.setState({ loading: true });

		getUsers(page, rowsPerPage)
			.then(res =>{
				let users = [];
				let pagination = {};

				users = res.data.map(val => {
					return {
						key: val.id,
						email: val.email,
						roles: val.roles,
						is_active: val.is_active,
						is_verified: val.is_verified,
					};
				});

				pagination = {
					total: res.total,
					pageSize: rowsPerPage,
				}

				this.setState({
					pagination: pagination,
					users: users,
					loading: false,
				});
			});
	}

	render() {
		return (
			<div>
				<PermissionList
					getUsers={this.getUsers}
					pagination={this.state.pagination}
					users={this.state.users}
					roles={this.state.roles}
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

export default connect(mapStateToProps, mapDispatchToProps)(Users);
