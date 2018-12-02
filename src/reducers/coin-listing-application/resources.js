import apiCore from '../../utils/api-core';

export function getCoinListingApplications(page, rowsPerPage) {
	return apiCore.get(`/api/v1/coin-listing-applications?page=${page}&per_page=${rowsPerPage}&order[id]=Desc`);
}

export function getCoinListingApplication(id) {
	return apiCore.get(`/api/v1/coin-listing-applications/${id}`);
}
