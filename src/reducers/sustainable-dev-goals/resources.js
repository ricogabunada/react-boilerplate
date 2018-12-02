import apiCore from '../../utils/api-core';
import _ from 'lodash';

export function getSustainableDevGoals(options = {}, cancellable = false) {
	let filters = [];
	let orderBy = [];
	let relationships = [];

	let query = `page=${options.current}&per_page=${options.pageSize}`;

	if (Object.keys(options.filters).length > 0) {
		Object.keys(options.filters).map( key => {
			filters.push(`filter[${key}]=${options.filters[key]}`);
		});

		query += `&${filters.join("&")}`;
	}

	if (Object.keys(options.orderBy).length > 0) {
		Object.keys(options.orderBy).map( key => {
			orderBy.push(`order[${key}]=${options.orderBy[key]}`);
		});

		query += `&${orderBy.join("&")}`;
	}

	if (options.relationships && options.relationships.length > 0) {
		_.each(options.relationships, item => {
			relationships.push(`relationships[]=${item}`);
		});

		query += `&${relationships.join("&")}`;
	}

	if (cancellable) {
		return apiCore.cancellableGet(`/api/v1/sustainable-dev-goals?${query}`);
	}

	return apiCore.get(`/api/v1/sustainable-dev-goals?${query}`);
}

export function getSustainableDevGoal(id) {
	return apiCore.get(`/api/v1/sustainable-dev-goals/${id}`);
}
