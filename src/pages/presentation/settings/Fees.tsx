import React, { useState } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { customerManagementsMenu } from '../../../menu';
import Button from '../../../components/bootstrap/Button';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
const OnlyContent = () => {

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

    const SaveData = () => {

    }
    return (
        <PageWrapper title={customerManagementsMenu.customerManagements.subMenu.customerInformations.text}>
            <Page>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                    <div style={innerStyle.FormItem}>
                        <Label style={innerStyle.FormItemLabel} htmlFor={'registration-fee-and-name-application'}>Registration Fee and Name Application</Label>
                        <Input style={innerStyle.FormItemInput} value={registrationFeeAndNameApplication} onChange={RegistrationFeeAndNameApplicationOnChange} autoComplete={'false'} id='registration-fee-and-name-application' />
                    </div>
                    <div style={innerStyle.FormItem}>
                        <Label style={innerStyle.FormItemLabel} htmlFor={'service-fee-incorporation'}>Service Fee - Incorporation</Label>
                        <Input style={innerStyle.FormItemInput} value={serviceFeeIncorporation} onChange={ServiceFeeIncorporationOnChange} autoComplete={'false'} id='service-fee-incorporation' />
                    </div>
                    <div style={innerStyle.FormItem}>
                        <Label style={innerStyle.FormItemLabel} htmlFor={'corporate-secretary'}>Corporate Secretary</Label>
                        <Input style={innerStyle.FormItemInput} value={corporateSecretary} onChange={CorporateSecretaryOnChange} autoComplete={'false'} id='corporate-secretary' />
                    </div>
                    <div style={innerStyle.FormItem}>
                        <Label style={innerStyle.FormItemLabel} htmlFor={'nominee-director-security-deposit'}>Nominee Director Security Deposit</Label>
                        <Input style={innerStyle.FormItemInput} value={nomineeDirectorSecurityDeposit} onChange={NomineeDirectorSecurityDepositOnChange} autoComplete={'false'} id='nominee-director-security-deposit' />
                    </div>
                    <div style={innerStyle.FormItem}>
                        <Label style={innerStyle.FormItemLabel} htmlFor={'registered-address-digital-mailroom'}>Registered Address & Digital Mailroom</Label>
                        <Input style={innerStyle.FormItemInput} value={registeredAddressDigitalMailroom} onChange={RegisteredAddressDigitalMailroomOnChange} autoComplete={'false'} id='registered-address-digital-mailroom' />
                    </div>
                    <div style={innerStyle.FormItem}>
                        <Label style={innerStyle.FormItemLabel} htmlFor={'shareholder-fee'}>Shareholder Fee</Label>
                        <Input style={innerStyle.FormItemInput} value={shareholderFee} onChange={ShareholderFeeOnChange} autoComplete={'false'} id='shareholder-fee' />
                    </div>
                    <div style={innerStyle.FormItem}>
                        <Label style={innerStyle.FormItemLabel} htmlFor={'nominee-director-fee'}>Nominee Director Fee</Label>
                        <Input style={innerStyle.FormItemInput} value={nomineeDirectorFee} onChange={NomineeDirectorFeeOnChange} autoComplete={'false'} id='nominee-director-fee' />
                    </div>
                    <div style={innerStyle.FormItem}>
                        <Button isOutline color='success' onClick={SaveData}>Save</Button>
                    </div>
                </div>
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
        width: 300
    },
    FormItemLabel: {
    },
    FormItemInput: {
    }
}