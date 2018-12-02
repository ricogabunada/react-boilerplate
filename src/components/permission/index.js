import React, { Component } from 'react';
import { connect } from 'react-redux';
import PermissionList from './list';
import {
	getPermissions,
} from '../../reducers/permissions/resources';

class Permissions extends Component {
	componentWillMount () {
		this.setState({
			permissions: [],
			pagination: {},
			loading: false,
		});

		this.getPermissions(1, 5);
	}

	getPermissions = (page, rowsPerPage) => {
		this.setState({ loading: true });

		getPermissions(page, rowsPerPage)
			.then(res =>{
				let permissions = [];
				let pagination = {};

				permissions = res.data.map(val => {
					return {
						key: val.id,
						name: val.name,
						description: val.description,
					};
				});

				pagination = {
					total: res.total,
					pageSize: rowsPerPage,
				}

				this.setState({
					pagination: pagination,
					permissions: permissions,
					loading: false,
				});
			});
	}

	render() {

		return (
			<div>
				<PermissionList
					getPermissions={this.getPermissions}
					pagination={this.state.pagination}
					permissions={this.state.permissions}
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

export default connect(mapStateToProps, mapDispatchToProps)(Permissions);
