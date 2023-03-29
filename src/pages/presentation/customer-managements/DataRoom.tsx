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
import $ from 'jquery';
import Card, { CardActions, CardBody, CardFooter, CardHeader, CardLabel } from '../../../components/bootstrap/Card';
import Popovers from '../../../components/bootstrap/Popovers';
import { CheckErrorResponse, CONSTANT, GetObjectProperty, SendGetRequest, SendPostRequest } from '../../../helpers/helpers';
const OnlyContent = () => {
	const [isAddNewProfileModalOpen, setIsAddNewProfileModalOpen] = useState(false);
	const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
	const [isPopupAddNewFileConfirmOpen, setIsPopupAddNewFileConfirmOpen] = useState(false);
	const [isAddNewFileModalOpen, setIsAddNewFileModalOpen] = useState(false);
	const [fileName, setFileName] = useState('');
	const [fileData, setFileData] = useState('');
	const [fileDataExt, setFileDataExt] = useState('');
	const [dataRoomId, setDataRoomId] = useState('');
	const [dataRoomCompanyName, setDataRoomCompanyName] = useState('');
	const [dataRoomCompanyRootFolder, setDataRoomCompanyRootFolder] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [listCompany, setListCompany] = useState<any[]>([]);
	const [listData, setListData] = useState<any[]>([]);
	const [totalPage, setTotalPage] = useState([1]);
	const [currentPage, setCurrentPage] = useState(1);

	const [id, setId] = useState('');
	const [companyId, setCompanyId] = useState('');
	const [folderName, setFolderName] = useState('');
	const FolderNameOnChange = (obj: any) => { if (/[^a-zA-Z0-9\b.!$%^&*()\-_,]/.test(obj.target.value)) return; if (obj.target.value.length > 255) return; setFolderName(obj.target.value); }
	const FileNameOnChange = (obj: any) => { if (/[^a-zA-Z0-9\b.!$%^&*()\-_,]/.test(obj.target.value)) return; if (obj.target.value.length > 255) return; setFileName(obj.target.value); }
	const BrowseFileOnChange = async (event: any) => {
		const reader = new FileReader();
		reader.onloadend = function (rs: any) {
			if (rs.total > 5242880) {
				showNotification('Warning', 'File size must be less than 5MB', 'danger');
				$(event.target).val('');
				return;
			}
			const base64Data = rs?.currentTarget?.result.split('base64,');

			let extData = base64Data[0].replace(';', '').replace('data:', '');
			let extPart = extData.split('/');
			let ext = '';
			switch (extPart[1]) {
				case 'vnd.openxmlformats-officedocument.wordprocessingml.document': ext = 'docx'; break;
				case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet': ext = 'xlsx'; break;
				case 'vnd.openxmlformats-officedocument.presentationml.presentation': ext = 'pptx'; break;
				case 'msword': ext = 'doc'; break;
				case 'pdf': ext = 'pdf'; break;
				case 'vnd.ms-powerpoint': ext = 'ppt'; break;
				case 'vnd.ms-excel': ext = 'xls'; break;
				default: ext = 'png';
			}
			setFileDataExt(ext);
			setFileData(base64Data[1]);
		}
		reader.readAsDataURL(event.target.files[0]);

	}

	const UpdaloadFile = async () => {

		try {
			setIsLoading(true);

			let model = {
				FolderID: dataRoomId,
				FileName: fileName,
				FileData: fileData,
				FileType: 5,
				FileExt: fileDataExt
			};


			let errorCount = 0;
			if (model.FileName === '') {
				errorCount++;
				showNotification('Warning', 'File name cannot be left blank', 'danger');
			}
			if (model.FileData === '') {
				errorCount++;
				showNotification('Warning', 'Please choose file to upload', 'danger');
			}

			if (model.FileExt === 'docx' || model.FileExt === 'doc') model.FileType = 1;
			else if (model.FileExt === 'xlsx' || model.FileExt === 'xls') model.FileType = 2;
			else if (model.FileExt === 'pptx' || model.FileExt === 'ppt') model.FileType = 3;
			else if (model.FileExt === 'pdf') model.FileType = 4;

			if (errorCount > 0) throw new Error();
			let rs = await SendPostRequest('/dataroom/UploadFile', model);

			if (CheckErrorResponse(rs) === false) throw new Error();
			showNotification('Congratulation', 'Updated successfully', 'success');
			CloseAddNewFileModal();
		}
		catch (ex) {

		}
		setIsLoading(false);

	}

	const CompanyOnChange = (obj: any) => { setCompanyId(obj.target.value); }
	const OpenAddNewFileModal = () => { setIsPopupAddNewFileConfirmOpen(false); setIsAddNewFileModalOpen(true); }
	const CloseAddNewFileModal = () => {
		setDataRoomId('');
		setDataRoomCompanyName('');
		setDataRoomCompanyRootFolder(''); setIsAddNewFileModalOpen(false);
	}

	const OpenAddNewProfileModal = () => { setIsAddNewProfileModalOpen(true); }
	const CloseAddNewProfileModal = () => { setFolderName(''); setCompanyId(''); setIsAddNewProfileModalOpen(false); }
	const OpenUpdateProfileModal = (e: any) => {
		const folderId = $(e.target).closest('.popover').data('id');
		window.location.href = '/data-room/update?id=' + folderId;
	}
	const AcceptDelete = async (e: any) => {
		let rs = await SendGetRequest('/dataroom/DeleteCompanyDataRoom?id=' + id);
		if (CheckErrorResponse(rs) === false) return;
		showNotification('Congratulation', 'Deleted successfully', 'success');
		CloseConfirmDelete()
		LoadData();
	}
	const ConfirmDelete = (e: any) => {
		const deleteId = $(e.target).closest('.popover').data('id');
		setId(deleteId);
		setIsConfirmDeleteModalOpen(true);
	}
	const CloseConfirmDelete = () => {
		setId('');
		setIsConfirmDeleteModalOpen(false);
	}
	const SaveNewProfile = async () => {
		try {
			let model = {
				ID: id,
				CompanyID: companyId,
				FolderName: folderName
			};

			let errorCount = 0;
			if (model.CompanyID === '') {
				errorCount++;
				showNotification('Warning', 'Please choose company', 'danger');
			}
			if (model.FolderName === '') {
				errorCount++;
				showNotification('Warning', 'Folder name cannot be left blank', 'danger');
			}
			if (errorCount > 0) throw new Error();
			setIsLoading(true);
			let rs = await SendPostRequest('/dataroom/CreateCompanyFolder', model);
			setIsLoading(false);
			if (CheckErrorResponse(rs) === false) throw new Error();
			showNotification('Congratulation', 'Updated successfully', 'success');
			LoadData();
			CloseAddNewProfileModal();
			setDataRoomId(rs.data.DataRoomId);
			setDataRoomCompanyName(rs.data.CompanyName);
			setDataRoomCompanyRootFolder(rs.data.RootFolder);
			setIsPopupAddNewFileConfirmOpen(true);
		}
		catch (ex) {

		}
		setIsLoading(false);

	}
	const LoadData = async () => {
		let rs = await SendGetRequest('/DataRoom/GetListCompanyDataRoom?page=' + currentPage);
		if (CheckErrorResponse(rs) === false) return;
		const totalPageData = Math.ceil(GetObjectProperty(rs.data, 'totalRow', 0) / CONSTANT.NUMBER.ROW_PER_PAGE);
		let totalPageList = [];
		for (let index = 1; index <= totalPageData; index++) {
			totalPageList.push(index);
		}
		setTotalPage(totalPageList);
		setListData(rs.data.listData);
		rs = await SendGetRequest('/DataRoom/GetListCompany');
		if (CheckErrorResponse(rs) === false) return;
		setListCompany([{ value: '', text: 'Please choose company' }, ...rs.data]);
	}
	useEffect(() => {
		LoadData();

	}, [])

	return (
		<PageWrapper title={customerManagementsMenu.customerManagements.subMenu.dataRoom.text}>
			<Page>
				<Card stretch={'full'}>
					<CardHeader>
						<CardLabel>{ }</CardLabel>
						<CardActions>
							<Button title='Add new' icon='Add' isLight isOutline color='success' onClick={OpenAddNewProfileModal}>Add new</Button>
						</CardActions>
					</CardHeader>
					<CardBody isScrollable className='table-responsive'>
						<table className='table table-modern table-hover'>
							<thead>
								<tr>
									<th style={{ width: 60 }}>No</th>
									<th style={{ width: 60 }}></th>
									<th>Company name</th>
								</tr>
							</thead>
							<tbody>
								{
									listData.length <= 0 ? <tr><td colSpan={3}>No data</td></tr> :
										listData.map((item, index) => {
											let addressCompany = item.Address;
											if (GetObjectProperty(item, 'ProvinceName') !== '') {
												if (addressCompany === '') addressCompany += GetObjectProperty(item, 'ProvinceName');
												else addressCompany += ', ' + GetObjectProperty(item, 'ProvinceName');
											}
											if (GetObjectProperty(item, 'DistrictName') !== '') {
												if (addressCompany === '') addressCompany += GetObjectProperty(item, 'DistrictName');
												else addressCompany += ', ' + GetObjectProperty(item, 'DistrictName');
											}
											if (GetObjectProperty(item, 'WardName') !== '') {
												if (addressCompany === '') addressCompany += GetObjectProperty(item, 'WardName');
												else addressCompany += ', ' + GetObjectProperty(item, 'WardName');
											}
											return (
												<tr key={index}>
													<td>{((currentPage - 1) * CONSTANT.NUMBER.ROW_PER_PAGE + index + 1)}</td>
													<td>
														<Popovers data-id={item.ID} trigger={'hover'} delay={600}
															desc={<div style={{ display: 'flex', flexDirection: 'column' }}>
																<Button onClick={OpenUpdateProfileModal}>Edit</Button><Button onClick={ConfirmDelete}>Delete</Button></div>}
														>
															<Button><i className="fa-solid fa-bars"></i></Button>
														</Popovers>
													</td>
													<td>
														<div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
															<div style={{ fontWeight: 'bold' }}>{item.CompanyName}</div>
															<div style={{ fontStyle: 'italic' }}>{addressCompany}</div>
														</div>
													</td>
												</tr>
											);
										})
								}
							</tbody>
						</table>
					</CardBody>
					<CardFooter>

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
					</CardFooter>
				</Card>
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
					<ModalTitle id={'AddNewProfileModalTitle'}>Add New Folder</ModalTitle>
				</ModalHeader>
				<ModalBody >
					<div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'send-to'}>Company name</Label>
							<Select ariaLabel=''
								style={innerStyle.FormItemInput}
								list={listCompany}
								onChange={CompanyOnChange}
							/>
						</div>
						{

							/*
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
							*/
						}




						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'title'}>Folder name</Label>
							<Input style={innerStyle.FormItemInput} value={folderName} onChange={FolderNameOnChange} autoComplete={'false'} id='title' />
						</div>
					</div>
				</ModalBody>
				<ModalFooter  >
					<Button isOutline color='success' isDisable={isLoading} onClick={SaveNewProfile}>Send</Button>
					<Button isOutline color='link' onClick={CloseAddNewProfileModal}>Close</Button>
				</ModalFooter>
			</Modal>

			<Modal
				isOpen={isAddNewFileModalOpen} // Example: state
				isStaticBackdrop={true}
				isScrollable={true}
				isCentered={true}
				size={'lg'} // 'sm' || 'lg' || 'xl' 
				fullScreen={'md'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
				isAnimation={true}
				setIsOpen={setIsAddNewFileModalOpen}>
				<ModalHeader>
					<ModalTitle id={'ModalTitle'}>Add new file</ModalTitle>
				</ModalHeader>
				<ModalBody >
					<div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'send-to'}>Company name</Label>
							<Input style={innerStyle.FormItemInput} value={dataRoomCompanyName} disabled />
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'send-to'}>Folder name</Label>
							<Input style={innerStyle.FormItemInput} value={dataRoomCompanyRootFolder} disabled />
						</div>

						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'send-to'}>File name</Label>
							<Input style={innerStyle.FormItemInput} value={fileName} onChange={FileNameOnChange} />
						</div>

						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'send-to'}>Browse</Label>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<Input style={innerStyle.FormItemInput} type={'file'} onChange={BrowseFileOnChange} accept={'image/*,.pdf,.xlsx,.pptx,.docx,.xls,.ppt,.doc'} />
								<span style={{ fontStyle: 'italic', fontSize: 13 }}>Max size 5MB per file</span>
							</div>

						</div>
					</div>
				</ModalBody>
				<ModalFooter  >
					<Button isOutline color='success' isDisable={isLoading} onClick={UpdaloadFile} icon={'Done'}>
						Accept
					</Button>
					<Button isOutline color='dark' onClick={CloseAddNewFileModal} icon={'PowerSettingsNew'}>
						Close
					</Button>
				</ModalFooter>
			</Modal>

			<Modal
				isOpen={isPopupAddNewFileConfirmOpen} // Example: state
				isStaticBackdrop={true}
				isScrollable={true}
				isCentered={true}
				size={'sm'} // 'sm' || 'lg' || 'xl' 
				fullScreen={'md'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
				isAnimation={true}
				setIsOpen={setIsPopupAddNewFileConfirmOpen}>
				<ModalHeader>
					<ModalTitle id={'ModalTitle'}>Confirm</ModalTitle>
				</ModalHeader>
				<ModalBody >
					<div>
						Do you want to upload files to this folder?
					</div>
				</ModalBody>
				<ModalFooter  >
					<Button isOutline color='success' onClick={OpenAddNewFileModal} icon={'Done'}>
						Accept
					</Button>
					<Button isOutline color='dark' onClick={CloseAddNewFileModal} icon={'PowerSettingsNew'}>
						Close
					</Button>
				</ModalFooter>
			</Modal>

			<Modal
				isOpen={isConfirmDeleteModalOpen} // Example: state
				isStaticBackdrop={true}
				isScrollable={true}
				isCentered={true}
				size={'sm'} // 'sm' || 'lg' || 'xl' 
				fullScreen={'md'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
				isAnimation={true}
				setIsOpen={setIsConfirmDeleteModalOpen}>
				<ModalHeader>
					<ModalTitle id={'DeleteModalTitle'}>Alert</ModalTitle>
				</ModalHeader>
				<ModalBody >
					<div>
						Are you sure want to delete?
					</div>
				</ModalBody>
				<ModalFooter  >
					<Button isDisable={isLoading} isOutline color='success' onClick={AcceptDelete} icon={'Done'}>
						Accept
					</Button>
					<Button isOutline color='dark' onClick={CloseConfirmDelete} icon={'PowerSettingsNew'}>
						Close
					</Button>
				</ModalFooter>
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
		gap: 10
	},
	FormItemLabel: {
		width: 120
	},
	FormItemInput: {
		flex: 1
	}
}