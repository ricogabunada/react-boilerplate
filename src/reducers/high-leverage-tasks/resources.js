import apiCore from '../../utils/api-core';
import _ from 'lodash';

export function getHighLeverageTasks(options = {}, cancellable = false) {
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

	if (options.relationships.length > 0) {
		_.each(options.relationships, item => {
			relationships.push(`relationships[]=${item}`);
		});

		query += `&${relationships.join("&")}`;
	}
	
	if (cancellable) {
		return apiCore.cancellableGet(`/api/v1/high-leverage-tasks?${query}`);
	}
	
	return apiCore.get(`/api/v1/high-leverage-tasks?${query}`);
}

export function getHighLeverageTask(id) {
	return apiCore.get(`/api/v1/high-leverage-tasks/${id}`);
}

export function addHighLeverageTask(body) {
	return apiCore.post('/api/v1/high-leverage-tasks', body);
}

export function updateHighLeverageTask(body, id) {
	return apiCore.put(`/api/v1/high-leverage-tasks/${id}`, body);
}

export function deleteHighLeverageTask(id) {
	return apiCore.delete(`/api/v1/high-leverage-tasks/${id}`);
}

export function forceDeleteHighLeverageTask(id) {
	return apiCore.delete(`/api/v1/high-leverage-tasks/${id}?force=true`);
}

export function activateHighLeverageTask(id) {
	return apiCore.put(`/api/v1/high-leverage-tasks/${id}?activate=true`);
}
