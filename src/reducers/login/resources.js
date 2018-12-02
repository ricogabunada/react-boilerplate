import apiCore from '../../utils/api-core';

export function authenticate(body) {
	return apiCore.post(`/api/v1/auth/login`, body);
}

export function sendEmail(body) {
	return apiCore.post(`/api/v1/auth/password/email`, body);
}

export function resetPassword(body) {
	return apiCore.post(`/api/v1/auth/password/reset`, body);
}
