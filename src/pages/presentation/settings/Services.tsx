import React, { useState, useEffect } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { settingsMenu } from '../../../menu';
import Button from '../../../components/bootstrap/Button';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Select from '../../../components/bootstrap/forms/Select';
import Option from '../../../components/bootstrap/Option';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import { CheckErrorResponse, CONSTANT, GetObjectProperty, SendGetRequest, SendPostRequest, ToggleDropdown, CloseAllDropup } from '../../../helpers/helpers';
import $ from 'jquery';
import Card, { CardActions, CardBody, CardFooter, CardHeader, CardLabel } from '../../../components/bootstrap/Card';
import Popovers from '../../../components/bootstrap/Popovers';
const DEFAULT_NO_IMAGE = require('../../../assets/img/thumb.jpg');

const OnlyContent = () => {
	const [isUpdateServiceModalOpen, setIsUpdateServiceModalOpenState] = useState(false);
	const [id, setId] = useState('');
	const [serviceName, setServiceName] = useState('');
	const [avatarData, setAvatarData] = useState('');
	const [avatarPreview, setAvatarPreview] = useState('');
	const [listServices, setListServices] = useState<any[]>([]);
	const [totalPage, setTotalPage] = useState(1);
	const [curentPage, setCurentPage] = useState(1);
	const [rowPerPage, setRowPerPage] = useState(CONSTANT.RowPerPage[0]);

	const CloseUpdateServiceModal = () => {
		setIsUpdateServiceModalOpenState(false);
		setServiceName('');
		setAvatarPreview('');
		setAvatarData('');
		setId('');
	}

	const ServiceNameOnChange = (event: any) => {
		setServiceName(event.target.value);
	}

	const AvatarOnChange = (event: any) => {

		const reader = new FileReader();
		reader.onloadend = function (rs: any) {
			setAvatarPreview(rs?.currentTarget?.result);
			const basr64Data = rs?.currentTarget?.result.split('base64,');
			setAvatarData(basr64Data[1]);
		}
		reader.readAsDataURL(event.target.files[0]);

	}
	const AvatarOpenFileChoose = () => {
		document.getElementById('avatar')?.click();
	}
	const OpenEditServiceModal = async (e: any) => {
		const serviceId = $(e.target).closest('.dropup').data('id');
		$('.dropup').removeClass('open');
		$('.dropup').find('ul').css('display', 'none');
		let rs = await SendGetRequest('/ServiceManagement/GetService?id=' + serviceId);
		setServiceName(rs.data.ServiceName);
		setAvatarPreview(CONSTANT.HOST_URL + rs.data.ServiceImage);
		setId(rs.data.ID);
		setIsUpdateServiceModalOpenState(true);
	}

	const SaveData = async () => {
		let model = {
			ID: id,
			ServiceImage: avatarData,
			ServiceName: serviceName
		};
		let errorCount = 0;
		if (model.ServiceName === '') { errorCount++; showNotification('Cảnh bảo', 'Tên dịch vụ không được để trống', 'danger'); }
		if (model.ServiceImage === '' && avatarPreview === '') { errorCount++; showNotification('Cảnh bảo', 'Chưa chọn ảnh đại diện cho dịch vụ', 'danger'); }
		if (errorCount > 0) return;

		let rs = await SendPostRequest('/ServiceManagement/Update',model);
		if(CheckErrorResponse(rs) === false) return;

		showNotification('Congratulation','Updated successfully','success');

		CloseUpdateServiceModal();
		LoadData();
	}

	const LoadData = async () => {
		let rs = await SendGetRequest(`/ServiceManagement/GetList?page=${curentPage}&rowPerPage=${rowPerPage}`);
		if (CheckErrorResponse(rs) === false) return;
		setListServices(rs.data.listData);
		setTotalPage(GetObjectProperty(rs.data, 'totalPage', 1));
	}

	const RowPerPageChange = (e: any) => {
		let size = $(e.target).val();
		if (size !== '' && size !== undefined) {
			setRowPerPage(parseInt(size + '')); setCurentPage(1);
			LoadData();
		}

	}
	useEffect(() => {
		LoadData();
	}, [curentPage,rowPerPage]);
	return (
		<PageWrapper title={settingsMenu.settings.subMenu.services.text}>
			<Page>
				<Card stretch={'full'} onClick={CloseAllDropup}>
					<CardHeader>

						<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
							<div style={{ width: 120 }}>{'Row per page'}</div>
							<Select ariaLabel={''} style={{ width: 100 }}
								value={rowPerPage + ''}
								onChange={RowPerPageChange} >
								{
									CONSTANT.RowPerPage.map((item, index) => {
										return (<Option key={index} value={item}>{item + ''}</Option>);
									})
								}
							</Select>
						</div>
						<div>
						
						</div>

					</CardHeader>
					<CardBody isScrollable className='table-responsive'>
						<table className='table table-modern table-hover'>
							<thead>
								<tr>
									<th style={{ width: 60 }}>No</th>
									<th style={{ width: 60 }}></th>
									<th style={{ width: 100 }}>Avatar</th>
									<th>Service name</th>
								</tr>
							</thead>
							<tbody>
								{
									listServices.map((item, index) => {
										return (
											<tr key={index}>
												<td>{((curentPage - 1) * rowPerPage + index + 1)}</td>
												<td>
													<div className="dropup" data-id={item.ID} >
														<button type="button" className="btn " aria-expanded="true" onClick={ToggleDropdown}><i className="fa-solid fa-bars"></i></button>
														<ul style={{ zIndex: 5, position: 'absolute', display: 'none', flexDirection: 'column', backgroundColor: '#dbddd8', padding: 0, margin: 0, borderRadius: 10, borderWidth: .5, borderColor: '#00000020 !important' }}>
															<Button style={{ width: 80 }} onClick={OpenEditServiceModal}>Edit</Button>
														</ul>
													</div>
												</td>
												<td><img src={CONSTANT.HOST_URL + item.ServiceImage} style={{ width: 60, height: 60, borderRadius: 7, objectFit: 'cover' }} /></td>
												<td>{item.ServiceName}</td>
											</tr>
										);
									})
								}
							</tbody>
						</table>
					</CardBody>
					<CardFooter>

						<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
							<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
								<Input type='number' value={curentPage} style={{ width: 80 }} onChange={(e: any) => { if (GetObjectProperty(e.target, 'value') > 0 && GetObjectProperty(e.target, 'value') <= totalPage) setCurentPage(e.target.value); }} /> / {totalPage}
							</div>
						</div>
					</CardFooter>
				</Card>


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
