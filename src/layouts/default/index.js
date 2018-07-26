import React from 'react';
import { push } from 'react-router-redux';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {
	Layout,
	Menu,
	Icon,
} from 'antd';
import session from '../../utils/session';
//import './index.css';

const { Sider, Footer, Content } = Layout;

const siderStyles = {
	overflow: 'auto',
	height: '100vh',
	position: 'fixed',
	left: 0,
	backgroundColor: '#1071b8',
};
const menuStyles = {
	backgroundColor: '#1071b8',
}
const logoStyles = {
	width: 150,
}
const subLayoutStyles = {
	marginLeft: 200
}
const contentStyles = {
	margin: '24px 16px 0',
	overflow: 'initial',
}

// Define layout
class DefaultLayout extends React.Component {
	componentWillMount () {
		this.setState({
			collapsed: false
		});
	}

	handleClick = e => {
		let key = e.key;

		if(key === 'logout') {
			return this.logout();
		}
	}

	logout = () => {
		let props = this.props.children.props;
		session.unset('userData');
		session.unset('token');
		props.history.replace({ pathname: '/login' });
	}

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		});
	}

	render() {

		return (
			  <Layout>
				<Sider style={siderStyles}>
				  <div className="logo">
					<img src="./assets/logo.png" style={logoStyles} />
				  </div>
				  <Menu theme="dark" mode="inline"
					style={menuStyles}
					onClick={this.handleClick}
					defaultSelectedKeys={['4']}>
					<Menu.Item key="1">
					  <Icon type="user" />
					  <span className="nav-text">nav 1</span>
					</Menu.Item>
					<Menu.Item key="2">
					  <Icon type="video-camera" />
					  <span className="nav-text">nav 2</span>
					</Menu.Item>
					<Menu.Item key="3">
					  <Icon type="upload" />
					  <span className="nav-text">nav 3</span>
					</Menu.Item>
					<Menu.Item key="4">
					  <Icon type="bar-chart" />
					  <span className="nav-text">nav 4</span>
					</Menu.Item>
					<Menu.Item key="5">
					  <Icon type="cloud-o" />
					  <span className="nav-text">nav 5</span>
					</Menu.Item>
					<Menu.Item key="6">
					  <Icon type="appstore-o" />
					  <span className="nav-text">nav 6</span>
					</Menu.Item>
					<Menu.Item key="7">
					  <Icon type="team" />
					  <span className="nav-text">nav 7</span>
					</Menu.Item>
					<Menu.Item key="8">
					  <Icon type="shop" />
					  <span className="nav-text">nav 8</span>
					</Menu.Item>
					<Menu.Item key="logout">
					  <Icon type="logout" />
					  <span className="nav-text">Logout</span>
					</Menu.Item>
				  </Menu>
				</Sider>
				<Layout style={subLayoutStyles}>
				  <Content style={contentStyles}>
					<div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
					  ...
					  <br />
					  Really
					  <br />...<br />...<br />...<br />
					  long
					  <br />...<br />...<br />...<br />...<br />...<br />...
					  <br />...<br />...<br />...<br />...<br />...<br />...
					  <br />...<br />...<br />...<br />...<br />...<br />...
					  <br />...<br />...<br />...<br />...<br />...<br />...
					  <br />...<br />...<br />...<br />...<br />...<br />...
					  <br />...<br />...<br />...<br />...<br />...<br />...
					  <br />...<br />...<br />...<br />...<br />...<br />
					  content
					</div>
				  </Content>
				  <Footer style={{ textAlign: 'center' }}>
					Copyright © 2018. Cryptaldash Exchange. All Rights Reserved.
				  </Footer>
				</Layout>
			  </Layout>
		);
	}
}

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {
		goTo(url) {
			return () => dispatch(push(url));
		}
  };
};

const ConnectedLayout = connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);

export default ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={matchProps => (
        <ConnectedLayout>
          <Component {...matchProps} />
        </ConnectedLayout>
			)}
		/>
	);
};

