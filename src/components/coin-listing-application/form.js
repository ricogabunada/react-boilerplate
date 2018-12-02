import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Input,
	Select,
	Form,
	Divider,
} from 'antd';
import _ from 'lodash';
import Personal from './personal';
import CoreTeamMembers from './core-team-members';
import SocialProfileLinks from './social-profile-links';
import AdditionalInformation from './additional-information';
import CommonModal from '../../shared-components/modal';

const FormItem = Form.Item;
const Option = Select.Option;

const CoinListingApplicationForm = Form.create()(
	class extends React.Component {
		render() {
			const {
				visible,
				resetVisible,
				onCreate,
				onCancel,
				form,
				coinListingApplicationDetails,
				header,
			} = this.props;
			const { getFieldDecorator } = form;
			const formItemSize = {
				labelCol: {span: 10},
				wrapperCol: {span: 14}
			};

			/**
			 * Contact Informations
			 */
			const personal = _.pick(coinListingApplicationDetails, [
				'first_name',
				'last_name',
				'email',
				'phone',
				'position',
				'personal_email_verified',
			]);
			const coreTeamMembers = _.pick(coinListingApplicationDetails, [
				'ceo_first_name',
				'ceo_last_name',
				'ceo_email',
				'ceo_phone',
				'cmo_first_name',
				'cmo_last_name',
				'cmo_email',
				'cmo_phone',
				'cto_first_name',
				'cto_last_name',
				'cto_email',
				'cto_phone',
				'ceo_email_verified',
				'cto_email_verified',
				'cmo_email_verified',
			]);
			const socialProfileLinks = _.pick(coinListingApplicationDetails, [
				'twitter_handle',
				'hashtags',
				'facebook_page',
				'telegram_page',
				'linkedin_page',
				'youtube_page',
				'reddit_page',
				'medium_page',
				'discord_page',
				'bitcoin_talk_page',
				'vk_page',
				'github_page',
				'slack_group_page',
				'steemit_page',
			]);
			const additionalInformation = _.pick(coinListingApplicationDetails, [
				'coin_whitepaper',
				'coin_security',
				'coin_based',

			]);

			return (
				<CommonModal
					footer={null}
					width={900}
					visible={visible}
					resetVisible={resetVisible}
					onOk={onCreate}
					onCancel={onCancel}
					header={header}>
					<div style={{textAlign: 'center', marginBottom: '20px'}}>
						<img style={{marginRight: 10}} src={(coinListingApplicationDetails || {}).logo_url} width="150" height="150" />
						<img src={(coinListingApplicationDetails || {}).logo_small_url} width="150" height="150"/>
					</div>
					<Form id="coin-listing-application-form" layout="horizontal">
						<div className="headerDivider">Personal Contact Information</div>
						<Personal
							personal={personal}
							form={form}
							formItemSize={formItemSize}/>
						<Divider />
						<div className="headerDivider">Core Team Members Contact Information</div>
						<CoreTeamMembers
							coreTeamMembers={coreTeamMembers}
							form={form}
							formItemSize={formItemSize}/>
						<Divider />
						<div className="headerDivider">Social Profile Links</div>
						<SocialProfileLinks
							socialProfileLinks={socialProfileLinks}
							form={form}
							formItemSize={formItemSize}/>
						<Divider />
						<div className="headerDivider">Additional Information</div>
						<AdditionalInformation
							additionalInformation={additionalInformation}
							form={form}
							formItemSize={formItemSize}/>
					</Form>
				</CommonModal>
			);
		}
	}
);


const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CoinListingApplicationForm);
