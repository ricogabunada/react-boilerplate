import apiCore from '../../utils/api-core';

export function authenticate(body) {
	return apiCore.post(`/api/v1/login`, body);
}
