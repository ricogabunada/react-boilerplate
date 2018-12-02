import apiCore from '../../utils/api-core';
import _ from 'lodash';

export function getCoinPhaseParticipants(options = {}, cancellable = false) {
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
		return apiCore.cancellableGet(`/api/v1/airdrop-phases/${options.phase_id}/participants?${query}`);
	}

	return apiCore.get(`/api/v1/airdrop-phases/${options.phase_id}/participants?${query}`);
}

export function getCoinPhaseParticipant(options) {
	return apiCore.get(`/api/v1/airdrop-phases/${options.phase_id}/participants/${options.participant_id}`);
}

export function addCoinPhaseParticipant(options) {
	return apiCore.post(`/api/v1/airdrop-phases/${options.phase_id}/participants`, options.body);
}

export function updateCoinPhaseParticipant(options) {
	return apiCore.put(`/api/v1/airdrop-phases/${options.phase_id}/participants/${options.participant_id}`, options.body);
}

export function updateCoinPhaseParticipantBanner(options) {
	return apiCore.put(`/api/v1/airdrop-phases/${options.phase_id}/participants/${options.participant_id}?update=banner`, options.body);
}

export function deleteCoinPhaseParticipant(options) {
	return apiCore.delete(`/api/v1/airdrop-phases/${options.phase_id}/participants/${options.participant_id}`);
}

export function forceDeleteCoinPhaseParticipant(options) {
	return apiCore.delete(`/api/v1/airdrop-phases/${options.phase_id}/participants/${options.participant_id}?force=true`);
}

export function activateCoinPhaseParticipant(options) {
	return apiCore.put(`/api/v1/airdrop-phases/${options.phase_id}/participants/${options.participant_id}?activate=true`);
}
