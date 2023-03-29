import React, { useState, useEffect } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { settingsMenu } from '../../../menu';
import Button from '../../../components/bootstrap/Button';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import { CheckErrorResponse, GetObjectProperty, SendGetRequest, SendPostRequest } from '../../../helpers/helpers';
import showNotification from '../../../components/extras/showNotification';
import Card, { CardActions, CardBody, CardFooter, CardHeader, CardLabel } from '../../../components/bootstrap/Card';
import $ from 'jquery';
const OnlyContent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [registrationFeeAndNameApplication, setRegistrationFeeAndNameApplication] = useState('');
    const [serviceFeeIncorporation, setServiceFeeIncorporation] = useState('');
    const [corporateSecretary, setCorporateSecretary] = useState('');
    const [nomineeDirectorSecurityDeposit, setNomineeDirectorSecurityDeposit] = useState('');
    const [registeredAddressDigitalMailroom, setRegisteredAddressDigitalMailroom] = useState('');
    const [shareholderFee, setShareholderFee] = useState('');
    const [nomineeDirectorFee, setNomineeDirectorFee] = useState('');

    const RegistrationFeeAndNameApplicationOnChange = (obj: any) => { setRegistrationFeeAndNameApplication(obj.target.value); }
    const ServiceFeeIncorporationOnChange = (obj: any) => { setServiceFeeIncorporation(obj.target.value); }
    const CorporateSecretaryOnChange = (obj: any) => { setCorporateSecretary(obj.target.value); }
    const NomineeDirectorSecurityDepositOnChange = (obj: any) => { setNomineeDirectorSecurityDeposit(obj.target.value); }
    const RegisteredAddressDigitalMailroomOnChange = (obj: any) => { setRegisteredAddressDigitalMailroom(obj.target.value); }
    const ShareholderFeeOnChange = (obj: any) => { setShareholderFee(obj.target.value); }
    const NomineeDirectorFeeOnChange = (obj: any) => { setNomineeDirectorFee(obj.target.value); }

    const SaveData = async () => {
        let model = {
            Amount1: registrationFeeAndNameApplication,
            Amount2: serviceFeeIncorporation,
            Amount3: corporateSecretary,
            Amount4: nomineeDirectorSecurityDeposit,
            Amount5: registeredAddressDigitalMailroom,
            Amount6: shareholderFee,
            Amount7: nomineeDirectorFee
        };
        $('.is-invalid').removeClass('is-invalid');

        let errorCount = 0;
        if (GetObjectProperty(model, 'Amount1') === '') {
            errorCount++;
            showNotification('Warning', 'Registration Fee and Name Application can not be null', 'danger');
            $('#registration-fee-and-name-application').addClass('is-invalid');
            $('#registration-fee-and-name-application').siblings('.invalid-feedback').text('Registration Fee and Name Application can not be null');
        } else {
            if (parseInt(model.Amount1) <= 0) {
                errorCount++;
                showNotification('Warning', 'Registration Fee and Name Application can not be less than 0', 'danger');
                $('#registration-fee-and-name-application').addClass('is-invalid');
                $('#registration-fee-and-name-application').siblings('.invalid-feedback').text('Registration Fee and Name Application can not be less than 0');
            }
        }

        if (GetObjectProperty(model, 'Amount2') === '') {
            errorCount++;
            showNotification('Warning', 'Service Fee - Incorporation can not be null', 'danger');
            $('#service-fee-incorporation').addClass('is-invalid');
            $('#service-fee-incorporation').siblings('.invalid-feedback').text('Service Fee - Incorporation can not be null');
        } else {
            if (parseInt(model.Amount2) <= 0) {
                errorCount++;
                showNotification('Warning', 'Service Fee - Incorporation can not be less than 0', 'danger');
                $('#service-fee-incorporation').addClass('is-invalid');
                $('#service-fee-incorporation').siblings('.invalid-feedback').text('Service Fee - Incorporation can not be less than 0');
            }
        }

        if (GetObjectProperty(model, 'Amount3') === '') {
            errorCount++;
            showNotification('Warning', 'Corporate Secretary can not be null', 'danger');
            $('#corporate-secretary').addClass('is-invalid');
            $('#corporate-secretary').siblings('.invalid-feedback').text('Corporate Secretary can not be null');
        } else {
            if (parseInt(model.Amount3) <= 0) {
                errorCount++;
                showNotification('Warning', 'Corporate Secretary can not be less than 0', 'danger');
                $('#corporate-secretary').addClass('is-invalid');
                $('#corporate-secretary').siblings('.invalid-feedback').text('Corporate Secretary can not be less than 0');
            }
        }

        if (GetObjectProperty(model, 'Amount4') === '') {
            errorCount++;
            showNotification('Warning', 'Nominee Director Security Deposit can not be null', 'danger');
            $('#nominee-director-security-deposit').addClass('is-invalid');
            $('#nominee-director-security-deposit').siblings('.invalid-feedback').text('Nominee Director Security Deposit can not be null');
        } else {
            if (parseInt(model.Amount4) <= 0) {
                errorCount++;
                showNotification('Warning', 'Nominee Director Security Deposit can not be less than 0', 'danger');
                $('#nominee-director-security-deposit').addClass('is-invalid');
                $('#nominee-director-security-deposit').siblings('.invalid-feedback').text('Nominee Director Security Deposit can not be less than 0');
            }
        }

        if (GetObjectProperty(model, 'Amount5') === '') {
            errorCount++;
            showNotification('Warning', 'Registered Address & Digital Mailroom can not be null', 'danger');
            $('#registered-address-digital-mailroom').addClass('is-invalid');
            $('#registered-address-digital-mailroom').siblings('.invalid-feedback').text('Registered Address & Digital Mailroom can not be null');
        } else {
            if (parseInt(model.Amount5) <= 0) {
                errorCount++;
                showNotification('Warning', 'Registered Address & Digital Mailroom can not be less than 0', 'danger');
                $('#registered-address-digital-mailroom').addClass('is-invalid');
                $('#registered-address-digital-mailroom').siblings('.invalid-feedback').text('Registered Address & Digital Mailroom can not be less than 0');
            }
        }

        if (GetObjectProperty(model, 'Amount6') === '') {
            errorCount++;
            showNotification('Warning', 'Shareholder Fee can not be null', 'danger');
            $('#shareholder-fee').addClass('is-invalid');
            $('#shareholder-fee').siblings('.invalid-feedback').text('Shareholder Fee can not be null');
        } else {
            if (parseInt(model.Amount6) <= 0) {
                errorCount++;
                showNotification('Warning', 'Shareholder Fee can not be less than 0', 'danger');
                $('#shareholder-fee').addClass('is-invalid');
                $('#shareholder-fee').siblings('.invalid-feedback').text('Shareholder Fee can not be less than 0');
            }
        }

        if (GetObjectProperty(model, 'Amount7') === '') {
            errorCount++;
            showNotification('Warning', 'Nominee Director Fee can not be null', 'danger');
            $('#nominee-director-fee').addClass('is-invalid');
            $('#nominee-director-fee').siblings('.invalid-feedback').text('Nominee Director Fee can not be null');
        } else {
            if (parseInt(model.Amount7) <= 0) {
                errorCount++;
                showNotification('Warning', 'Nominee Director Fee can not be less than 0', 'danger');
                $('#nominee-director-fee').addClass('is-invalid');
                $('#nominee-director-fee').siblings('.invalid-feedback').text('Nominee Director Fee can not be less than 0');
            }
        }

        if (errorCount > 0) return;
        setIsLoading(true);
        let rs = await SendPostRequest('/Fees/UpdateFees', model);
        setIsLoading(false);
        if (CheckErrorResponse(rs) === false) return;
        showNotification('Congratulation', 'Updated successfully', 'success');
    }

    const InitPage = async () => {
        let rs = await SendGetRequest('/Fees/GetFees');
        if (CheckErrorResponse(rs) === false) return;
        setRegistrationFeeAndNameApplication(rs.data.Amount1);
        setServiceFeeIncorporation(rs.data.Amount2);
        setCorporateSecretary(rs.data.Amount3);
        setNomineeDirectorSecurityDeposit(rs.data.Amount4);
        setRegisteredAddressDigitalMailroom(rs.data.Amount5);
        setShareholderFee(rs.data.Amount6);
        setNomineeDirectorFee(rs.data.Amount7);
    }
    useEffect(() => {
        InitPage();
    }, [])
    return (
        <PageWrapper title={settingsMenu.settings.subMenu.fees.text}>
            <Page>
                <Card stretch={'full'}>
                    <CardBody isScrollable className='table-responsive'>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                            <div style={innerStyle.FormItem}>
                                <Label style={innerStyle.FormItemLabel} htmlFor={'registration-fee-and-name-application'}>Registration Fee and Name Application (*)</Label>
                                <Input style={innerStyle.FormItemInput} placeholder={'Input cannot be null'} type={'number'} value={registrationFeeAndNameApplication} onChange={RegistrationFeeAndNameApplicationOnChange} autoComplete={'false'} id='registration-fee-and-name-application' />
                                <div className="invalid-feedback">Required</div>
                            </div>
                            <div style={innerStyle.FormItem}>
                                <Label style={innerStyle.FormItemLabel} htmlFor={'service-fee-incorporation'}>Service Fee - Incorporation (*)</Label>
                                <Input style={innerStyle.FormItemInput} placeholder={'Input cannot be null'} type={'number'} value={serviceFeeIncorporation} onChange={ServiceFeeIncorporationOnChange} autoComplete={'false'} id='service-fee-incorporation' />
                                <div className="invalid-feedback">Required</div>
                            </div>
                            <div style={innerStyle.FormItem}>
                                <Label style={innerStyle.FormItemLabel} htmlFor={'corporate-secretary'}>Corporate Secretary (*)</Label>
                                <Input style={innerStyle.FormItemInput} placeholder={'Input cannot be null'} type={'number'} value={corporateSecretary} onChange={CorporateSecretaryOnChange} autoComplete={'false'} id='corporate-secretary' />
                                <div className="invalid-feedback">Required</div>
                            </div>
                            <div style={innerStyle.FormItem}>
                                <Label style={innerStyle.FormItemLabel} htmlFor={'nominee-director-security-deposit'}>Nominee Director Security Deposit (*)</Label>
                                <Input style={innerStyle.FormItemInput} placeholder={'Input cannot be null'} type={'number'} value={nomineeDirectorSecurityDeposit} onChange={NomineeDirectorSecurityDepositOnChange} autoComplete={'false'} id='nominee-director-security-deposit' />
                                <div className="invalid-feedback">Required</div>
                            </div>
                            <div style={innerStyle.FormItem}>
                                <Label style={innerStyle.FormItemLabel} htmlFor={'registered-address-digital-mailroom'}>Registered Address & Digital Mailroom (*)</Label>
                                <Input style={innerStyle.FormItemInput} placeholder={'Input cannot be null'} type={'number'} value={registeredAddressDigitalMailroom} onChange={RegisteredAddressDigitalMailroomOnChange} autoComplete={'false'} id='registered-address-digital-mailroom' />
                                <div className="invalid-feedback">Required</div>
                            </div>
                            <div style={innerStyle.FormItem}>
                                <Label style={innerStyle.FormItemLabel} htmlFor={'shareholder-fee'}>Shareholder Fee (*)</Label>
                                <Input style={innerStyle.FormItemInput} placeholder={'Input cannot be null'} type={'number'} value={shareholderFee} onChange={ShareholderFeeOnChange} autoComplete={'false'} id='shareholder-fee' />
                                <div className="invalid-feedback">Required</div>
                            </div>
                            <div style={innerStyle.FormItem}>
                                <Label style={innerStyle.FormItemLabel} htmlFor={'nominee-director-fee'}>Nominee Director Fee (*)</Label>
                                <Input style={innerStyle.FormItemInput} placeholder={'Input cannot be null'} type={'number'} value={nomineeDirectorFee} onChange={NomineeDirectorFeeOnChange} autoComplete={'false'} id='nominee-director-fee' />
                                <div className="invalid-feedback">Required</div>
                            </div>

                        </div>
                    </CardBody>
                    <CardFooter>
                        <div style={innerStyle.FormItem}>
                            <Button isOutline color='success' isDisable={isLoading} onClick={SaveData}>Save</Button>
                        </div>

                    </CardFooter>
                </Card>


            </Page>
        </PageWrapper>
    );
};

export default OnlyContent;

const innerStyle = {
    TabNavigation: {},
    FormItem: {
        paddingBottom: 15,
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'flex-start',
        width: 350
    },
    FormItemLabel: {
    },
    FormItemInput: {
    }
}