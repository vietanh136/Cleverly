import React, { useEffect, useState } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { settingsMenu } from '../../../menu';
import Card, { CardBody, CardFooter, CardHeader } from '../../../components/bootstrap/Card';
import Select from '../../../components/bootstrap/forms/Select';
import Option from '../../../components/bootstrap/Option';
import { CONSTANT, CloseAllDropup, GetObjectProperty, ToggleDropdown, NumberFormat, SendGetRequest, CheckErrorResponse, SendPostRequest } from '../../../helpers/helpers';
import Input from '../../../components/bootstrap/forms/Input';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import Label from '../../../components/bootstrap/forms/Label';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Button from '../../../components/bootstrap/Button';
import $ from 'jquery';
import showNotification from '../../../components/extras/showNotification';
const OnlyContent = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
	const [listServices, setListServices] = useState<any[]>([]);
	const [listCategory, setListCategory] = useState<any[]>([]);
	const [listServicesCategory, setListServicesCategory] = useState<any[]>([]);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

	const [id, setId] = useState('');
	const [categoryId, setCategoryId] = useState(0);
	const [requirement, setRequirement] = useState('');
	const [monthPrice, setMonthPrice] = useState('');
	const [yearPrice, setYearPrice] = useState('');

	const OpenUpdateModal = async (e: any) => {
		ToggleDropdown(e);
		const serviceid = $(e.target).closest('.dropup').data('id');
		if (serviceid !== '' && serviceid !== null && typeof serviceid !== 'undefined')
			await LoadService(serviceid);
		setIsUpdateModalOpen(true);
	}
	const CloseUpdateModal = () => {
		setIsUpdateModalOpen(false);
		setCategoryId(0);
		setRequirement('');
		setMonthPrice('');
		setYearPrice('');
		setId('');
	}

	const CloseConfirmDelete = () => { setIsConfirmDeleteModalOpen(false); }
	const CategoryOnChange = (e: any) => {
		setCategoryId(e.target.value);
	}
	const RequirementOnChange = (e: any) => {
		setRequirement(e.target.value);
	}
	const MonthPriceOnChange = (e: any) => {
		setMonthPrice(e.target.value);
	}
	const YearPriceOnChange = (e: any) => {
		setYearPrice(e.target.value);
	}
	const SaveData = async () => {
		setIsLoading(true);
		try {

			let model = {
				ID: id,
				CategoryID: categoryId,
				Requirement: requirement.trim(),
				MonthPrice: monthPrice.trim(),
				YearPrice: yearPrice.trim()
			}

			let errorCount = 0;
			if (model.CategoryID === 0) {
				showNotification('Warning', 'Please choose category', 'danger');
				errorCount++;
			}
			if (model.Requirement === '') {
				showNotification('Warning', 'Requirement cannot be left blank', 'danger');
				errorCount++;
			}
			if (model.MonthPrice === '') {
				showNotification('Warning', 'Monthly subscription cannot be left blank', 'danger');
				errorCount++;
			}
			if (model.YearPrice === '') {
				showNotification('Warning', 'Yearly subscription cannot be left blank', 'danger');
				errorCount++;
			}
			if (errorCount > 0) throw new Error();

			let url = '/AccountingService/InsertAccountingService';
			if (model.ID !== '') url = '/AccountingService/UpdateAccountingService';
			let rs = await SendPostRequest(url, model);
			if (!CheckErrorResponse(rs)) throw new Error();
			LoadListService();
			CloseUpdateModal();
			showNotification('Congratulation', 'Updated successfully', 'success');
		}
		catch (ex) {

		}
		setIsLoading(false);
	}



	const LoadService = async (serviceid: string) => {
		let rs = await SendGetRequest('/AccountingService/GetAccountingService?id=' + serviceid);
		if (!CheckErrorResponse(rs)) return;
		setId(GetObjectProperty(rs.data, 'ID'));
		setCategoryId(GetObjectProperty(rs.data, 'CategoryID', 0));
		setRequirement(GetObjectProperty(rs.data, 'Requirement'));
		setMonthPrice(GetObjectProperty(rs.data, 'MonthPrice'));
		setYearPrice(GetObjectProperty(rs.data, 'YearPrice'));
	}
	const LoadListService = async () => {
		let rs = await SendGetRequest('/AccountingService/GetListAccountingService');
		if (!CheckErrorResponse(rs)) return;
		setListServices(rs.data);
	}

	const ConfirmDelete = (e: any) => {
		const deleteId = $(e.target).closest('.dropup').data('id');
		setId(deleteId);
		setIsConfirmDeleteModalOpen(true);
	}

	const AcceptDelete = async () => {
		let rs = await SendGetRequest('/AccountingService/DeleteAccountingService?id=' + id);
		if (CheckErrorResponse(rs) === false) return;
		LoadListService();
		showNotification('Congratulation', 'Deleted successfully', 'success');
		CloseConfirmDelete();
	}

	const InitPage = async () => {
		LoadListService();

		let rs = await SendGetRequest('/AccountingService/GetListCategoryNotCreated');
		if (GetObjectProperty(rs, 'status') === CONSTANT.ResponseStatus.SUCCESS) {
			setListCategory(rs.data);
		}
	}

	useEffect(() => {
		InitPage();
	}, [])

	return (
		<PageWrapper title={settingsMenu.settings.subMenu.accountantServices.text}>
			<Page>
				<Card stretch={'full'} onClick={CloseAllDropup}>
					<CardHeader>

						<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

						</div>
						<div>
							<Button isLight title='Add new' icon='Add' isOutline color='success' onClick={OpenUpdateModal}>Add new</Button>
						</div>

					</CardHeader>
					<CardBody isScrollable className='table-responsive'>
						<table className='table table-modern table-hover'>
							<thead>
								<tr>
									<th style={{ width: 60 }}>No</th>
									<th style={{ width: 60 }}></th>
									<th >Category</th>
									<th style={{ width: 150 }}>Monthly Subscription<br />(USD)</th>
									<th style={{ width: 150 }}>Yearly Subscription<br />(USD)</th>
								</tr>
							</thead>
							<tbody>
								{
									listServices.map((item, index) => {
										return (
											<tr key={index}>
												<td>{(index + 1)}</td>
												<td>
													<div className="dropup" data-id={item.ID} >
														<button type="button" className="btn " aria-expanded="true" onClick={ToggleDropdown}><i className="fa-solid fa-bars"></i></button>
														<ul style={{ listStyle:'none', zIndex: 5, position: 'absolute', display: 'none', flexDirection: 'column', backgroundColor: '#dbddd8', padding: 0, margin: 0, borderRadius: 10, borderWidth: .5, borderColor: '#00000020 !important' }}>
															{
																/*
																<li><Button style={{ width: 80 }} onClick={OpenUpdateModal}>Edit</Button></li>
																*/
															}
															<li><Button style={{ width: 80 }} onClick={ConfirmDelete}>Delete</Button></li>
														</ul>
													</div>
												</td>
												<td>{GetObjectProperty(item, 'Description')}</td>
												<td>{GetObjectProperty(item, 'MonthPrice') === 0 ? 'Contact us' : NumberFormat(GetObjectProperty(item, 'MonthPrice'))}</td>
												<td>{GetObjectProperty(item, 'YearPrice') === 0 ? 'Contact us' : NumberFormat(GetObjectProperty(item, 'YearPrice'))}</td>
											</tr>
										);
									})
								}
							</tbody>
						</table>
					</CardBody>
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
					<ModalTitle id={'UpdateServiceModalTitle'}>Update Service</ModalTitle>
				</ModalHeader>
				<ModalBody >
					<div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} >Category</Label>
							<Select value={categoryId + ''} onChange={CategoryOnChange} ariaLabel={''} style={{ flex: 1 }}>
								<Option value={0}>{'Please choose category'}</Option>
								{
									listCategory.map((item, index) => {
										return (<Option key={index} value={item.ID}>{item.Description}</Option>)
									})
								}
							</Select>
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel}>Requirement</Label>
							<Textarea value={requirement} style={{ flex: 1 }} onChange={RequirementOnChange}></Textarea>
						</div>

						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} >Monthly subscription</Label>
							<div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
								<Input value={monthPrice} onChange={MonthPriceOnChange} type='number'/>
								<span>(Contact us : set value is 0)</span>
							</div>

						</div>

						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} >Yearly subscription</Label>
							<div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
								<Input value={yearPrice} onChange={YearPriceOnChange} type='number' />
								<span>(Contact us : set value is 0)</span>
							</div>

						</div>

					</div>


				</ModalBody>
				<ModalFooter  >
					<Button isOutline color='success' isDisable={isLoading} onClick={SaveData}>Save</Button>
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
	},

	DataItemAvatar: { width: 150 },
	DataItemAvatarImg: { width: 60, height: 60, borderRadius: 7, objectFit: 'cover' },
	DataItemServiceName: { flex: 1 },

}