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


const OnlyContent = () => {

	const fileChoose = useRef<any>();
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [listData, setListData] = useState<any[]>([{To:'bhloc99@gmail.com' , Name : 'Loc Bui', Content : 'Business license', CreateDate : '11:00 20/02/2022', IsRead : false },{To:'bhloc99@gmail.com' , Name : 'Loc Bui', Content : 'Business license', CreateDate : '11:00 20/02/2022', IsRead : true }]);
	const [totalPage, setTotalPage] = useState([1]);
	const [currentPage, setCurrentPage] = useState(1);

	const [sendTo, setSendTo] = useState('');
	const [title, setTitle] = useState('');
	const [fileName, setFileName] = useState('');
	const [fileDataBase64, setFileDataBase64] = useState('');
	const [listFile, setListFile] = useState<any[]>([]);

	const SendToOnChange = (obj: any) => { setSendTo(obj.target.value); }
	const TitleOnChange = (obj: any) => { setTitle(obj.target.value); }
	const FileNameOnChange = (obj: any) => { setFileName(obj.target.value); }
	const BrowseFileOnChange = (event: any) => {

		const reader = new FileReader();
		reader.onloadend = function (rs: any) {
			const basr64Data = rs?.currentTarget?.result.split('base64,');
			setFileDataBase64(basr64Data);
		}
		reader.readAsDataURL(event.target.files[0]);

	}
	const OpenUpdateModal = () => {
		setIsUpdateModalOpen(true);
	}
	const CloseUpdateModal = () => {
		setIsUpdateModalOpen(false);
	}
	const AddFile = () => {
		let model = {
			FileName: fileName,
			FileData: fileDataBase64
		};
		let errorCount = 0;
		if (model.FileName === '') { errorCount++; showNotification('Warning', 'File name cannot be null', 'danger'); }
		if (model.FileData === '') { errorCount++; showNotification('Warning', 'Must be choose file', 'danger'); }
		if (errorCount > 0) return;

		listFile.push(model);
		setFileName('');
		setFileDataBase64('');
		fileChoose.current.value = "";
	}
	const SaveData = () => { }
	return (
		<PageWrapper title={customerManagementsMenu.customerManagements.subMenu.mailRoom.text}>
			<Page>
				<div className='user-account'>
					<div>
						<Button title='Add new' icon='Add' isOutline color='success' onClick={OpenUpdateModal}>Compose</Button>
					</div>
					<div className='list-data' style={{ paddingTop: 15 }}>
						<ul className='list-data-header'>
							<li>
								<div className='header-item'>
									<div style={{ width: 80 }}>No</div>
									<div style={{ width: 80 }}></div>
									<div style={{ width: 200 }}>To</div>
									<div style={{ flex: 1 }}>Content</div>
									<div style={{ width: 120 }}>Create date</div>
									<div style={{ width: 100 }}>Status</div>
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
													<button className='btn' style={{ border: 'none' }}><Icon icon='Menu' color='info' size={'lg'} /></button>
												</div>
												<div style={{ width: 200,display:'flex',flexDirection:'column' }}>
													<div style={{fontWeight:'bold'}}>{item.Name}</div>
													<div style={{fontStyle:'italic'}}>{item.To}</div>													
												</div>
												<div style={{ flex: 1 }}>{item.Content}</div>
												<div style={{ width: 120 }}>{item.CreateDate}</div>
												<div style={{ width: 100 }}>
													<Button color={ item.IsRead ? 'danger' : 'success'} size={'sm'}>
														{ item.IsRead ? 'Unread':'Read' }
													</Button>
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
				isOpen={isUpdateModalOpen} // Example: state
				setIsOpen={setIsUpdateModalOpen} // Example: setState
				isStaticBackdrop={true}
				isScrollable={true}
				isCentered={true}
				size={'lg'} // 'sm' || 'lg' || 'xl' 
				fullScreen={'md'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
				isAnimation={true}>
				<ModalHeader
					setIsOpen={setIsUpdateModalOpen} // Example: setState
				>
					<ModalTitle id={'UpdateNomineesAddressModalTitle'}>Send Mail</ModalTitle>
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
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'file-name'}>File name</Label>
							<Input style={innerStyle.FormItemInput} value={fileName} onChange={FileNameOnChange} autoComplete={'false'} id='file-name' />
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'file'}>Browse</Label>
							<input type={'hidden'} id={'file-base-64'} value={fileDataBase64} />
							<input type={'file'} ref={fileChoose} id={'file'} style={{}} onChange={BrowseFileOnChange} />

						</div>
						<div style={{ paddingBottom: 15, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
							<Button title='Add' icon='Add' isOutline color='success' onClick={AddFile}>Add</Button>
						</div>
						<table className='table'>
							<thead>
								<tr>
									<th>No</th>
									<th></th>
									<th>File name</th>
								</tr>
							</thead>
							<tbody>
								{
									listFile.map((item, index) => {
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
				<ModalFooter  >
					<Button isOutline color='success' onClick={SaveData}>Send</Button>
					<Button isOutline color='link' onClick={CloseUpdateModal}>Close</Button>
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