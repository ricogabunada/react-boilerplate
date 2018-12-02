import apiCore from '../../utils/api-core';
import _ from 'lodash';

export function getCoins(options = {}, cancellable = false) {
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
		return apiCore.cancellableGet(`/api/v1/coins?${query}`);
	}
	
	return apiCore.get(`/api/v1/coins?${query}`);
}

export function getCoin(id) {
	return apiCore.get(`/api/v1/coins/${id}`);
}

export function addCoin(body) {
	return apiCore.post('/api/v1/coins', body);
}

export function updateCoin(body, id) {
	return apiCore.put(`/api/v1/coins/${id}`, body);
}

export function deleteCoin(id) {
	return apiCore.delete(`/api/v1/coins/${id}`);
}

export function forceDeleteCoin(id) {
	return apiCore.delete(`/api/v1/coins/${id}?force=true`);
}

export function activateCoin(id) {
	return apiCore.put(`/api/v1/coins/${id}?activate=true`);
}

export function generateAPIKey(id) {
	return apiCore.post(`/api/v1/api-keys`, {coin_id:id});
}
