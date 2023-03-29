import React, { useState, useEffect } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { settingsMenu } from '../../../menu';
import Button from '../../../components/bootstrap/Button';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import Checks from '../../../components/bootstrap/forms/Checks';
import Icon from '../../../components/icon/Icon';
import Select from '../../../components/bootstrap/forms/Select';
import Option from '../../../components/bootstrap/Option';
import Card, { CardBody, CardFooter, CardHeader } from '../../../components/bootstrap/Card';
import Popovers from '../../../components/bootstrap/Popovers';
import { CheckErrorResponse, CONSTANT, SendGetRequest, SendPostRequest, ToggleDropdown, CloseAllDropup, GetObjectProperty } from '../../../helpers/helpers';
import showNotification from '../../../components/extras/showNotification';
import $ from 'jquery';
const OnlyContent = () => {
	const [isUpdateModalOpen, setIsUpdateModalOpenState] = useState(false);
	const [pauseProcess, setPauseProcess] = useState(false);
	const [fieldCode, setFieldCode] = useState('');
	const [fieldNameVN, setFieldNameVN] = useState('');
	const [fieldNameEN, setFieldNameEN] = useState('');


	const [listData, setListData] = useState<any[]>([]);
	const [totalPage, setTotalPage] = useState(1);
	const [curentPage, setCurentPage] = useState(1);
	const [rowPerPage, setRowPerPage] = useState(CONSTANT.RowPerPage[0]);


	const RowPerPageChange = (e: any) => {
		let size = $(e.target).val();
		if (size !== '' && size !== undefined) {
			setRowPerPage(parseInt(size + '')); setCurentPage(1);
			LoadData();
		}

	}

	const CloseUpdateModal = () => {
		setIsUpdateModalOpenState(false);
		setPauseProcess(false);
		setFieldCode('');
		setFieldNameVN('');
		setFieldNameEN('');
	}
	const OpenUpdateModal = async (e: any) => {
		const id = $(e.target).closest('.dropup').data('id');
		$('.dropup').removeClass('open');
		$('.dropup').find('ul').css('display', 'none');
		let rs = await SendGetRequest('/Fields/GetField?id=' + id);
		if (CheckErrorResponse(rs) === false) return;
		setPauseProcess(rs.data.IsPause === '1');
		setFieldCode(rs.data.ID);
		setFieldNameVN(rs.data.FieldName);
		setFieldNameEN(rs.data.FieldNameEN);
		setIsUpdateModalOpenState(true);
		setTimeout(() => {
			$('#field-name-eng').focus();
		}, 100);
	}

	const FieldNameEnOnChange = (event: any) => { setFieldNameEN(event.target.value); }
	const PauseProcessOnChange = (event: any) => { setPauseProcess(event.target.checked); }
	const SaveData = async () => {
		let model = {
			ID: fieldCode,
			FieldNameEN: fieldNameEN,
			IsPause: pauseProcess ? 1 : 0
		};
		if (model.FieldNameEN === '') {
			showNotification('Warning', 'Field Name (ENG) cannot be left blank', 'danger');
			return;
		}
		let rs = await SendPostRequest('/Fields/Update', model);
		if (CheckErrorResponse(rs) === false) return;
		showNotification('Congratulation', 'Updated successfully', 'success');
		LoadData();
		CloseUpdateModal();
	}
	const LoadData = async () => {
		let rs = await SendGetRequest(`/Fields/GetList?page=${curentPage}&rowPerPage=${rowPerPage}`);
		if (CheckErrorResponse(rs) === false) return;
		setListData(rs.data.listData);
		setTotalPage(GetObjectProperty(rs.data, 'totalPage', 1));
	}
	useEffect(() => {
		LoadData();
	}, [curentPage, rowPerPage]);
	return (
		<PageWrapper title={settingsMenu.settings.subMenu.fields.text}>
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
									<th>Field Code</th>
									<th>Field Name (VN)</th>
									<th>Field Name (ENG)</th>
								</tr>
							</thead>
							<tbody>
								{
									listData.length <= 0 ?
										<tr><td colSpan={5}>No data</td></tr>
										:
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
													<td>{item.ID}</td>
													<td>{item.FieldName}</td>
													<td>{item.FieldNameEN}</td>
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
				isOpen={isUpdateModalOpen} // Example: state
				setIsOpen={setIsUpdateModalOpenState} // Example: setState
				isStaticBackdrop={true}
				isScrollable={true}
				isCentered={true}
				size={'lg'} // 'sm' || 'lg' || 'xl' 
				fullScreen={'md'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
				isAnimation={true}>
				<ModalHeader
					setIsOpen={setIsUpdateModalOpenState} // Example: setState
				>
					<ModalTitle id={'UpdateRoleModalTitle'}>Update Field</ModalTitle>
				</ModalHeader>
				<ModalBody >
					<div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'field-code'}>Field code</Label>
							<Input style={innerStyle.FormItemInput} disabled value={fieldCode} autoComplete={'false'} id='field-code' />
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'field-name-vn'}>Field name (VN)</Label>
							<Input style={innerStyle.FormItemInput} disabled value={fieldNameVN} autoComplete={'false'} id='field-name-vn' />
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'field-name-eng'}>Field name (ENG)</Label>
							<Input style={innerStyle.FormItemInput} value={fieldNameEN} onChange={FieldNameEnOnChange} autoComplete={'false'} id='field-name-eng' />
						</div>
						{
							/*
							<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} ></Label>
							<Checks label='Pause process' checked={pauseProcess} onChange={PauseProcessOnChange} />
						</div>
							*/
						}
						

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
