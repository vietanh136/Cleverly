import React, { useState, useEffect, useCallback } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { systemMenu } from '../../../menu';
import Button from '../../../components/bootstrap/Button';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import Select from '../../../components/bootstrap/forms/Select';
import Option from '../../../components/bootstrap/Option';
import Popovers from '../../../components/bootstrap/Popovers';
import { CheckErrorResponse, CONSTANT, GetObjectProperty, SendGetRequest, SendPostRequest, ToggleDropdown, CloseAllDropup } from '../../../helpers/helpers';
import showNotification from '../../../components/extras/showNotification';
import $ from 'jquery';
import Card, { CardActions, CardBody, CardFooter, CardHeader, CardLabel } from '../../../components/bootstrap/Card';
const OnlyContent = () => {
	const [isUpdateRoleModalOpen, setIsUpdateRoleModalOpenState] = useState(false);
	const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
	const [listRole, setListRole] = useState<any[]>([]);
	const [totalPage, setTotalPage] = useState(1);
	const [curentPage, setCurentPage] = useState(1);
	const [rowPerPage, setRowPerPage] = useState(CONSTANT.RowPerPage[0]);
	const [isLoading, setIsLoading] = useState(false);
	const [roleName, setRoleName] = useState('');
	const [id, setId] = useState('');
	const OpenUpdateRoleModal = () => {
		setIsUpdateRoleModalOpenState(true);
	}

	const RoleNameOnChange = (obj: any) => { setRoleName(obj.target.value); }
	const LoadListRole = async () => {
		let rs = await SendGetRequest(`/role/LoadListRole?page=${curentPage}&rowPerPage=${rowPerPage}`);
		if (CheckErrorResponse(rs) === false) return;
		setListRole(rs.data.listData);
		setTotalPage(GetObjectProperty(rs.data, 'totalPage', 1));
	}
	const SaveData = async () => {
		let model = {
			ID: id,
			RoleName: roleName,
		}

		let errorCount = 0;
		if (GetObjectProperty(model, 'RoleName') === '') { errorCount++; showNotification('Warning', 'Role name cannot be left blank', 'danger'); }
		if (errorCount > 0) return;
		let url = '/role/InsertRole';
		if (GetObjectProperty(model, 'ID') !== '') url = '/role/UpdateRole';

		let rs = await SendPostRequest(url, model);

		if (CheckErrorResponse(rs) === false) return;
		showNotification('Congratulation', 'Updated successfully', 'success');
		setIsUpdateRoleModalOpenState(false);
		setRoleName('');
		setId('');
		LoadListRole();
	}

	const OpenEditRoleModal = async (e: any) => {
		const roldeId = $(e.target).closest('.dropup').data('id');
		$('.dropup').removeClass('open');
		$('.dropup').find('ul').css('display', 'none');
		let rs = await SendGetRequest('/role/LoadRole?id=' + roldeId);
		if (CheckErrorResponse(rs) === false) return;
		setRoleName(rs.data.RoleName);
		setId(rs.data.ID);
		setIsUpdateRoleModalOpenState(true);
	}
	const AcceptDelete = async (e: any) => {
		let rs = await SendGetRequest('/role/DeleteRole?id=' + id);
		if (CheckErrorResponse(rs) === false) return;
		showNotification('Congratulation','Deleted successfully','success');
		LoadListRole();
		setId('');
		setIsConfirmDeleteModalOpen(false);
	}
	const ConfirmDelete = (e: any) => {
		const deleteId = $(e.target).closest('.dropup').data('id');
		$('.dropup').removeClass('open');
		$('.dropup').find('ul').css('display', 'none');
		setId(deleteId);
		setIsConfirmDeleteModalOpen(true);
	}
	const CloseConfirmDelete = () => { 
		setId('');
		setIsConfirmDeleteModalOpen(false); 
	}

	const InitPage = async () => {
		LoadListRole();
	}

	const RowPerPageChange = (e: any) => {
		let size = $(e.target).val();
		if (size !== '' && size !== undefined) {
			setRowPerPage(parseInt(size + '')); setCurentPage(1);
			LoadListRole();
		}

	}
	
	useEffect(() => {
		InitPage();
	}, [curentPage])
	return (
		<PageWrapper title={systemMenu.settings.subMenu.roles.text}>
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
										return (<Option key={index} value={item}>{item + ''}</Option>)
									})

								}
							</Select>
						</div>
						<div>
							<Button title='Add new' icon='Add' isLight isOutline color='success' onClick={OpenUpdateRoleModal}>Add new</Button>
						</div>

					</CardHeader>
					<CardBody isScrollable className='table-responsive'>
						<table className='table table-modern table-hover'>
							<thead>
								<tr>
									<th style={{ width: 60 }}>No</th>
									<th style={{ width: 60 }}></th>
									<th>Role name</th>
								</tr>
							</thead>
							<tbody>
								{
									listRole.map((item, index) => {
										return (
											<tr key={index}>
												<td>{((curentPage - 1) * CONSTANT.NUMBER.ROW_PER_PAGE + index + 1)}</td>
												<td>
													<div className="dropup" data-id={item.ID} >
														<button type="button" className="btn " aria-expanded="true" onClick={ToggleDropdown}><i className="fa-solid fa-bars"></i></button>
														<ul style={{ zIndex: 5, position: 'absolute', display: 'none', flexDirection: 'column', backgroundColor: '#dbddd8', padding: 0, margin: 0, borderRadius: 10, borderWidth: .5, borderColor: '#00000020 !important' }}>
															<Button style={{ width: 80 }} onClick={OpenEditRoleModal}>Edit</Button>
															<Button style={{ width: 80 }} onClick={ConfirmDelete}>Delete</Button>
														</ul>
													</div>

												</td>
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
				isOpen={isUpdateRoleModalOpen} // Example: state
				setIsOpen={setIsUpdateRoleModalOpenState} // Example: setState
				isStaticBackdrop={true}
				isScrollable={true}
				isCentered={true}
				size={'lg'} // 'sm' || 'lg' || 'xl' 
				fullScreen={'md'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
				isAnimation={true}>
				<ModalHeader
					setIsOpen={setIsUpdateRoleModalOpenState} // Example: setState
				>
					<ModalTitle id={'UpdateRoleModalTitle'}>Update Role</ModalTitle>
				</ModalHeader>
				<ModalBody >
					<div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'role-name'}>Role name</Label>
							<Input style={innerStyle.FormItemInput} value={roleName} onChange={RoleNameOnChange} autoComplete={'false'} id='role-name' />
						</div>
					</div>


				</ModalBody>
				<ModalFooter  >
					<Button isOutline color='success' onClick={SaveData}>Save</Button>
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
