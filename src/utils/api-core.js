import axios from 'axios';
import config from '../config';
import session from './session';

let def = {};

const obj = {
	true : () => {
		return {
			...def,
			authorization: 'Bearer ' + session.get('token'),
		}
	},
	false: () => {
		return def;
	},
};

let apiConfig = {};

export default {
	get(api) {
		apiConfig.headers = obj[session.get('token') !== null]();
		return axios
			.get(`${config.api.host}${api}`, apiConfig)
			.then(response => {
				return response.data;
			})
			.catch(error => {
				if (error.response) {
					const errorData = error.response;
					// Unauthorized
					if (errorData.status === 401) {
						// logout, redirect to login
            session.unset('userData');
            session.unset('token');
            window.location.reload();
					}

					throw errorData;
				}
				return error;
			});
	},

	put(api, body) {
		apiConfig.headers = obj[session.get('token') !== null]();
		return axios
			.put(`${config.api.host}${api}`, body, apiConfig)
			.then(response => {
				return response.data;
			})
			.catch(error => {
				if (error.response) {
					const errorData = error.response;
					// Unauthorized
					if (errorData.status === 401) {
						// logout, redirect to login
            session.unset('userData');
            session.unset('token');
            window.location.reload();
					}

					throw errorData;
				}
				throw error;
			});
	},

	post(api, body) {
		apiConfig.headers = obj[session.get('token') !== null]();
		return axios
			.post(`${config.api.host}${api}`, body, apiConfig)
			.then(response => {
				return response.data;
			})
			.catch(error => {
				console.log(error);
				if (error.response) {
					const errorData = error.response;
					// Unauthorized
					if (errorData.status === 401) {
						// logout, redirect to login
            session.unset('userData');
            session.unset('token');
            window.location.reload();
					}

					throw errorData;
				}
				throw error;
			});
	},

	delete(api) {
		apiConfig.headers = obj[session.get('token') !== null]();
		return axios
			.delete(`${config.api.host}${api}`, apiConfig)
			.then(response => {
				return response.data;
			})
			.catch(error => {
				if (error.response) {
					const errorData = error.response;
					// Unauthorized
					if (errorData.status === 401) {
						// logout, redirect to login
            session.unset('userData');
            session.unset('token');
            window.location.reload();
					}

					throw errorData;
				}
				throw error;
			});
	},
};
