import apiCore from '../../utils/api-core';
import _ from 'lodash';

export function getCoinPhaseSettings(options = {}, cancellable = false) {
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
		return apiCore.cancellableGet(`/api/v1/airdrop-phase-settings?${query}`);
	}

	return apiCore.get(`/api/v1/airdrop-phase-settings?${query}`);
}

export function getCoinPhaseSetting(id) {
	return apiCore.get(`/api/v1/airdrop-phase-settings/${id}`);
}

export function addCoinPhaseSetting(body) {
	return apiCore.post('/api/v1/airdrop-phase-settings', body);
}

export function updateCoinPhaseSetting(body, id) {
	return apiCore.put(`/api/v1/airdrop-phase-settings/${id}`, body);
}

export function deleteCoinPhaseSetting(id) {
	return apiCore.delete(`/api/v1/airdrop-phase-settings/${id}`);
}

export function forceDeleteCoinPhaseSetting(id) {
	return apiCore.delete(`/api/v1/airdrop-phase-settings/${id}?force=true`);
}

export function activateCoinPhaseSetting(id) {
	return apiCore.put(`/api/v1/airdrop-phase-settings/${id}?activate=true`);
}
