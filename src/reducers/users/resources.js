import apiCore from '../../utils/api-core';

export function getUsers(page, rowsPerPage) {
	return apiCore.get(`/api/v1/users?page=${page}&per_page=${rowsPerPage}&relationships[]=roles&order[email]=Asc`);
}

export function addUser(body) {
	return apiCore.post('/api/v1/users', body);
}

export function updateUser(id, body) {
	return apiCore.put(`/api/v1/users/${id}`, body);
}

export function deleteUser(id) {
	return apiCore.delete(`/api/v1/users/${id}`);
}

export function activateUser(id) {
	return apiCore.put(`/api/v1/users/${id}?activate=true`);
}
