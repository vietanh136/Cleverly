import React, { useState, useEffect } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { settingsMenu } from '../../../menu';
import Button from '../../../components/bootstrap/Button';
import { CheckErrorResponse, GetObjectProperty, SendGetRequest, SendPostRequest } from '../../../helpers/helpers';
import showNotification from '../../../components/extras/showNotification';
import Card, { CardActions, CardBody, CardFooter, CardHeader, CardLabel } from '../../../components/bootstrap/Card';

const TAB = {
	BUSINESS_ACCOUNT_TERM_CONDITION: 1,
	TERM_CONDITION: 2,
	DATA_PROTECTION_PRIVACY_POLICY: 3
}

const OnlyContent = () => {
	const [isLoading, setIsLoading] = useState(false);
	const CKEditor = require("@ckeditor/ckeditor5-react").CKEditor;
	const ClassicEditor = require("@ckeditor/ckeditor5-build-classic");

	const [contentBusinessAccountTermsConditions, setContentBusinessAccountTermsConditions] = useState('');
	const [contentTermsConditions, setContentTermsConditions] = useState('');
	const [contentDataProtectionPrivacyPolicy, setContentDataProtectionPrivacyPolicy] = useState('');

	const [tab, setTab] = useState(TAB.BUSINESS_ACCOUNT_TERM_CONDITION);

	const TabBusinessActive = () => { setTab(TAB.BUSINESS_ACCOUNT_TERM_CONDITION); }
	const TabTermActive = () => { setTab(TAB.TERM_CONDITION); }
	const TabDataActive = () => { setTab(TAB.DATA_PROTECTION_PRIVACY_POLICY); }

	const CKEditorOnChange = (event: any, editor: { getData: () => any; }) => {
		const data = editor.getData();
		switch (tab) {
			case TAB.BUSINESS_ACCOUNT_TERM_CONDITION: setContentBusinessAccountTermsConditions(data); break;
			case TAB.TERM_CONDITION: setContentTermsConditions(data); break;
			case TAB.DATA_PROTECTION_PRIVACY_POLICY: setContentDataProtectionPrivacyPolicy(data); break;
		}
	}

	const SaveData = async () => {
		let data = {};
		let url = '';
		switch (tab) {
			case TAB.BUSINESS_ACCOUNT_TERM_CONDITION:
				if (contentBusinessAccountTermsConditions === '') {
					showNotification('Warning', 'Content cannot be left blank', 'danger');
					return;
				}
				url = '/SystemContent/UpdateBusinessAccountTermsConditions';
				data = { Term1: contentBusinessAccountTermsConditions };
				break;
			case TAB.TERM_CONDITION:
				if (contentTermsConditions === '') {
					showNotification('Warning', 'Content cannot be left blank', 'danger');
					return;
				}
				url = '/SystemContent/UpdateTermsConditions';
				data = { Term2: contentTermsConditions };
				break;
			case TAB.DATA_PROTECTION_PRIVACY_POLICY:
				if (contentDataProtectionPrivacyPolicy === '') {
					showNotification('Warning', 'Content cannot be left blank', 'danger');
					return;
				}
				url = '/SystemContent/UpdateDataProtectionPrivacyPolicy';
				data = { Term3: contentDataProtectionPrivacyPolicy };
				break;
		}
		setIsLoading(true);
		let rs = await SendPostRequest(url, data);
		setIsLoading(false);
		if (CheckErrorResponse(rs) === false) return;
		showNotification('Congratulation', 'Updated successfully', 'success');
	}

	const InitPage = async () => {
		let rs = await SendGetRequest('/SystemContent/GetBusinessAccountTermsConditions');
		if (CheckErrorResponse(rs) === false) return;
		if (GetObjectProperty(rs, 'data') !== '') setContentBusinessAccountTermsConditions(rs.data);

		rs = await SendGetRequest('/SystemContent/GetDataProtectionPrivacyPolicy');
		if (CheckErrorResponse(rs) === false) return;
		if (GetObjectProperty(rs, 'data') !== '') setContentDataProtectionPrivacyPolicy(rs.data);

		rs = await SendGetRequest('/SystemContent/GetTermsConditions');
		if (CheckErrorResponse(rs) === false) return;
		if (GetObjectProperty(rs, 'data') !== '') setContentTermsConditions(rs.data);
	}

	useEffect(() => {
		InitPage();
	}, []);
	return (
		<PageWrapper title={settingsMenu.settings.subMenu.termAndPolicy.text}>
			<Page>
				<div style={{ display: 'flex', gap: 10,paddingBottom:20 }}>
					<Button isOutline={!(tab === TAB.BUSINESS_ACCOUNT_TERM_CONDITION)} onClick={TabBusinessActive} color='info'>Business Account Terms & Conditions</Button>
					<Button isOutline={!(tab === TAB.TERM_CONDITION)} onClick={TabTermActive} color='info' >Terms & Conditions</Button>
					<Button isOutline={!(tab === TAB.DATA_PROTECTION_PRIVACY_POLICY)} onClick={TabDataActive} color='info'>Data Protection & Privacy Policy</Button>
				</div>
				<Card stretch={'full'}>

					<CardBody isScrollable className='table-responsive'>
						<div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>

							<div style={{ display: tab === TAB.BUSINESS_ACCOUNT_TERM_CONDITION ? 'block' : 'none' }}>
								<Button isDisable={isLoading} isOutline isLight style={{ marginBottom: 15 }} onClick={SaveData} color='success'>Save</Button>
								<CKEditor
									editor={ClassicEditor}
									data={contentBusinessAccountTermsConditions}
									onChange={CKEditorOnChange}
								/>
							</div>
							<div style={{ display: tab === TAB.TERM_CONDITION ? 'block' : 'none' }}>
								<Button isDisable={isLoading} isOutline isLight style={{ marginBottom: 15 }} onClick={SaveData} color='success'>Save</Button>
								<CKEditor
									editor={ClassicEditor}
									data={contentTermsConditions}
									onChange={CKEditorOnChange}
								/>
							</div>
							<div style={{ display: tab === TAB.DATA_PROTECTION_PRIVACY_POLICY ? 'block' : 'none' }}>
								<Button isDisable={isLoading} isOutline isLight style={{ marginBottom: 15 }} onClick={SaveData} color='success'>Save</Button>
								<CKEditor
									editor={ClassicEditor}
									data={contentDataProtectionPrivacyPolicy}
									onChange={CKEditorOnChange}
								/>
							</div>
						</div>
					</CardBody>
				</Card>

			</Page>
		</PageWrapper>
	);
};

export default OnlyContent;

const innerStyle = {
	TabNavigation: {}
}