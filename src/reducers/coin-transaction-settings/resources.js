import apiCore from '../../utils/api-core';
import _ from 'lodash';

export function getCoinTransactionSettings(options = {}, cancellable = false) {
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
		return apiCore.cancellableGet(`/api/v1/coin-transaction-settings?${query}`);
	}
	
	return apiCore.get(`/api/v1/coin-transaction-settings?${query}`);
}

export function getCoinTransactionSetting(id) {
	return apiCore.get(`/api/v1/coin-transaction-settings/${id}`);
}

export function addCoinTransactionSetting(body) {
	return apiCore.post('/api/v1/coin-transaction-settings', body);
}

export function updateCoinTransactionSetting(body, id) {
	return apiCore.put(`/api/v1/coin-transaction-settings/${id}`, body);
}

export function deleteCoinTransactionSetting(id) {
	return apiCore.delete(`/api/v1/coin-transaction-settings/${id}`);
}

export function forceDeleteCoinTransactionSetting(id) {
	return apiCore.delete(`/api/v1/coin-transaction-settings/${id}?force=true`);
}

export function activateCoinTransactionSetting(id) {
	return apiCore.put(`/api/v1/coin-transaction-settings/${id}?activate=true`);
}
