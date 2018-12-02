import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
	Row,
	Col,
	Form,
	Checkbox,
	Select,
	Input,
	InputNumber,
	Icon,
	Dropdown,
	notification,
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class SocialProfileLinks extends Component {
	componentWillMount() {
	}

	render() {
		const {
			form,
			formItemSize,
			socialProfileLinks,
		} = this.props;
		const { getFieldDecorator } = form;
		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 24,
					offset: 0
				},
				sm: {
					span: 16,
					offset: 8
				}
			}
		};

		return (
			<div>
				<FormItem label="Twitter Profile Links" {...formItemSize}
					extra={<a href={(socialProfileLinks || {}).twitter_handle} target="_blank">
						{(socialProfileLinks || {}).twitter_handle}</a>}>
					{getFieldDecorator('twitter_handle', {
						initialValue: (socialProfileLinks || {}).twitter_handle
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="Twitter Hashtags" {...formItemSize}
					extra={(socialProfileLinks || {}).hashtags}>
					{getFieldDecorator('hashtags', {
						initialValue: (socialProfileLinks || {}).hashtags
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="Facebook Page Profile" {...formItemSize}
					extra={<a href={(socialProfileLinks || {}).facebook_page} target="_blank">
						{(socialProfileLinks || {}).facebook_page}</a>}>
					{getFieldDecorator('facebook_page', {
						initialValue: (socialProfileLinks || {}).facebook_page
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="Facebook Page Profile" {...formItemSize}
					extra={<a href={(socialProfileLinks || {}).facebook_page} target="_blank">
						{(socialProfileLinks || {}).facebook_page}</a>}>
					{getFieldDecorator('facebook_page', {
						initialValue: (socialProfileLinks || {}).facebook_page
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="Telegram Group Link" {...formItemSize}
					extra={<a href={(socialProfileLinks || {}).telegram_page} target="_blank">
						{(socialProfileLinks || {}).telegram_page}</a>}>
					{getFieldDecorator('telegram_page', {
						initialValue: (socialProfileLinks || {}).telegram_page
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="Linkedin Page Link" {...formItemSize}
					extra={<a href={(socialProfileLinks || {}).linkedin_page} target="_blank">
						{(socialProfileLinks || {}).linkedin_page}</a>}>
					{getFieldDecorator('linkedin_page', {
						initialValue: (socialProfileLinks || {}).linkedin_page
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="Youtube Profile Link" {...formItemSize}
					extra={<a href={(socialProfileLinks || {}).youtube_page} target="_blank">
						{(socialProfileLinks || {}).youtube_page}</a>}>
					{getFieldDecorator('linkedin_page', {
						initialValue: (socialProfileLinks || {}).youtube_page
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="Subreddit Link" {...formItemSize}
					extra={<a href={(socialProfileLinks || {}).reddit_page} target="_blank">
						{(socialProfileLinks || {}).reddit_page}</a>}>
					{getFieldDecorator('reddit_page', {
						initialValue: (socialProfileLinks || {}).reddit_page
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="Medium or Blog Link" {...formItemSize}
					extra={<a href={(socialProfileLinks || {}).medium_page} target="_blank">
						{(socialProfileLinks || {}).medium_page}</a>}>
					{getFieldDecorator('medium_page', {
						initialValue: (socialProfileLinks || {}).medium_page
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="Discord Channel Link" {...formItemSize}
					extra={<a href={(socialProfileLinks || {}).discord_page} target="_blank">
						{(socialProfileLinks || {}).discord_page}</a>}>
					{getFieldDecorator('discord_page', {
						initialValue: (socialProfileLinks || {}).discord_page
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="BitcoinTalk Forum ANN Thread" {...formItemSize}
					extra={<a href={(socialProfileLinks || {}).bitcoin_talk_page} target="_blank">
						{(socialProfileLinks || {}).bitcoin_talk_page}</a>}>
					{getFieldDecorator('bitcoin_talk_page', {
						initialValue: (socialProfileLinks || {}).bitcoin_talk_page
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="VK Profile Link" {...formItemSize}
					extra={<a href={(socialProfileLinks || {}).vk_page} target="_blank">
						{(socialProfileLinks || {}).vk_page}</a>}>
					{getFieldDecorator('vk_page', {
						initialValue: (socialProfileLinks || {}).vk_page
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="Github" {...formItemSize}
					extra={<a href={(socialProfileLinks || {}).github_page} target="_blank">
						{(socialProfileLinks || {}).github_page}</a>}>
					{getFieldDecorator('github_page', {
						initialValue: (socialProfileLinks || {}).github_page
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="Slack Group Link" {...formItemSize}
					extra={<a href={(socialProfileLinks || {}).slack_group_page} target="_blank">
						{(socialProfileLinks || {}).slack_group_page}</a>}>
					{getFieldDecorator('slack_group_page', {
						initialValue: (socialProfileLinks || {}).slack_group_page
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
				<FormItem label="Steemit Profile Link" {...formItemSize}
					extra={<a href={(socialProfileLinks || {}).steemit_page} target="_blank">
						{(socialProfileLinks || {}).steemit_page}</a>}>
					{getFieldDecorator('steemit_page', {
						initialValue: (socialProfileLinks || {}).steemit_page
					})(<Input style={{display: 'none'}}/>)}
				</FormItem>
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

export default connect(mapStateToProps, mapDispatchToProps)(SocialProfileLinks);
