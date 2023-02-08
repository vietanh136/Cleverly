import React, { useState } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { customerManagementsMenu } from '../../../menu';
import Button from '../../../components/bootstrap/Button';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import Checks from '../../../components/bootstrap/forms/Checks';
import Icon from '../../../components/icon/Icon';
const OnlyContent = () => {
	const CKEditor = require("@ckeditor/ckeditor5-react").CKEditor;
	const ClassicEditor = require("@ckeditor/ckeditor5-build-classic");

	const [emailAddress, setEmailAddress] = useState('');

	const [registrationConfirmationEmailTitle, setRegistrationConfirmationEmailTitle] = useState('');
	const [registrationConfirmationEmailTemplate, setRegistrationConfirmationEmailTemplate] = useState('');

	const [forgotPasswordEmailTitle, setForgotPasswordEmailTitle] = useState('');
	const [forgotPasswordEmailTemplate, setForgotPasswordEmailTemplate] = useState('');

	const EmailAddressOnChange = (event: any) => { setEmailAddress(event.target.value); }
	const RegistrationConfirmationEmailTitleOnChange = (event: any) => { setRegistrationConfirmationEmailTitle(event.target.value); }
	const ForgotPasswordEmailTitleOnChange = (event: any) => { setForgotPasswordEmailTitle(event.target.value); }

	const RegistrationConfirmationEmailTemplateOnChange = (event: any, editor: { getData: () => any; }) => {
		const data = editor.getData();
		setRegistrationConfirmationEmailTemplate(data);
	}
	const ForgotPasswordEmailTemplateOnChange = (event: any, editor: { getData: () => any; }) => {
		const data = editor.getData();
		setForgotPasswordEmailTemplate(data);
	}
	return (
		<PageWrapper title={customerManagementsMenu.customerManagements.subMenu.customerInformations.text}>
			<Page>
				<div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 20 }}>
					<div style={{ display: 'flex' }}>
						<div style={{ width: 250, display: 'flex', alignItems: 'center', justifyContent: 'flex-start',fontWeight:'bold' }}>1. Received/Sent Email</div>
						<Input style={{ width: 400 }} value={emailAddress} id={'email-address'} onChange={EmailAddressOnChange} />
					</div>

				</div>

				<div style={{ display: 'flex', flexDirection: 'column',paddingBottom: 20 }}>
					<div style={{ paddingTop: 10, paddingBottom: 10,fontWeight:'bold' }}>2. Registration Confirmation Email Template</div>

					<div style={innerStyle.FormItem}>
						<div style={innerStyle.FormItemLabel}>Title</div>
						<Input value={registrationConfirmationEmailTitle} id={'email-address'} onChange={RegistrationConfirmationEmailTitleOnChange} />
					</div>
					<div style={innerStyle.FormItem}>
						<div style={innerStyle.FormItemLabel}>Content</div>
						<CKEditor
							editor={ClassicEditor}
							data={registrationConfirmationEmailTemplate}
							onChange={RegistrationConfirmationEmailTemplateOnChange}
						/>
					</div>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column',paddingBottom: 20 }}>
					<div style={{ paddingTop: 10, paddingBottom: 10,fontWeight:'bold' }}>3. Forgot Password Email Template</div>

					<div style={innerStyle.FormItem}>
						<div style={innerStyle.FormItemLabel}>Title</div>
						<Input value={forgotPasswordEmailTitle} id={'email-address'} onChange={ForgotPasswordEmailTitleOnChange} />
					</div>
					<div style={innerStyle.FormItem}>
						<div style={innerStyle.FormItemLabel}>Content</div>
						<CKEditor
							editor={ClassicEditor}
							data={forgotPasswordEmailTemplate}
							onChange={ForgotPasswordEmailTemplateOnChange}
						/>
					</div>
				</div>


				<div style={{ display: 'flex', flexDirection: 'column',alignItems:'flex-end' }}>
					<Button isOutline color={'primary'} >Save</Button>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default OnlyContent;
const innerStyle = {

	FormItem: {
		paddingBottom: 15,
		display: 'flex',
		flexDirection: 'column' as 'column',

	},
	FormItemLabel: {
		paddingRight: 10
	},
	FormItemInput: {
		flex: 1
	}
}
