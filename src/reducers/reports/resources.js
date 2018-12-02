import apiCore from '../../utils/api-core';

export function getReports(from, to) {
	return apiCore.get(`/api/v1/reports/daily?from=${from}&to=${to}`);
}