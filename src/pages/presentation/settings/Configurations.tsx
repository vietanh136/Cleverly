import React, { useState } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { settingsMenu } from '../../../menu';
import Button from '../../../components/bootstrap/Button';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import Select from '../../../components/bootstrap/forms/Select';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import NomineesAddress from './components/configurationsComponents/NomineesAddress';
import NomineesDirectorName from './components/configurationsComponents/NomineesDirectorName';
import ShareholdersDocuments from './components/configurationsComponents/ShareholdersDocuments';
import Card, { CardBody } from '../../../components/bootstrap/Card';
const TAB = {
	NOMINEES_ADDRESS: 1,
	NOMINEES_DIRECTOR_NAME: 2,
	SHAREHOLDERS_DOCUMENTS: 3,
}

const OnlyContent = () => {

	const [tab, setTab] = useState(TAB.NOMINEES_ADDRESS);

	const TabNominessAddressActive = () => { setTab(TAB.NOMINEES_ADDRESS); }
	const TabNomiDirectorActive = () => { setTab(TAB.NOMINEES_DIRECTOR_NAME); }
	const TabShareHoldersActive = () => { setTab(TAB.SHAREHOLDERS_DOCUMENTS); }



	const OpenUpdateNomineesAddressModal = () => {

	}

	return (
		<PageWrapper title={settingsMenu.settings.subMenu.configurations.text}>
			<Page>

				<div style={{ display: 'flex', gap: 10 ,paddingBottom:20}}>
					<Button isOutline={!(tab === TAB.NOMINEES_ADDRESS)} onClick={TabNominessAddressActive} color='info'>Nominee's Address</Button>
					<Button isOutline={!(tab === TAB.NOMINEES_DIRECTOR_NAME)} onClick={TabNomiDirectorActive} color='info'>Nominee's Director Name</Button>
					<Button isOutline={!(tab === TAB.SHAREHOLDERS_DOCUMENTS)} onClick={TabShareHoldersActive} color='info'>Shareholder's Documents</Button>
				</div>

				<Card stretch={'full'}>


					<div style={{ display: tab === TAB.NOMINEES_ADDRESS ? 'flex' : 'none', flexDirection:'column', height:'100%' }}>
						<NomineesAddress />
					</div>
					<div style={{ display: tab === TAB.NOMINEES_DIRECTOR_NAME ? 'flex' : 'none' ,flexDirection:'column',height:'100%'}}>
						<NomineesDirectorName />
					</div>
					<div style={{ display: tab === TAB.SHAREHOLDERS_DOCUMENTS ? 'flex' : 'none',flexDirection:'column',height:'100%' }}>
						<ShareholdersDocuments />
					</div>

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
		alignItems: 'center',
	},
	FormItemLabel: {
		width: 120
	},
	FormItemInput: {
		flex: 1
	}
}