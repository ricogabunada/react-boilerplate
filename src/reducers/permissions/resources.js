import apiCore from '../../utils/api-core';

export function getPermissions(page, rowsPerPage) {
	return apiCore.get(`/api/v1/permissions?page=${page}&per_page=${rowsPerPage}&filter[is_deleted]==|0&order[name]=Asc`);
}

export function getPermission(id) {
	return apiCore.get(`/api/v1/permissions/${id}`);
}

export function addPermission(body) {
	return apiCore.post('/api/v1/permissions', body);
}

export function updatePermission(id, body) {
	return apiCore.put(`/api/v1/permissions/${id}`, body);
}
