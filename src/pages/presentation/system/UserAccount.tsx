import React, { useState, useEffect, useContext, useCallback } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { systemMenu } from '../../../menu';
import Button from '../../../components/bootstrap/Button';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import Select from '../../../components/bootstrap/forms/Select';
import Option from '../../../components/bootstrap/Option';
import Icon from '../../../components/icon/Icon';
import showNotification from '../../../components/extras/showNotification';
import { CheckErrorResponse, CONSTANT, GetObjectProperty, SendGetRequest, SendPostRequest, ToggleDropdown, CloseAllDropup } from '../../../helpers/helpers';
import Popovers from '../../../components/bootstrap/Popovers';
import $ from 'jquery';
import Card, { CardActions, CardBody, CardFooter, CardHeader, CardLabel } from '../../../components/bootstrap/Card';



const DEFAULT_NO_IMAGE = require('../../../assets/img/thumb.jpg');
const OnlyContent = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isUpdateUserModalOpen, setIsUpdateUserModalOpenState] = useState(false);
	const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
	const [id, setId] = useState('');
	const [username, setUsername] = useState('');
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [role, setRole] = useState('');
	const [password, setPassword] = useState('');
	const [confirmpassword, setConfirmpassword] = useState('');
	const [avatarData, setAvatarData] = useState('');
	const [avatarPreview, setAvatarPreview] = useState('');


	const [listData, setListData] = useState<any[]>([]);
	const [listRole, setListRole] = useState<any[]>([]);
	const [totalPage, setTotalPage] = useState(1);
	const [curentPage, setCurentPage] = useState(1);
	const [rowPerPage, setRowPerPage] = useState(CONSTANT.RowPerPage[0]);

	const UsernameOnChange = (obj: any) => { if (/[^a-zA-Z0-9\b.!$%^&*()\-_,]/.test(obj.target.value)) return; if (obj.target.value.length > 255) return; setUsername(obj.target.value); }
	const FirstnameOnChange = (obj: any) => { if (/[^a-zA-Z0-9\b.!$%^&*()\-_,]/.test(obj.target.value)) return; if (obj.target.value.length > 255) return; setFirstname(obj.target.value); }
	const LastnameOnChange = (obj: any) => { if (/[^a-zA-Z0-9\b.!$%^&*()\-_,]/.test(obj.target.value)) return; if (obj.target.value.length > 255) return; setLastname(obj.target.value); }
	const RoleOnChange = (obj: any) => { setRole(obj.target.value); }
	const PasswordOnChange = (obj: any) => { if (/[^a-zA-Z0-9\b.!$%^&*()\-_,]/.test(obj.target.value)) return; if (obj.target.value.length > 255) return; setPassword(obj.target.value); }
	const ConfirmPasswordOnChange = (obj: any) => { if (/[^a-zA-Z0-9\b.!$%^&*()\-_,]/.test(obj.target.value)) return; if (obj.target.value.length > 255) return; setConfirmpassword(obj.target.value); }

	const OpenUpdateUserModal = () => {
		setIsUpdateUserModalOpenState(true);
	}
	const CloseUpdateUserModal = () => {
		setIsUpdateUserModalOpenState(false);
		setId('');
		setUsername('');
		setFirstname('');
		setLastname('');
		setRole('2');
		setPassword('');
		setConfirmpassword('');
		setAvatarData('');
		setAvatarPreview('');
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

	const SaveData = async () => {

		let model = {
			ID: id,
			UserName: username,
			FirstName: firstname,
			LastName: lastname,
			PasswordHash: password,
			RoleID: role,
			Avatar: avatarData
		}

		let errorCount = 0;
		if (model.UserName === '') { errorCount++; showNotification('Warning', 'Username cannot be left blank', 'danger'); }
		if (model.FirstName === '') { errorCount++; showNotification('Warning', 'First name cannot be left blank', 'danger'); }
		if (model.LastName === '') { errorCount++; showNotification('Warning', 'Last name cannot be left blank', 'danger'); }
		if (model.PasswordHash === '') {
			if (model.ID === '') {
				errorCount++;
				showNotification('Warning', 'Password cannot be left blank', 'danger');
			}
		}
		else {
			if (model.PasswordHash.length < 8) {
				errorCount++;
				showNotification('Warning', 'Password must be at least 8 characters', 'danger');
			}
		}
		if (model.RoleID === '') { errorCount++; showNotification('Warning', 'Role cannot be left blank', 'danger'); }
		if (confirmpassword === '' && model.ID === '') { errorCount++; showNotification('Warning', 'Confirm Password cannot be left blank', 'danger'); }
		if (model.PasswordHash !== confirmpassword && model.ID === '') { errorCount++; showNotification('Warning', 'Confirm Password didn\'t match', 'danger'); }
		if (errorCount > 0) return;
		let url = '/user/AddUser';
		if (model.ID !== '') url = '/user/UpdateUser';
		setIsLoading(true);
		let rs = await SendPostRequest(url, model);
		setIsLoading(false);
		if (CheckErrorResponse(rs) === false) return;
		showNotification('Congratulation', 'Updated successfully', 'success');
		setUsername('');
		setFirstname('');
		setLastname('');
		setPassword('');
		setConfirmpassword('');
		setAvatarData('');
		setAvatarPreview('');
		CloseUpdateUserModal();
		LoadListUser();
	}
	const LoadListUser = async () => {
		let rs = await SendGetRequest(`/user/GetListUser?page=${curentPage}&rowPerPage=${rowPerPage}`);
		if (CheckErrorResponse(rs) === false) return;
		setListData(rs.data.listData);
		setTotalPage(GetObjectProperty(rs.data, 'totalPage', 1));
	}
	const LoadListRole = async () => {
		let rs = await SendGetRequest('/role/LoadListAllRole');
		if (CheckErrorResponse(rs) === false) return;
		setListRole(rs.data);
		if (GetObjectProperty(rs.data[0], 'ID') !== '') {
			setRole(GetObjectProperty(rs.data[0], 'ID'));
		}
	}


	const OpenEditUserModal = async (e: any) => {
		const userId = $(e.target).closest('.dropup').data('id');
		$('.dropup').removeClass('open');
		$('.dropup').find('ul').css('display', 'none');
		let rs = await SendGetRequest('/user/GetUser?id=' + userId);
		if (CheckErrorResponse(rs) === false) return;
		setId(rs.data.ID);
		setUsername(rs.data.UserName);
		setFirstname(rs.data.FirstName);
		setLastname(rs.data.LastName);
		setRole(rs.data.RoleID);
		setAvatarPreview(CONSTANT.HOST_URL + rs.data.Avatar);
		setIsUpdateUserModalOpenState(true);
	}
	const AcceptDelete = async (e: any) => {
		let rs = await SendGetRequest('/user/DeleteUser?id=' + id);
		if (CheckErrorResponse(rs) === false) return;
		showNotification('Congratulation', GetObjectProperty(rs, 'message') === '' ? 'Deleted successfully' : GetObjectProperty(rs, 'message'), 'success');
		setId('');
		setIsConfirmDeleteModalOpen(false);
		LoadListUser();
	}
	const ConfirmDelete = (e: any) => {
		const deleteId = $(e.target).closest('.dropup').data('id');
		$('.dropup').removeClass('open');
		$('.dropup').find('ul').css('display', 'none');
		setId(deleteId);
		setIsConfirmDeleteModalOpen(true);
	}
	const CloseConfirmDelete = () => { setIsConfirmDeleteModalOpen(false); }

	const InitPage = async () => {
		LoadListRole();
		LoadListUser();
	}

	useEffect(() => {
		LoadListUser();
	}, [curentPage, rowPerPage]);

	useEffect(() => {
		InitPage();
	}, []);


	const RowPerPageChange = (e: any) => {
		let size = $(e.target).val();
		if (size !== '' && size !== undefined) {
			setRowPerPage(parseInt(size + '')); setCurentPage(1);
			LoadListUser();
		}

	}

	return (
		<PageWrapper title={systemMenu.settings.subMenu.userAccount.text}>
			<Page >
				<Card stretch={'full'} onClick={CloseAllDropup} >
					<CardHeader>

						<div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
							<div style={{width:120}}>{'Row per page'}</div>
							<Select ariaLabel={''}
								value={rowPerPage + ''}
								onChange={RowPerPageChange} >
								{
									CONSTANT.RowPerPage.map((item, index) => {
										return (<Option key={index} value={item}>{item + ''}</Option>)
									})

								}
							</Select>
						</div>
						<div>
							<Button isLight title='Add new' icon='Add' isOutline color='success' onClick={OpenUpdateUserModal}>Add new</Button>
						</div>

					</CardHeader>
					<CardBody isScrollable className='table-responsive'>
						<table className='table table-modern table-hover'>
							<thead>
								<tr>
									<th style={{ width: 60 }}>No</th>
									<th style={{ width: 60 }}></th>
									<th style={{ width: 150 }}>Avatar</th>
									<th>Username</th>
									<th>First name</th>
									<th>Last name</th>
									<th style={{ width: 120 }}>Role name</th>
								</tr>
							</thead>
							<tbody>
								{
									listData.map((item, index) => {
										return (
											<tr key={index}>
												<td>{((curentPage - 1) * rowPerPage + index + 1)}</td>
												<td>
													<div className="dropup" data-id={item.ID} >
														<button type="button" className="btn " aria-expanded="true" onClick={ToggleDropdown}><i className="fa-solid fa-bars"></i></button>
														<ul style={{ zIndex: 5, position: 'absolute', display: 'none', flexDirection: 'column', backgroundColor: '#dbddd8', padding: 0, margin: 0, borderRadius: 10, borderWidth: .5, borderColor: '#00000020 !important' }}>
															<li><Button style={{ width: 80 }} onClick={OpenEditUserModal}>Edit</Button></li>
															<li><Button style={{ width: 80 }} onClick={ConfirmDelete}>Delete</Button></li>
														</ul>
													</div>
												</td>
												<td>
													<img src={CONSTANT.HOST_URL + item.Avatar} style={{ width: 60, height: 60, borderRadius: 7, objectFit: 'cover' }} />
												</td>
												<td>{item.UserName}</td>
												<td>{item.FirstName}</td>
												<td>{item.LastName}</td>
												<td>{item.RoleName}</td>
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
				isOpen={isUpdateUserModalOpen} // Example: state
				setIsOpen={CloseUpdateUserModal} // Example: setState
				isStaticBackdrop={true}
				isScrollable={true}
				isCentered={true}
				size={'lg'} // 'sm' || 'lg' || 'xl' 
				fullScreen={'md'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
				isAnimation={true}>
				<ModalHeader
					setIsOpen={CloseUpdateUserModal} // Example: setState
				>
					<ModalTitle id={'UpdateUserModalTitle'}>Update User</ModalTitle>
				</ModalHeader>
				<ModalBody >
					<div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'username'}>Username (*)</Label>
							<Input style={innerStyle.FormItemInput} value={username} onChange={UsernameOnChange} autoComplete={'false'} id='username' />
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'first-name'}>First name (*)</Label>
							<Input style={innerStyle.FormItemInput} value={firstname} onChange={FirstnameOnChange} id='first-name' />
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'last-name'}>Last name (*)</Label>
							<Input style={innerStyle.FormItemInput} value={lastname} onChange={LastnameOnChange} autoComplete={'false'} id='last-name' />
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'role'}>Role (*)</Label>
							<Select
								style={innerStyle.FormItemInput}
								id={'role'}
								ariaLabel={'role'}
								list={listRole}
								value={role}
								onChange={RoleOnChange}
							>
								{
									listRole.map((item, index) => {
										return (
											<Option key={index} value={item.ID}>{item.RoleName}</Option>
										);
									})
								}
							</Select>
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'username'}>Password (*)</Label>
							<Input style={innerStyle.FormItemInput} value={password} onChange={PasswordOnChange} type='password' id='password' />
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'username'}>Confirm password (*)</Label>
							<Input style={innerStyle.FormItemInput} value={confirmpassword} onChange={ConfirmPasswordOnChange} type='password' id='confirm-password' />
						</div>

						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'avatar'}>Avatar</Label>
							<input type={'hidden'} id={'avatar-base-64'} value={avatarData} />
							<input type={'file'} accept={'image/*'} id={'avatar'} style={{ display: 'none' }} onChange={AvatarOnChange} />
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<img style={{ width: 90, height: 90, objectFit: 'cover', cursor: 'pointer' }} src={avatarPreview === '' ? DEFAULT_NO_IMAGE : avatarPreview} id={'avatar-preview'} onClick={AvatarOpenFileChoose} />
								<span style={{ fontSize: 13, paddingTop: 5, fontStyle: 'italic', color: '#b8b8b8' }}>(Định dạng ảnh png, jpg,...)</span>
							</div>
						</div>
					</div>
				</ModalBody>
				<ModalFooter  >
					<Button isDisable={isLoading} isOutline color='success' onClick={SaveData}>Save</Button>
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
					<Button isDisable={isLoading} isOutline color='dark' onClick={CloseConfirmDelete} icon={'PowerSettingsNew'}>
						Close
					</Button>
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
	}
}
