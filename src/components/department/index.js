import React, { Component } from 'react';
import { connect } from 'react-redux';
import DepartmentList from './list';
import {
	getDepartments,
} from '../../reducers/departments/resources';

class Departments extends Component {
	componentWillMount () {
		this.setState({
			departments: [],
			pagination: {},
			loading: false,
		});

		this.getDepartments(1, 25);
	}

	getDepartments = (page, rowsPerPage) => {
		this.setState({ loading: true });

		getDepartments(page, rowsPerPage)
			.then(res =>{
				let departments = [];
				let pagination = {};

				departments = res.data.map(val => {
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
					departments: departments,
					loading: false,
				});
			});
	}

	render() {

		return (
			<div>
				<DepartmentList
					getDepartments={this.getDepartments}
					pagination={this.state.pagination}
					departments={this.state.departments}
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

export default connect(mapStateToProps, mapDispatchToProps)(Departments);
