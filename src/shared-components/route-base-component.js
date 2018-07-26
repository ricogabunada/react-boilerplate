import React from 'react';
import { withRouter } from 'react-router-dom';

/* @middlewares
 * array of functions that needs to be executed before rendering the WrapComponents
 *
 * @WrapComponent
 * component that will be rendered
 */
let loading = true;

const RouteBaseComponent = (middlewares, WrapComponent) => {
	class Component extends React.Component {
		componentWillMount() {
      const self = this;
      let customArr = middlewares;

      while (customArr.length) {
        if (!customArr.shift().call(this, self.props)) {
          loading = !(self.props.match.path === '/login');
          break;
        }
        loading = false;
      }
		}

		render() {
      if (loading) {
        return <div>Temporary</div>;
      }
			return <WrapComponent {...this.props} />;
		}
	}

	return withRouter(Component);
};

export default RouteBaseComponent;
