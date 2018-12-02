import React, { Component } from 'react';
import { DatePicker, Button } from 'antd';
import { connect } from 'react-redux';
import Moment from 'moment';
import {
	getReports,
} from '../../reducers/reports/resources';

import html2canvas from 'html2canvas';
import './index.css';

const { RangePicker } = DatePicker;

class Reports extends Component {
	componentWillMount () {
		this.setState({
			selectedDate: Moment().subtract(1,'days').format('ll'),
			loading: false,
			size: 'large',
			volume_usd: null,
			volume_btc: null,
			volume_usd_percentage: null,
			volume_btc_percentage: null,
			price_usd: null,
			price_btc: null,
			market_cap_usd: null,
			market_cap_btc: null,
			percent_change_usd: null,
			percent_change_btc: null,
		});

		this.getReports();
	}

	getReports = (from = '' , to = '') => {
		this.setState({loading: true});

		getReports(from, to)
			.then(response=>{
				if( response.length == 2 ) {
					let newdata = response[0];
					let olddata = response[1];
					let maxmin = {minimumFractionDigits: 2, maximumFractionDigits: 2};
					this.setState({
						volume_usd: parseFloat(newdata.volume_usd).toLocaleString(undefined, maxmin),
						volume_btc: parseFloat(newdata.volume_btc).toLocaleString(undefined, maxmin),
						price_usd: parseFloat(newdata.price_usd),
						price_btc: parseFloat(newdata.price_btc),
						market_cap_btc: parseFloat(newdata.market_cap_btc).toLocaleString(),
						market_cap_usd: parseFloat(newdata.market_cap_usd).toLocaleString(),
						percent_change_usd: parseFloat(newdata.percent_change24h_usd).toLocaleString(undefined, maxmin),
						percent_change_btc: parseFloat(newdata.percent_change24h_btc).toLocaleString(undefined, maxmin),
						volume_usd_percentage: (( parseFloat(newdata.volume_usd) - parseFloat(olddata.volume_usd) ) / parseFloat(olddata.volume_usd ) * 100).toLocaleString(undefined, maxmin),
						volume_btc_percentage: (( parseFloat(newdata.volume_btc) - parseFloat(olddata.volume_btc) ) / parseFloat(olddata.volume_btc) * 100).toLocaleString(undefined, maxmin),
					});
				}
			})
	}

	saveAs = (uri, filename) => {

	    var link = document.createElement('a');

	    if (typeof link.download === 'string') {

	        link.href = uri;
	        link.download = filename;

	        //Firefox requires the link to be in the body
	        document.body.appendChild(link);

	        //simulate click
	        link.click();

	        //remove the link when done
	        document.body.removeChild(link);

	    } else {

	        window.open(uri);

	    }
	}

	downloadReport = () => {
		html2canvas(document.querySelector('.daily-reports')).then(canvas=>{
			this.saveAs(canvas.toDataURL(), 'daily-report.png');
		})
	}

	onChange = (dateString) => {
		let from = Moment(dateString[0]).format('YYYY-MM-DD');
		let to = Moment(dateString[1]).format('YYYY-MM-DD');
		this.setState({
			selectedDate: Moment(dateString[0]).format('ll')
		});
		this.getReports(from, to)
	}

	render() {
		const dailyReportStyle = {
			position: `relative`,
			backgroundImage: `url(./assets/24h_volume.jpg)`,
			backgroundSize: `cover`,
			backgroundRepeat: `no-repeat`,
			width: `1201px`,
			height: `675px`,
		};
		const volumeUSDPercentage = (this.state.volume_usd_percentage >= 0) ? 'price-up':'price-down';
		const volumeBTCPercentage = (this.state.volume_btc_percentage >= 0) ? 'price-up':'price-down';
		const percentChangeUSD = (this.state.percent_change_usd >= 0) ? 'price-up':'price-down';
		const percentChangeBTC = (this.state.percent_change_btc >= 0) ? 'price-up':'price-down';
		return (
			<div className="reports">
				<RangePicker onChange={this.onChange} />
				<br />
				<br />
				<div className="daily-reports" style={dailyReportStyle}>
					<h1>TRADING REPORT - {this.state.selectedDate}</h1>
					<div className="trading-usd">{this.state.volume_usd} <span className={volumeUSDPercentage}>({this.state.volume_usd_percentage}%)</span></div>
					<div className="trading-usd trading-btc">{this.state.volume_btc} <span className={volumeBTCPercentage}>({this.state.volume_btc_percentage}%)</span></div>
					<div className="trading-usd crd-usd">{this.state.price_usd} <span className={percentChangeUSD}>({this.state.percent_change_usd}%)</span></div>
					<div className="trading-usd crd-btc">{this.state.price_btc} <span className={percentChangeBTC}>({this.state.percent_change_btc}%)</span></div>
					<div className="trading-usd crd-market-usd">{this.state.market_cap_usd} <span className={percentChangeUSD}>({this.state.percent_change_usd}%)</span></div>
					<div className="trading-usd crd-market-btc">{this.state.market_cap_btc} <span className={percentChangeBTC}>({this.state.percent_change_btc}%)</span></div>
				</div>
				<br />
				<br />
				<Button type="primary" size={this.state.size} onClick={this.downloadReport}>Download</Button>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
