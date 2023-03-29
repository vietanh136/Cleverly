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
import { CheckErrorResponse, CONSTANT, GetObjectProperty, SendGetRequest, SendPostRequest } from '../../../helpers/helpers';
import Card, { CardActions, CardBody, CardFooter, CardHeader, CardLabel } from '../../../components/bootstrap/Card';
import Popovers from '../../../components/bootstrap/Popovers';


const OnlyContent = () => {

	const fileChoose = useRef<any>();
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
	const [listData, setListData] = useState<any[]>([]);
	const [totalPage, setTotalPage] = useState([1]);
	const [currentPage, setCurrentPage] = useState(1);
	const [id, setId] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const [sendTo, setSendTo] = useState('');
	const [title, setTitle] = useState('');
	const [fileName, setFileName] = useState('');
	const [fileExt, setFileExt] = useState('');
	const [fileMime, setFileMime] = useState('');
	const [fileDataBase64, setFileDataBase64] = useState('');

	const [listFile, setListFile] = useState<any[]>([]);

	const SendToOnChange = (obj: any) => { setSendTo(obj.target.value); }
	const TitleOnChange = (obj: any) => { setTitle(obj.target.value); }
	const FileNameOnChange = (obj: any) => { setFileName(obj.target.value); }
	const BrowseFileOnChange = (event: any) => {
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
			setFileMime(extData);
			setFileExt(ext);
			setFileDataBase64(base64Data[1]);
		}
		reader.readAsDataURL(event.target.files[0]);

	}
	const CloseUpdateModal = () => {
		setTitle('');
		setSendTo('');
		setListFile([]);
		setFileMime('');
		setFileName('');
		setFileExt('');
		setFileDataBase64('');
		fileChoose.current.value = "";
		setIsUpdateModalOpen(false);
	}
	const AddFile = () => {
		let model = {
			FileName: fileName,
			FilePath: fileDataBase64,
			FileType: 5,
			FileMime: fileMime,
			FileExt: fileExt
		};
		let errorCount = 0;
		if (model.FileName === '') { errorCount++; showNotification('Warning', 'File name cannot be null', 'danger'); }
		if (model.FilePath === '') { errorCount++; showNotification('Warning', 'Must be choose file', 'danger'); }
		if (errorCount > 0) return;

		if (fileExt === 'docx' || fileExt === 'doc') model.FileType = 1;
		else if (fileExt === 'xlsx' || fileExt === 'xls') model.FileType = 2;
		else if (fileExt === 'pptx' || fileExt === 'ppt') model.FileType = 3;
		else if (fileExt === 'pdf') model.FileType = 4;

		listFile.push(model);
		setFileMime('');
		setFileName('');
		setFileExt('');
		setFileDataBase64('');
		fileChoose.current.value = "";
	}

	const DeleteFile = (index: number) => {
		let listFileTmp = listFile;
		listFileTmp.splice(index, 1);
		setListFile([...listFileTmp]);
	}

	const SaveData = async () => {
		let model = {
			SentTo: sendTo,
			Email: '',
			Title: title,
			ListAttachment: listFile
		}

		let errorCount = 0;
		if (model.SentTo === '') {
			errorCount++;
			showNotification('Warning', 'Please choose customer email', 'danger');
		}
		if (model.Title === '') {
			errorCount++;
			showNotification('Warning', 'Title cannot be left blank', 'danger');
		}
		if (errorCount > 0) return;

		let rs = await SendPostRequest('/MailRoom/SendMail', model);
		if (!CheckErrorResponse(rs)) return;
		showNotification('Congratulation', 'Sent mail successfully', 'success');
		CloseUpdateModal();
	}

	const LoadListData = async () => {
		let rs = await SendGetRequest('/MailRoom/GetListMailRoom?page=' + currentPage);
		if (!CheckErrorResponse(rs)) return;

		const totalPageData = Math.ceil(GetObjectProperty(rs.data, 'totalRow', 0) / CONSTANT.NUMBER.ROW_PER_PAGE);
		let totalPageList = [];
		for (let index = 1; index <= totalPageData; index++) {
			totalPageList.push(index);
		}
		setTotalPage(totalPageList);
		setListData(rs.data.listData);

	}
	const AcceptDelete = async (e: any) => {
		let rs = await SendGetRequest('/MailRoom/DeleteMail?id=' + id);
		if (CheckErrorResponse(rs) === false) return;
		showNotification('Congratulation', 'Deleted successfully', 'success');
		LoadListData();
		setId('');
		setIsConfirmDeleteModalOpen(false);
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

	const RenderIconFileType = (type: number) => {
		switch (type) {
			case 1: return 'fa-regular fa-file-word fa-xl';
			case 2: return 'fa-regular fa-file-excel fa-xl';
			case 3: return 'fa-regular fa-file-powerpoint fa-xl';
			case 4: return 'fa-regular fa-file-pdf fa-xl';
			case 5: return 'fa-regular fa-file-image fa-xl';
		}
	}

	const OpenComposeMailModal = () => { setIsUpdateModalOpen(true); }
	useEffect(() => {
		LoadListData();
	}, []);

	return (
		<PageWrapper title={customerManagementsMenu.customerManagements.subMenu.mailRoom.text}>
			<Page>

				<Card stretch={'full'}>
					<CardHeader>
						<CardLabel>{ }</CardLabel>
						<CardActions>
							<Button title='Add new' icon='Add' isLight isOutline color='success' onClick={OpenComposeMailModal}>Compose</Button>
						</CardActions>
					</CardHeader>
					<CardBody isScrollable className='table-responsive'>
						<table className='table table-modern table-hover'>
							<thead>
								<tr>
									<th style={{ width: 60 }}>No</th>
									<th style={{ width: 60 }}></th>
									<th style={{ width: 200 }}>To</th>
									<th>Content</th>
									<th style={{ width: 120 }}>Create date</th>
									<th style={{ width: 100 }}>Status</th>
								</tr>
							</thead>
							<tbody>
								{
									listData.map((item, index) => {
										return (
											<tr key={index}>
												<td>{((currentPage - 1) * CONSTANT.NUMBER.ROW_PER_PAGE + index + 1)}</td>
												<td>
													<Popovers data-id={item.ID} trigger={'hover'} delay={600}
														desc={<div style={{ display: 'flex', flexDirection: 'column' }}><Button onClick={ConfirmDelete}>Delete</Button></div>}
													>
														<Button><i className="fa-solid fa-bars"></i></Button>
													</Popovers>
												</td>
												<td></td>
												<td></td>
												<td></td>
												<td></td>
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
				isOpen={isUpdateModalOpen} // Example: state
				setIsOpen={CloseUpdateModal} // Example: setState
				isStaticBackdrop={true}
				isScrollable={true}
				isCentered={true}
				size={'lg'} // 'sm' || 'lg' || 'xl' 
				fullScreen={'md'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
				isAnimation={true}>
				<ModalHeader
					setIsOpen={CloseUpdateModal} // Example: setState
				>
					<ModalTitle id={''}>Send Mail</ModalTitle>
				</ModalHeader>
				<ModalBody >
					<div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'send-to'}>Send to</Label>
							<Input style={innerStyle.FormItemInput} value={sendTo} onChange={SendToOnChange} autoComplete={'false'} id='send-to' />
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'title'}>Title</Label>
							<Input style={innerStyle.FormItemInput} value={title} onChange={TitleOnChange} autoComplete={'false'} id='title' />
						</div>

						<div style={{ borderWidth: .25, borderColor: '#f2f2f2', borderStyle: 'solid', marginBottom: 15 }}>

						</div>

						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'file-name'}>File name</Label>
							<Input style={innerStyle.FormItemInput} value={fileName} onChange={FileNameOnChange} autoComplete={'false'} id='file-name' />
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'file'}>Browse</Label>
							<input type={'hidden'} id={'file-base-64'} value={fileDataBase64} />
							<Input style={innerStyle.FormItemInput} type={'file'} ref={fileChoose} id={'file'} onChange={BrowseFileOnChange} />

						</div>
						<div style={{ paddingBottom: 15, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
							<Button title='Add' icon='Add' isOutline color='success' onClick={AddFile}>Add</Button>
						</div>
						<table className='table'>
							<thead>
								<tr>
									<th style={{ width: 80 }}>No</th>
									<th style={{ width: 80 }}></th>
									<th>File name</th>
								</tr>
							</thead>
							<tbody>
								{

									listFile.length <= 0 ? <tr>
										<td colSpan={3} style={{ fontStyle: 'italic' }}>{'Chưa có file nào được chọn'}</td>
									</tr> :
										listFile.map((item, index) => {
											return (
												<tr key={index}>
													<td style={{ textAlign: 'right', verticalAlign: 'middle' }}>{index + 1}</td>
													<td>
														<button className='btn' style={{ border: 'none' }} onClick={() => { DeleteFile(index); }}><Icon icon='Close' color='danger' size={'lg'} /></button>
													</td>
													<td style={{ verticalAlign: 'middle' }}> <i className={RenderIconFileType(item.FileType)}></i><span style={{ paddingLeft: 5 }}>{item.FileName}</span></td>
												</tr>
											);
										})
								}
							</tbody>
						</table>


					</div>


				</ModalBody>
				<ModalFooter  >
					<Button isOutline color='success' onClick={SaveData}>Send</Button>
					<Button isOutline color='link' onClick={CloseUpdateModal}>Close</Button>
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
	},
	FormItemLabel: {
		width: 120
	},
	FormItemInput: {
		flex: 1
	}
}