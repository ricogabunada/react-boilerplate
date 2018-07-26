import session from './session';

export const isAuthenticated = props => {
  const { history, match } = props;

  if (session.get('token')) {
    if (match.path !== '/login') {
      history.replace({ pathname: match.url });
    } else {
      history.replace({ pathname: '/dashboard' });
    }
    return true;
  }

  if (match.path !== '/login') {
    history.replace({ pathname: '/login' });
  }
	return true;
};
