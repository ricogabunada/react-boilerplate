import React, { Component } from 'react';
import { connect } from 'react-redux';
import RoleList from './list';
import {
	getPermissions,
} from '../../reducers/permissions/resources';
import {
	getRoles,
} from '../../reducers/roles/resources';

class Roles extends Component {
	componentWillMount () {
		this.setState({
			permissions: [],
			roles: [],
			pagination: {},
			loading: false,
		});

		this.getPermissions(1, 1000);
		this.getRoles(1, 25);
	}

	getPermissions = (page, rowsPerPage) => {
		getPermissions(page, rowsPerPage)
			.then(res =>{
				let permissions = [];

				permissions = res.data.map(val => {
					return {
						key: val.id,
						name: val.name,
					};
				});

				this.setState({
					permissions: permissions,
				});
			});
	}

	getRoles = (page, rowsPerPage) => {
		this.setState({ loading: true });

		getRoles(page, rowsPerPage)
			.then(res =>{
				let roles = [];
				let pagination = {};

				roles = res.data.map(val => {
					return {
						key: val.id,
						name: val.name,
						permissions: val.permissions,
					};
				});

				pagination = {
					total: res.total,
					pageSize: rowsPerPage,
				}

				this.setState({
					pagination: pagination,
					roles: roles,
					loading: false,
				});
			});
	}

	render() {

		return (
			<div>
				<RoleList
					getRoles={this.getRoles}
					pagination={this.state.pagination}
					permissions={this.state.permissions}
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

export default connect(mapStateToProps, mapDispatchToProps)(Roles);
