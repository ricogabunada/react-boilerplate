import React from 'react';
import { push } from 'react-router-redux';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import {
	Row,
	Layout,
	Menu,
	Icon,
} from 'antd';
import session from '../../utils/session';
import './index.css';

const { Header, Sider, Footer, Content } = Layout;
const SubMenu = Menu.SubMenu;

const menuStyles = {
	backgroundColor: '#1071b8',
}
const headerStyles = {
	background: '#fff',
	padding: 0,
}
const logoStyles = {
	width: 150,
}
const contentStyles = {
	margin: '24px 16px 0',
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

		if(key === '/logout') {
			return this.logout();
		}

		return this.props.goTo(key);
	}

	logout = () => {
		let props = this.props.children.props;
		session.unset('userData');
		session.unset('token');
		props.history.replace({ pathname: '/login' });
	}

	render() {
		return (
			<Layout>
				<Sider
					className="sidebar-bg-color"
					breakpoint="md"
					collapsedWidth="0">

					<div className="logo">
						<img src="/assets/logo.png" style={logoStyles} />
					</div>

					<Menu theme="dark" mode="inline"
						style={menuStyles}
						onClick={this.handleClick}>
						<Menu.Item key="dashboard">
							<Icon type="dashboard" />
							<span className="nav-text">Dashboard</span>
						</Menu.Item>

						<SubMenu
							key="access-control"
							title={<span><Icon type="lock" /><span>Access Control</span></span>}>
							<Menu.Item key="/users">
								<Icon type="user" />
								<span className="nav-text">Users</span>
							</Menu.Item>
							<Menu.Item key="/roles">
								<Icon type="usergroup-add" />
								<span className="nav-text">Roles</span>
							</Menu.Item>
							<Menu.Item key="/permissions">
								<Icon type="solution" />
								<span className="nav-text">Permissions</span>
							</Menu.Item>
							<Menu.Item key="/departments">
								<Icon type="cluster" theme="outlined" />
								<span className="nav-text">Departments</span>
							</Menu.Item>
						</SubMenu>
						<Menu.Item key="/coins">
							<Icon type="dollar" />
							<span className="nav-text">Coins</span>
						</Menu.Item>
						<Menu.Item key="/get-vero-events">
							<Icon type="thunderbolt" />
							<span className="nav-text">GetVero Events</span>
						</Menu.Item>
						<Menu.Item key="/icos">
							<Icon type="bars" />
							<span className="nav-text">ICO List</span>
						</Menu.Item>
						<SubMenu
							key="coin-competition"
							title={<span><Icon type="gold"/><span>Coin Competition</span></span>}>
							<Menu.Item key="/coin-competitions">
								<Icon type="bars" />
								<span className="nav-text">List</span>
							</Menu.Item>
							<SubMenu
								key="participant"
								title={<span><Icon type="bars"/><span>Participant</span></span>}>
								<Menu.Item key="/participant-high-leverage-tasks">
									<Icon type="bars" />
									<span className="nav-text">Tasks</span>
								</Menu.Item>
							</SubMenu>
						</SubMenu>
						<Menu.Item key="/high-leverage-tasks">
							<Icon type="bars" />
							<span className="nav-text">High Leverage Tasks</span>
						</Menu.Item>
						<Menu.Item key="/airdrops">
							<Icon type="rocket" theme="outlined" />
							<span className="nav-text">Airdrop</span>
						</Menu.Item>
						<Menu.Item key="/transactions">
							<Icon type="audit" theme="outlined" />
							<span className="nav-text">Transactions</span>
						</Menu.Item>
						<Menu.Item key="/coin-listing-applications">
							<Icon type="audit" theme="outlined" />
							<span className="nav-text">Coin Listing Applications</span>
						</Menu.Item>
						<Menu.Item key="/reports">
							<Icon type="stock" theme="outlined" />
							<span className="nav-text">Reports</span>
						</Menu.Item>
						<Menu.Item key="/logout">
							<Icon type="logout" />
							<span className="nav-text">Logout</span>
						</Menu.Item>
					  </Menu>
				</Sider>
				<Layout>
					<div className="container-dashboard">
						<Row style={{margin: 15}}>
							<div style={{
									padding: 24,
									background: '#fff',
									minHeight: 'calc(100vh - 100px)',
									height: 'auto',
								}}>
								<Content style={contentStyles}>
									{this.props.children}
								</Content>
							</div>
						</Row>
					</div>
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
			dispatch(push(url));
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

