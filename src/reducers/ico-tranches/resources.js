import apiCore from '../../utils/api-core';
import _ from 'lodash';

export function getICOTranches(options = {}, cancellable = false) {
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
		return apiCore.cancellableGet(`/api/v1/ico-tranches?${query}`);
	}
	
	return apiCore.get(`/api/v1/ico-tranches?${query}`);
}

export function getICOTranche(id) {
	return apiCore.get(`/api/v1/ico-tranches/${id}`);
}

export function addICOTranche(body) {
	return apiCore.post('/api/v1/ico-tranches', body);
}

export function updateICOTranche(body, id) {
	return apiCore.put(`/api/v1/ico-tranches/${id}`, body);
}

export function updateICOTrancheStatus(status, id) {
	return apiCore.put(`/api/v1/ico-tranches/${id}?status=${status}`);
}

export function deleteICOTranche(id) {
	return apiCore.delete(`/api/v1/ico-tranches/${id}`);
}

export function forceDeleteICOTranche(id) {
	return apiCore.delete(`/api/v1/ico-tranches/${id}?force=true`);
}

export function activateICOTranche(id) {
	return apiCore.put(`/api/v1/ico-tranches/${id}?activate=true`);
}
