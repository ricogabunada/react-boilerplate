import apiCore from '../../utils/api-core';

export function getRoles(page, rowsPerPage) {
	return apiCore.get(`/api/v1/roles?page=${page}&per_page=${rowsPerPage}&relationships[]=permissions&filter[is_deleted]==|0&order[updated_at]=Desc`);
}

export function getRole(id) {
	return apiCore.get(`/api/v1/roles/${id}`);
}

export function addRole(body) {
	return apiCore.post('/api/v1/roles', body);
}

export function updateRole(id, body) {
	return apiCore.put(`/api/v1/roles/${id}`, body);
}
