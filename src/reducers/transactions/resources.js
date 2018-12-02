import apiCore from '../../utils/api-core';
import _ from 'lodash';

export function getTransactions(options = {}, cancellable = false) {
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
		return apiCore.cancellableGet(`/api/v1/transactions?${query}`);
	}
	
	return apiCore.get(`/api/v1/transactions?${query}`);
}

export function getTransaction(options = {}) {
    let query = '';
    let relationships = [];

    if (options.relationships.length > 0) {
		_.each(options.relationships, item => {
			relationships.push(`relationships[]=${item}`);
		});

		query += `${relationships.join("&")}`;
	}

	return apiCore.get(`/api/v1/transactions/${options.id}?${query}`);
}

export function addTransaction(body) {
	return apiCore.post('/api/v1/transactions', body);
}

export function updateTransaction(body, id) {
	return apiCore.put(`/api/v1/transactions/${id}`, body);
}

export function deleteTransaction(id) {
	return apiCore.delete(`/api/v1/transactions/${id}`);
}

export function forceDeleteTransaction(id) {
	return apiCore.delete(`/api/v1/transactions/${id}?force=true`);
}

export function activateTransaction(id) {
	return apiCore.put(`/api/v1/transactions/${id}?activate=true`);
}
