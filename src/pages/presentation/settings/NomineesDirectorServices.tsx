import React, { useState, useEffect } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { settingsMenu } from '../../../menu';
import Button from '../../../components/bootstrap/Button';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import Select from '../../../components/bootstrap/forms/Select';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Option from '../../../components/bootstrap/Option';
import Card, { CardActions, CardBody, CardFooter, CardHeader, CardLabel } from '../../../components/bootstrap/Card';
import Popovers from '../../../components/bootstrap/Popovers';
import { CheckErrorResponse, CONSTANT, GetObjectProperty, SendGetRequest, SendPostRequest, ToggleDropdown, CloseAllDropup } from '../../../helpers/helpers';
import $ from 'jquery';
import showNotification from '../../../components/extras/showNotification';
const OnlyContent = () => {
	const [isUpdateModalOpen, setIsUpdateModalOpenState] = useState(false);
	const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [id, setId] = useState('');
	const [numberOfMonth, setNumberOfMonth] = useState('1');
	const [amount, setAmount] = useState('');
	const [listData, setListData] = useState<any[]>([]);
	const [totalPage, setTotalPage] = useState(1);
	const [curentPage, setCurentPage] = useState(1);
	const [rowPerPage, setRowPerPage] = useState(CONSTANT.RowPerPage[0]);

	const CloseUpdateModal = () => {
		setIsUpdateModalOpenState(false);
		setNumberOfMonth('1');
		setAmount('');
	}
	const OpenUpdateModal = async (e: any) => {
		const dataId = $(e.target).closest('.dropup').data('id');
		let rs = await SendGetRequest('/NomineesDirector/GetData?id=' + dataId);
		if (GetObjectProperty(rs, 'status') === CONSTANT.ResponseStatus.SUCCESS) {
			setId(rs.data.ID);
			setNumberOfMonth(rs.data.MonthNum);
			setAmount(rs.data.Amount);
			setIsUpdateModalOpenState(true);
		}

	}

	const AmountOnChange = (event: any) => {
		setAmount(event.target.value);
	}
	const NumberOfMonthOnChange = (event: any) => {
		setNumberOfMonth(event.target.value);
	}

	

	const SaveData = async () => {
		let model = {
			ID: id,
			MonthNum: numberOfMonth,
			Amount: amount
		};
		let errorCount = 0;
		if (model.Amount === '') {
			errorCount++;
			showNotification('Warning', 'Amount cannot be left blank', 'danger');
		} else {
			if (parseInt(model.Amount) <= 0) {
				errorCount++;
				showNotification('Warning', 'Amount cannot be less than 0', 'danger');
			}
		}
		if (model.MonthNum === '') {
			errorCount++;
			showNotification('Warning', 'Number of Month cannot be left blank', 'danger');
		}


		if (errorCount > 0) return;

		let rs = await SendPostRequest('/NomineesDirector/Update', model);
		if (CheckErrorResponse(rs) === false) return;
		LoadData();
		showNotification('Congratulation', 'Updated successfully', 'success');
		CloseUpdateModal();
	}
	const LoadData = async () => {
		let rs = await SendGetRequest(`/NomineesDirector/GetList?page=${curentPage}&rowPerPage=${rowPerPage}`);
		if (CheckErrorResponse(rs) === false) return;
		setTotalPage(GetObjectProperty(rs.data, 'totalPage', 1));
		setListData(rs.data.listData);
	}
	const RowPerPageChange = (e: any) => {
		let size = $(e.target).val();
		if (size !== '' && size !== undefined) {
			setRowPerPage(parseInt(size + ''));
			setCurentPage(1);
			LoadData();
		}

	}

	useEffect(() => {
		LoadData();
	}, [curentPage, rowPerPage]);
	return (
		<PageWrapper title={settingsMenu.settings.subMenu.nomineesDirectorServices.text}>
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

						</div>

					</CardHeader>
					<CardBody isScrollable className='table-responsive'>
						<table className='table table-modern table-hover'>
							<thead>
								<tr>
									<th style={{ width: 60 }}>No</th>
									<th style={{ width: 60 }}></th>
									<th>Number of month</th>
									<th>Amount</th>
								</tr>
							</thead>
							<tbody>
								{
									listData.length <= 0 ?
										<tr><td colSpan={4}>No data</td></tr>
										: (
											listData.map((item, index) => {
												return (
													<tr key={index}>
														<td>{((curentPage - 1) * rowPerPage + index + 1)}</td>
														<td>
															<div className="dropup" data-id={item.ID} >
																<button type="button" className="btn " aria-expanded="true" onClick={ToggleDropdown}><i className="fa-solid fa-bars"></i></button>
																<ul style={{ zIndex: 5, position: 'absolute', display: 'none', flexDirection: 'column', backgroundColor: '#dbddd8', padding: 0, margin: 0, borderRadius: 10, borderWidth: .5, borderColor: '#00000020 !important' }}>
																	<Button style={{ width: 80 }} onClick={OpenUpdateModal}>Edit</Button>
																</ul>
															</div>
														</td>
														<td>{item.MonthNum}</td>
														<td>{item.Amount}</td>
													</tr>
												);
											}))
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
				isOpen={isUpdateModalOpen} // Example: state
				setIsOpen={CloseUpdateModal} // Example: setState
				isStaticBackdrop={true}
				isScrollable={true}
				isCentered={true}
				size={'sm'} // 'sm' || 'lg' || 'xl' 
				fullScreen={'sm'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
				isAnimation={true}>
				<ModalHeader
					setIsOpen={CloseUpdateModal} // Example: setState
				>
					<ModalTitle id={'UpdateServiceModalTitle'}>Update Service</ModalTitle>
				</ModalHeader>
				<ModalBody >
					<div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'number-of-month'}>Number of month</Label>
							<Select id='number-of-month' ariaLabel='' value={numberOfMonth + ''} onChange={NumberOfMonthOnChange} disabled
								list={[{ value: 1, text: 1 }, { value: 2, text: 2 }, { value: 3, text: 3 }, { value: 4, text: 4 }, { value: 5, text: 5 }, { value: 6, text: 6 }, { value: 7, text: 7 }, { value: 8, text: 8 }, { value: 9, text: 9 }, { value: 10, text: 10 }, { value: 11, text: 11 }, { value: 12, text: 12 }]}
							/>

						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'amount'}>Amount</Label>
							<Input value={amount} id={'amount'} type={'number'} onChange={AmountOnChange} />
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
		width: 150
	},
	FormItemInput: {
		flex: 1
	}
}
