import React, { useState, useEffect } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { systemMenu } from '../../../menu';
import Button from '../../../components/bootstrap/Button';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import Select from '../../../components/bootstrap/forms/Select';
import Icon from '../../../components/icon/Icon';
import showNotification from '../../../components/extras/showNotification';
const DEFAULT_NO_IMAGE = require('../../../assets/img/thumb.jpg');
const OnlyContent = () => {
	const [isUpdateUserModalOpen, setIsUpdateUserModalOpenState] = useState(false);
	const [username, setUsername] = useState('');
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [role, setRole] = useState('2');
	const [password, setPassword] = useState('');
	const [confirmpassword, setConfirmpassword] = useState('');
	const [avatarData, setAvatarData] = useState('');
	const [avatarPreview, setAvatarPreview] = useState('');

	const [currentIndexRow, setCurrentIndexRow] = useState(1);

	const [listData, setListData] = useState<any[]>([]);
	const [totalPage, setTotalPage] = useState([1]);
	const [curentPage, setCurentPage] = useState(1);

	const UsernameOnChange = (obj: any) => { setUsername(obj.target.value); }
	const FirstnameOnChange = (obj: any) => { setFirstname(obj.target.value); }
	const LastnameOnChange = (obj: any) => { setLastname(obj.target.value); }
	const RoleOnChange = (obj: any) => { setRole(obj.target.value); }
	const PasswordOnChange = (obj: any) => { setPassword(obj.target.value); }
	const ConfirmPasswordOnChange = (obj: any) => { setConfirmpassword(obj.target.value); }

	const OpenUpdateUserModal = () => {
		setIsUpdateUserModalOpenState(true);
	}
	const CloseUpdateUserModal = () => {
		setIsUpdateUserModalOpenState(false);
		setUsername('');
		setFirstname('');
		setLastname('');
		setRole('2');
		setPassword('');
		setConfirmpassword('');
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
			No : currentIndexRow,
			Username : username,
			FirstName : firstname,
			LastName : lastname,
			Password: password,
			ConfirmPassword : confirmpassword,
			Role : role
		}

		let errorCount = 0;
		if(model.Username === '') { errorCount++; showNotification('Warning','Tên tài khoản không được để trống','danger'); }
		if(model.FirstName === '') { errorCount++; showNotification('Warning','Họ không được để trống','danger'); }
		if(model.LastName === '') { errorCount++; showNotification('Warning','Tên không được để trống','danger'); }
		if(model.Password === '') { errorCount++; showNotification('Warning','Mật khẩu không được để trống','danger'); }
		if(model.ConfirmPassword === '') { errorCount++; showNotification('Warning','Xác nhận mật khẩu không được để trống','danger'); }
		if(errorCount >0) return;

		listData.push(model);

		CloseUpdateUserModal();
		setCurrentIndexRow(currentIndexRow+1)
	}
	return (
		<PageWrapper title={systemMenu.settings.subMenu.userAccount.text}>
			<Page>
				<div className='user-account'>
					<div>
						<Button title='Add new' icon='Add' isOutline color='success' onClick={OpenUpdateUserModal}>Add new</Button>
					</div>
					<div className='list-data' style={{ paddingTop: 15 }}>
						<ul className='list-data-header'>
							<li>
								<div className='header-item'>
									<div style={{ width: 80 }}>No</div>
									<div style={{ width: 80 }}></div>
									<div style={{ width: 150 }}>Avatar</div>
									<div style={{ flex: 1 }}>Username</div>
									<div style={{ flex: 1 }}>First name</div>
									<div style={{ flex: 1 }}>Last name</div>
									<div style={{ width: 120 }}>Role</div>
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
											<div>
												<div className='no'>1</div>
												<div className='action'>
													<button className='btn' style={{ border: 'none' }}><Icon icon='Menu' color='danger' size={'lg'} /></button>
												</div>
												<div style={{ width: 150 }}>
													<img src={require('../../../assets/img/user-large.png')} style={{ width: 60, height: 60, borderRadius: 7, objectFit: 'cover' }} />
												</div>
												<div style={{ flex: 1 }}>Username</div>
												<div style={{ flex: 1 }}>First name</div>
												<div style={{ flex: 1 }}>Last name</div>
												<div style={{ width: 120 }}>Role</div>
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
				isOpen={isUpdateUserModalOpen} // Example: state
				setIsOpen={setIsUpdateUserModalOpenState} // Example: setState
				isStaticBackdrop={true}
				isScrollable={true}
				isCentered={true}
				size={'lg'} // 'sm' || 'lg' || 'xl' 
				fullScreen={'md'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
				isAnimation={true}>
				<ModalHeader
					setIsOpen={setIsUpdateUserModalOpenState} // Example: setState
				>
					<ModalTitle id={'UpdateUserModalTitle'}>Update User</ModalTitle>
				</ModalHeader>
				<ModalBody >
					<div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'username'}>Username</Label>
							<Input style={innerStyle.FormItemInput} value={username} onChange={UsernameOnChange} autoComplete={'false'} id='username' />
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'first-name'}>First name</Label>
							<Input style={innerStyle.FormItemInput} value={firstname} onChange={FirstnameOnChange} id='first-name' />
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'last-name'}>Last name</Label>
							<Input style={innerStyle.FormItemInput} value={lastname} onChange={LastnameOnChange} autoComplete={'false'} id='last-name' />
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'role'}>Role</Label>
							<Select

								style={innerStyle.FormItemInput}
								id={'role'}
								ariaLabel={'role'}
								list={[
									{ text: 'a', value: 1 },
									{ text: 'b', value: 2 },
									{ text: 'c', value: 3 },
								]}
								value={role}
								onChange={RoleOnChange}
							/>
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'username'}>Password</Label>
							<Input style={innerStyle.FormItemInput} value={password} onChange={PasswordOnChange} type='password' id='password' />
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'username'}>Confirm password</Label>
							<Input style={innerStyle.FormItemInput} value={confirmpassword} onChange={ConfirmPasswordOnChange} type='password' id='confirm-password' />
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
	}
}
