import apiCore from '../../utils/api-core';

export function getGetVeroEvents(page, rowsPerPage) {
	return apiCore.get(`/api/v1/getvero-events?page=${page}&per_page=${rowsPerPage}&relationships[]=coin`);
}

export function addGetVeroEvent(body) {
	return apiCore.post('/api/v1/getvero-events', body);
}

export function updateGetVeroEvent(id, body) {
	return apiCore.put(`/api/v1/getvero-events/${id}`, body);
}
