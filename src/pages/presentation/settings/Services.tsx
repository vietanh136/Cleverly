import React, { useState, useEffect } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { settingsMenu } from '../../../menu';
import Button from '../../../components/bootstrap/Button';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';

const DEFAULT_NO_IMAGE = require('../../../assets/img/thumb.jpg');

const OnlyContent = () => {
	const [isUpdateServiceModalOpen, setIsUpdateServiceModalOpenState] = useState(false);
	const [serviceName, setServiceName] = useState('');
	const [avatarData, setAvatarData] = useState('');
	const [avatarPreview, setAvatarPreview] = useState('');
	const [listServices, setListServices] = useState<any[]>([]);
	const [totalPage, setTotalPage] = useState([1]);
	const [curentPage, setCurentPage] = useState(1);

	const [currentIndexRow, setCurrentIndexRow] = useState(1);

	const CloseUpdateServiceModal = () => {
		setIsUpdateServiceModalOpenState(false);
		setServiceName('');
		setAvatarPreview('');
		setAvatarData('');
	}
	const OpenUpdateServiceModal = () => {
		setIsUpdateServiceModalOpenState(true);
	}
	const ServiceNameOnChange = (event: any) => {
		setServiceName(event.target.value);
	}

	const AvatarOnChange = (event: any) => {

		const reader = new FileReader();
		reader.onloadend = function (rs: any) {
			setAvatarPreview(rs?.currentTarget?.result);
			const basr64Data = rs?.currentTarget?.result.split('base64,');
			setAvatarData(basr64Data);
		}
		reader.readAsDataURL(event.target.files[0]);

	}
	const AvatarOpenFileChoose = () => {
		document.getElementById('avatar')?.click();
	}
	const SaveData = () => {
		let model = {
			No: currentIndexRow,
			Avatar: avatarPreview,
			ServiceName: serviceName
		};
		let errorCount = 0;
		if (model.ServiceName === '') { errorCount++; showNotification('Cảnh bảo', 'Tên dịch vụ không được để trống', 'danger'); }
		if (model.Avatar === '') { errorCount++; showNotification('Cảnh bảo', 'Chưa chọn ảnh đại diện cho dịch vụ', 'danger'); }
		if (errorCount > 0) return;

		listServices.push(model);
		//setListServices(listServices);
		setCurrentIndexRow(currentIndexRow + 1);
		CloseUpdateServiceModal();
	}
	return (
		<PageWrapper title={settingsMenu.settings.subMenu.services.text}>
			<Page>
				<div className='user-account'>
					<div>
						<Button title='Add new' icon='Add' isOutline color='success' onClick={OpenUpdateServiceModal}>Add new</Button>
					</div>
					<div className='list-data' style={{ paddingTop: 15 }}>
						<ul className='list-data-header'>
							<li>
								<div className='header-item'>
									<div style={{ width: 80 }}>No</div>
									<div style={{ width: 80 }}></div>
									<div style={{ width: 150 }}>Avatar</div>
									<div style={{ flex: 1 }}>Service name</div>
								</div>
							</li>
						</ul>
						<ul className='list-data-body'>
							{
								listServices.length <= 0 ?
								<li><div style={{ padding: 10 }}>No data</div></li>
									:
									listServices.map((item, index) => {

										return (<li key={index}>
											<div>
												<div className='no'>{item.No}</div>
												<div className='action' >
													<button className='btn' style={{ border: 'none' }}><Icon icon='Menu' size={'lg'} /> </button>
												</div>
												<div style={innerStyle.DataItemAvatar}>
													<img src={item.Avatar} style={{ width: 60, height: 60, borderRadius: 7, objectFit: 'cover' }} />
												</div>
												<div style={innerStyle.DataItemServiceName}>{item.ServiceName}</div>
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
											<Button isOutline color={item === curentPage ? 'primary' : 'link'} >{item}</Button>
										</li>
									)
								})
							}

						</ul>
					</div>

				</div>
			</Page>
			<Modal
				isOpen={isUpdateServiceModalOpen} // Example: state
				setIsOpen={CloseUpdateServiceModal} // Example: setState
				isStaticBackdrop={true}
				isScrollable={true}
				isCentered={true}
				size={'lg'} // 'sm' || 'lg' || 'xl' 
				fullScreen={'md'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
				isAnimation={true}>
				<ModalHeader
					setIsOpen={CloseUpdateServiceModal} // Example: setState
				>
					<ModalTitle id={'UpdateServiceModalTitle'}>Update Service</ModalTitle>
				</ModalHeader>
				<ModalBody >
					<div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'service-name'}>Service name</Label>
							<Textarea value={serviceName} onChange={ServiceNameOnChange} id={'service-name'} />
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'avatar'}>Avatar</Label>
							<input type={'hidden'} id={'avatar-base-64'} value={avatarData} />
							<input type={'file'} accept={'image/*'} id={'avatar'} style={{ display: 'none' }} onChange={AvatarOnChange} />
							<img style={{ width: 100, height: 100, objectFit: 'cover' }} src={avatarPreview === '' ? DEFAULT_NO_IMAGE : avatarPreview} id={'avatar-preview'} onClick={AvatarOpenFileChoose} />
						</div>

					</div>


				</ModalBody>
				<ModalFooter  >
					<Button isOutline color='success' onClick={SaveData}>Save</Button>
				</ModalFooter>
			</Modal>
		</PageWrapper>
	);
};

export default OnlyContent;
const innerStyle = {

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
	},

	DataItemAvatar: { width: 150 },
	DataItemAvatarImg: { width: 60, height: 60, borderRadius: 7, objectFit: 'cover' },
	DataItemServiceName: { flex: 1 },

}
