import React, { useState, useEffect } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { settingsMenu } from '../../../menu';
import Button from '../../../components/bootstrap/Button';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import Checks from '../../../components/bootstrap/forms/Checks';
import Icon from '../../../components/icon/Icon';
import { CheckErrorResponse, GetObjectProperty, SendGetRequest, SendPostRequest } from '../../../helpers/helpers';
import showNotification from '../../../components/extras/showNotification';
import Card, { CardActions, CardBody, CardFooter, CardHeader, CardLabel } from '../../../components/bootstrap/Card';
const OnlyContent = () => {
	const CKEditor = require("@ckeditor/ckeditor5-react").CKEditor;
	const ClassicEditor = require("@ckeditor/ckeditor5-build-classic");

	const [isLoading, setIsLoading] = useState(false);

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
	const InitPage = async () => {
		let rs = await SendGetRequest('/EmailTemplate/GetEmailTemplate');
		if (CheckErrorResponse(rs) === false) return;
		setEmailAddress(GetObjectProperty(rs.data, 'emailAddress'));
		setRegistrationConfirmationEmailTitle(GetObjectProperty(rs.data.registrationConfirmationEmailTemplate, 'Title'));
		setRegistrationConfirmationEmailTemplate(GetObjectProperty(rs.data.registrationConfirmationEmailTemplate, 'Description'));
		setForgotPasswordEmailTitle(GetObjectProperty(rs.data.forgotPasswordEmailTemplate, 'Title'));
		setForgotPasswordEmailTemplate(GetObjectProperty(rs.data.forgotPasswordEmailTemplate, 'Description'));
	}
	const SaveData = async () => {
		let model = {
			EmailAddress: emailAddress,
			RegistrationConfirmationEmailTemplateTitle: registrationConfirmationEmailTitle,
			RegistrationConfirmationEmailTemplateContent: registrationConfirmationEmailTemplate,
			ForgotPasswordEmailTemplateTitle: forgotPasswordEmailTitle,
			ForgotPasswordEmailTemplateContent: forgotPasswordEmailTemplate
		}
		let errorCount = 0;
		if (model.EmailAddress === '') {
			errorCount++;
			showNotification('Warning', 'Received/Sent Email cannot be left blank', 'danger');
		}
		if (model.RegistrationConfirmationEmailTemplateTitle === '') {
			errorCount++;
			showNotification('Warning', 'Registration Confirmation Email Template title cannot be left blank', 'danger');
		}
		if (model.RegistrationConfirmationEmailTemplateContent === '') {
			errorCount++;
			showNotification('Warning', 'Registration Confirmation Email Template content cannot be left blank', 'danger');
		}
		if (model.ForgotPasswordEmailTemplateTitle === '') {
			errorCount++;
			showNotification('Warning', 'Forgot Password Email Template title cannot be left blank', 'danger');
		}
		if (model.ForgotPasswordEmailTemplateContent === '') {
			errorCount++;
			showNotification('Warning', 'Forgot Password Email Template content cannot be left blank', 'danger');
		}
		if (errorCount > 0) return;
		setIsLoading(true);
		let rs = await SendPostRequest('/EmailTemplate/UpdateEmailTemplate', model);
		setIsLoading(false);
		if (CheckErrorResponse(rs) === false) return;
		showNotification('Congratulation', 'Updated successfully', 'success');
	}
	useEffect(() => {
		InitPage();

	}, []);
	return (
		<PageWrapper title={settingsMenu.settings.subMenu.emailTemplates.text}>
			<Page>
				<Card stretch={'full'}>
				
					<CardBody isScrollable className='table-responsive'>
						<div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 20 }}>
							<div style={{ display: 'flex' }}>
								<div style={{ width: 250, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontWeight: 'bold' }}>1. Received/Sent Email</div>
								<Input style={{ width: 400 }} value={emailAddress} id={'email-address'} onChange={EmailAddressOnChange} />
							</div>

						</div>

						<div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 20 }}>
							<div style={{ paddingTop: 10, paddingBottom: 10, fontWeight: 'bold' }}>2. Registration Confirmation Email Template</div>

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

						<div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 20 }}>
							<div style={{ paddingTop: 10, paddingBottom: 10, fontWeight: 'bold' }}>3. Forgot Password Email Template</div>

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
					</CardBody>
					<CardFooter>
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
							<Button isLight isOutline color={'success'} isDisable={isLoading} onClick={SaveData}>Save</Button>
						</div>
					</CardFooter>
				</Card>




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
