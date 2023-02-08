import React, { useState, useRef, useEffect } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { customerManagementsMenu } from '../../../menu';
import Button from '../../../components/bootstrap/Button';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import Select from '../../../components/bootstrap/forms/Select';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import Checks from '../../../components/bootstrap/forms/Checks';

const OnlyContent = () => {
	const fileChoose = useRef<any>();
	const [isAddNewProfileModalOpen, setIsAddNewProfileModalOpen] = useState(false);
	const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] = useState(false);

	const [listData, setListData] = useState<any[]>([{ CompanyName: 'hiSOFT Solution LLC', Address: '160 Robinson Road, #14-40 Singapore Business Federation Center' }]);
	const [totalPage, setTotalPage] = useState([1]);
	const [currentPage, setCurrentPage] = useState(1);

	const [listFileAndFolder, setListFileAndFolder] = useState<any[]>([
		{
			name: 'Registers',
			type: 'folder',
			subfolder: [
				{
					name: 'Registers of Tranfers',
					type: 'folder',
				},
				{
					name: 'Registers of Directors',
					type: 'folder',
				},
				{
					name: 'Word',
					type: 'file',
				},
				{
					name: 'Excel',
					type: 'file',
				},
			],
		},
		{
			name: 'Miscellaneous',
			type: 'folder',
		},
	]);

	const [folderName, setFolderName] = useState('');
	const [fileName, setFileName] = useState('');
	const [fileDataBase64, setFileDataBase64] = useState('');
	const FileNameOnChange = (obj: any) => { setFileName(obj.target.value); }
	const FolderNameOnChange = (obj: any) => { setFolderName(obj.target.value); }
	const BrowseFileOnChange = (event: any) => {

		const reader = new FileReader();
		reader.onloadend = function (rs: any) {
			const basr64Data = rs?.currentTarget?.result.split('base64,');
			setFileDataBase64(basr64Data);
		}
		reader.readAsDataURL(event.target.files[0]);

	}
	const [profileType, setProfileType] = useState('file');

	const ProfileTypeOnChange = (obj: any) => { setProfileType(obj.target.value); }
	const CompanyOnChange = (obj: any) => { }

	const OpenAddNewProfileModal = () => { setIsAddNewProfileModalOpen(true); }
	const CloseAddNewProfileModal = () => { setIsAddNewProfileModalOpen(false); }
	const OpenUpdateProfileModal = () => { setIsUpdateProfileModalOpen(true); }
	const CloseUpdateProfileModal = () => { setIsUpdateProfileModalOpen(false); }
	const SaveNewProfile = () => { }
	return (
		<PageWrapper title={customerManagementsMenu.customerManagements.subMenu.dataRoom.text}>
			<Page>
				<div className='user-account'>
					<div>
						<Button title='Add new' icon='Add' isOutline color='success' onClick={OpenAddNewProfileModal}>Add new</Button>
					</div>
					<div className='list-data' style={{ paddingTop: 15 }}>
						<ul className='list-data-header'>
							<li>
								<div className='header-item'>
									<div style={{ width: 80 }}>No</div>
									<div style={{ width: 80 }}></div>
									<div style={{ flex: 1 }}>Company name</div>
								</div>
							</li>
						</ul>
						<ul className='list-data-body'>
							{
								listData.length <= 0 ?
									<li><div style={{ padding: 10 }}>No data</div></li>
									:
									listData.map((item, index) => {

										return (<li key={index}>
											<div >
												<div className='no'>{index + 1}</div>
												<div className='action'>
													<button className='btn' style={{ border: 'none' }} onClick={OpenUpdateProfileModal}><Icon icon='Menu' color='info' size={'lg'} /></button>
												</div>
												<div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
													<div style={{ fontWeight: 'bold' }}>{item.CompanyName}</div>
													<div style={{ fontStyle: 'italic' }}>{item.Address}</div>
												</div>
											</div>
										</li>)
									})
							}
						</ul>

						<ul className='list-data-pagination'>
							{
								totalPage.map((item, index) => {
									return (
										<li key={index}>
											<Button isOutline color={item === currentPage ? 'primary' : 'link'} >{item}</Button>
										</li>
									)
								})
							}

						</ul>
					</div>

				</div>
			</Page>
			<Modal
				isOpen={isAddNewProfileModalOpen} // Example: state
				setIsOpen={setIsAddNewProfileModalOpen} // Example: setState
				isStaticBackdrop={true}
				isScrollable={true}
				isCentered={true}
				size={'lg'} // 'sm' || 'lg' || 'xl' 
				fullScreen={'md'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
				isAnimation={true}>
				<ModalHeader
					setIsOpen={setIsAddNewProfileModalOpen} // Example: setState
				>
					<ModalTitle id={'AddNewProfileModalTitle'}>Add New Profile</ModalTitle>
				</ModalHeader>
				<ModalBody >
					<div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'send-to'}>Company name</Label>
							<Select ariaLabel=''
							style={innerStyle.FormItemInput}
								list={[{ value: '1', text: 'Company A' }, { value: '2', text: 'Company B' }, { value: '3', text: 'Company C' },]}
								onChange={CompanyOnChange}
							/>
						</div>

						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={''}></Label>
							<Checks
								checked={profileType}
								label={'File'}
								name={'profile-type'}
								type="radio"
								value={'file'}
								onChange={ProfileTypeOnChange}
							/>
							<Checks
								checked={profileType}
								label={'Folder'}
								name={'profile-type'}
								type="radio"
								value={'folder'}
								onChange={ProfileTypeOnChange}
							/>
						</div>

						{
							profileType === 'file' ?
								<>

									<div style={innerStyle.FormItem}>
										<Label style={innerStyle.FormItemLabel} htmlFor={'file-name'}>File name</Label>
										<Input style={innerStyle.FormItemInput} value={fileName} onChange={FileNameOnChange} autoComplete={'false'} id='file-name' />
									</div>
									<div style={innerStyle.FormItem}>
										<Label style={innerStyle.FormItemLabel} htmlFor={'file'}>Browse</Label>
										<input type={'hidden'} id={'file-base-64'} value={fileDataBase64} />
										<input type={'file'} ref={fileChoose} id={'file'} style={{}} onChange={BrowseFileOnChange} />

									</div>
								</>
								:
								<div style={innerStyle.FormItem}>
									<Label style={innerStyle.FormItemLabel} htmlFor={'title'}>Folder name</Label>
									<Input style={innerStyle.FormItemInput} value={folderName} onChange={FolderNameOnChange} autoComplete={'false'} id='title' />
								</div>

						}

					</div>


				</ModalBody>
				<ModalFooter  >
					<Button isOutline color='success' onClick={SaveNewProfile}>Send</Button>
					<Button isOutline color='link' onClick={CloseAddNewProfileModal}>Close</Button>
				</ModalFooter>
			</Modal>

			<Modal
				isOpen={isUpdateProfileModalOpen} // Example: state
				setIsOpen={setIsUpdateProfileModalOpen} // Example: setState
				isStaticBackdrop={true}
				isScrollable={true}
				isCentered={true}
				size={'lg'} // 'sm' || 'lg' || 'xl' 
				fullScreen={'md'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
				isAnimation={true}>
				<ModalHeader
					setIsOpen={setIsUpdateProfileModalOpen} // Example: setState
				>
					<ModalTitle id={'UpdateProfileModalTitle'}>{'hiSOFT Solution LLC'}</ModalTitle>
				</ModalHeader>
				<ModalBody >
					<div>
						<div>
							<Button isOutline color='success' onClick={() => { }}>Add folder</Button>
							<Button isOutline color='link' onClick={() => { }}>Add file</Button>
						</div>
						<ul>
							<li></li>
							<li>Name</li>
						</ul>
						<ul>
							<li></li>
						</ul>
						<table className='table'>
							<thead>
								<tr>
									<th></th>
									<th>Name</th>
								</tr>
							</thead>
							<tbody>
								{
									listFileAndFolder.map((item, index) => {
										return (
											<tr key={index}>
												<td>{index + 1}</td>
												<td>
													<button className='btn' style={{ border: 'none' }}><Icon icon='Close' color='danger' size={'lg'} /></button>
												</td>
												<td>{item.FileName}</td>
											</tr>
										);
									})
								}
							</tbody>
						</table>


					</div>


				</ModalBody>
			</Modal>
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
		gap:10
	},
	FormItemLabel: {
		width: 120
	},
	FormItemInput: {
		flex: 1
	}
}