import React, { useState } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { customerManagementsMenu } from '../../../menu';
import Button from '../../../components/bootstrap/Button';

const TAB = {
	BUSINESS_ACCOUNT_TERM_CONDITION: 1,
	TERM_CONDITION: 2,
	DATA_PROTECTION_PRIVACY_POLICY: 3
}

const OnlyContent = () => {
	const CKEditor = require("@ckeditor/ckeditor5-react").CKEditor;
	const ClassicEditor = require("@ckeditor/ckeditor5-build-classic");

	const [contentBusinessAccountTermsConditions, setContentBusinessAccountTermsConditions] = useState('<p>Business Account Terms & Conditions</p>');
	const [contentTermsConditions, setContentTermsConditions] = useState('<p>Terms & Conditions</p>');
	const [contentDataProtectionPrivacyPolicy, setContentDataProtectionPrivacyPolicy] = useState('<p>Data Protection & Privacy Policy</p>');

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

	const SaveData = () => {
		let data = '';
		switch (tab) {
			case TAB.BUSINESS_ACCOUNT_TERM_CONDITION: data = contentBusinessAccountTermsConditions; break;
			case TAB.TERM_CONDITION: data = contentTermsConditions; break;
			case TAB.DATA_PROTECTION_PRIVACY_POLICY: data = contentDataProtectionPrivacyPolicy; break;
		}
		console.log('save data ', data);
	}
	return (
		<PageWrapper title={customerManagementsMenu.customerManagements.subMenu.customerInformations.text}>
			<Page>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
					<div style={{ display: 'flex', gap: 10 }}>
						<Button isOutline={!(tab === TAB.BUSINESS_ACCOUNT_TERM_CONDITION)} onClick={TabBusinessActive} color='info'>Business Account Terms & Conditions</Button>
						<Button isOutline={!(tab === TAB.TERM_CONDITION)} onClick={TabTermActive} color='info' >Terms & Conditions</Button>
						<Button isOutline={!(tab === TAB.DATA_PROTECTION_PRIVACY_POLICY)} onClick={TabDataActive} color='info'>Data Protection & Privacy Policy</Button>
					</div>
					<div style={{ display: tab === TAB.BUSINESS_ACCOUNT_TERM_CONDITION ? 'block' : 'none' }}>
						<Button style={{ marginBottom: 15 }} onClick={SaveData} color='success'>Save</Button>
						<CKEditor
							editor={ClassicEditor}
							data={contentBusinessAccountTermsConditions}
							onChange={CKEditorOnChange}
						/>
					</div>
					<div style={{ display: tab === TAB.TERM_CONDITION ? 'block' : 'none' }}>
						<Button style={{ marginBottom: 15 }} onClick={SaveData} color='success'>Save</Button>
						<CKEditor
							editor={ClassicEditor}
							data={contentTermsConditions}
							onChange={CKEditorOnChange}
						/>
					</div>
					<div style={{ display: tab === TAB.DATA_PROTECTION_PRIVACY_POLICY ? 'block' : 'none' }}>
						<Button style={{ marginBottom: 15 }} onClick={SaveData} color='success'>Save</Button>
						<CKEditor
							editor={ClassicEditor}
							data={contentDataProtectionPrivacyPolicy}
							onChange={CKEditorOnChange}
						/>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default OnlyContent;

const innerStyle = {
	TabNavigation: {}
}