import apiCore from '../../utils/api-core';

export function getDepartments(page, rowsPerPage) {
	return apiCore.get(`/api/v1/departments?page=${page}&per_page=${rowsPerPage}&filter[is_deleted]==|0&order[updated_at]=Desc`);
}

export function getDepartment(id) {
	return apiCore.get(`/api/v1/departments/${id}`);
}

export function addDepartment(body) {
	return apiCore.post('/api/v1/departments', body);
}

export function updateDepartment(id, body) {
	return apiCore.put(`/api/v1/departments/${id}`, body);
}
