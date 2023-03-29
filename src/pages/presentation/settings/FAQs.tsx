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
import Checks from '../../../components/bootstrap/forms/Checks';
import Card, { CardActions, CardBody, CardFooter, CardHeader, CardLabel } from '../../../components/bootstrap/Card';
import Popovers from '../../../components/bootstrap/Popovers';
import { CheckErrorResponse, CONSTANT, GetObjectProperty, SendGetRequest, SendPostRequest, ToggleDropdown, CloseAllDropup } from '../../../helpers/helpers';
import $ from 'jquery';
import Select from '../../../components/bootstrap/forms/Select';
import Option from '../../../components/bootstrap/Option';
const DEFAULT_NO_IMAGE = require('../../../assets/img/thumb.jpg');
const OnlyContent = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
	const [listData, setListData] = useState<any[]>([]);
	const [totalPage, setTotalPage] = useState(1);
	const [curentPage, setCurentPage] = useState(1);
	const [rowPerPage, setRowPerPage] = useState(CONSTANT.RowPerPage[0]);

	const [avatarData, setAvatarData] = useState('');
	const [avatarPreview, setAvatarPreview] = useState('');

	const [id, setId] = useState('');
	const [question, setQuestion] = useState('');
	const [answer, setAnswer] = useState('');
	const [formFill, setFormFill] = useState('');
	const [processingTime, setProcessingTime] = useState('');
	const [payment, setPayment] = useState('');

	const [description, setDescription] = useState('');
	const [stepDescription, setStepDescription] = useState('');
	const [stepNote, setStepNote] = useState('');

	const [listDescription, setListDescription] = useState<any[]>([]);
	const [listDescriptionStep, setListDescriptionStep] = useState<any[]>([]);

	const [listDescriptionDelete, setListDescriptionDelete] = useState<string[]>([]);
	const [listDescriptionStepDelete, setListDescriptionStepDelete] = useState<string[]>([]);

	const AvatarOnChange = (event: any) => {
		const reader = new FileReader();
		reader.onloadend = function (rs: any) {
			setAvatarPreview(rs?.currentTarget?.result);
			const basr64Data = rs?.currentTarget?.result.split('base64,');
			setAvatarData(basr64Data[1]);
		}
		reader.readAsDataURL(event.target.files[0]);
	}
	const AvatarOpenFileChoose = () => { document.getElementById('avatar')?.click(); }

	const QuestionOnChange = (obj: any) => { 
		//if (/[^a-zA-Z0-9\b.!$%^&*()\-_,]/.test(obj.target.value)) return;
		setQuestion(obj.target.value); 
	}
	const AnswerOnChange = (obj: any) => { 
		//if (/[^a-zA-Z0-9\b.!$%^&*()\-_,]/.test(obj.target.value)) return;
		setAnswer(obj.target.value); 
	}
	const FormFillOnChange = (obj: any) => {
		// if (/[^a-zA-Z0-9\b.!$%^&*()\-_,]/.test(obj.target.value)) return;
	setFormFill(obj.target.value);
}
	const ProcessingTimeOnChange = (obj: any) => { 
		//if (/[^a-zA-Z0-9\b.!$%^&*()\-_,]/.test(obj.target.value)) return;
		setProcessingTime(obj.target.value); 
	}
	const PaymentOnChange = (obj: any) => { setPayment(obj.target.value); }
	const DescriptionOnChange = (obj: any) => { 
	//if (/[^a-zA-Z0-9\b.!$%^&*()\-_,]/.test(obj.target.value)) return;
		setDescription(obj.target.value); 
	}
	const StepDescriptionOnChange = (obj: any) => {
		// if (/[^a-zA-Z0-9\b.!$%^&*()\-_,]/.test(obj.target.value)) return;
	setStepDescription(obj.target.value);
 }
	const StepNoteOnChange = (obj: any) => {
		//if (/[^a-zA-Z0-9\b.!$%^&*()\-_,]/.test(obj.target.value)) return;
		setStepNote(obj.target.value);
	 }

	const AddDescription = () => {
		let model = {
			Description: description.trim()
		}
		let errorCount = 0;
		if (model.Description === '') { errorCount++; showNotification('Warning', 'Description cannot be null', 'danger'); }
		if (errorCount > 0) return;
		listDescription.push(model);
		setDescription('');
		$('#description-1').focus();
	}

	const AddStepDescription = () => {
		let model = {
			Description: stepDescription.trim(),
			Note: stepNote.trim()
		}
		let errorCount = 0;
		if (model.Description === '') { errorCount++; showNotification('Warning', 'Description cannot be null', 'danger'); }
		if (errorCount > 0) return;
		listDescriptionStep.push(model);
		setStepDescription('');
		setStepNote('');
		$('#description-2').focus();
	}


	const OpenUpdateModal = () => {  setIsUpdateModalOpen(true); setTimeout(() => {
		$('#question').focus();
	}, 100); }
	const CloseUpdateModal = () => {
		setId('');
		setQuestion('');
		setAvatarData('');
		setAvatarPreview('');
		setAnswer('');
		setFormFill('');
		setProcessingTime('');
		setPayment('');
		setListDescription([]);
		setListDescriptionStep([]);
		setListDescriptionDelete([]);
		setListDescriptionStepDelete([]);
		setIsUpdateModalOpen(false);
	}
	const OpenEditModal = async (e: any) => {
		const questionId = $(e.target).closest('.dropup').data('id');
		$('.dropup').removeClass('open');
		$('.dropup').find('ul').css('display', 'none');
		let rs = await SendGetRequest('/FrequentlyAskedQuestions/GetQuestion?id=' + questionId);
		if (CheckErrorResponse(rs) === false) return;

		setId(rs.data.question.ID);
		setAvatarPreview(CONSTANT.HOST_URL + rs.data.question.Icon);
		setQuestion(rs.data.question.Question);
		setAnswer(rs.data.question.Answer);
		setFormFill(rs.data.question.FormFill);
		setProcessingTime(rs.data.question.ProcessTime);
		setPayment(rs.data.question.Payment + '');
		setListDescription(rs.data.listWhatNeed);
		setListDescriptionStep(rs.data.listSteps);
		OpenUpdateModal();
	}


	const AcceptDelete = async (e: any) => {
		let rs = await SendGetRequest('/FrequentlyAskedQuestions/DeleteQuestion?id=' + id);
		if (CheckErrorResponse(rs) === false) return;
		showNotification('Congratulation', 'Deleted successfully', 'success');
		CloseConfirmDelete()
		LoadListData();
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

	const DeleteStep = (stepId: string, index: number) => {
		let listTmp = listDescriptionStep;
		listTmp.splice(index, 1)
		setListDescriptionStep([...listTmp]);

		if (stepId !== '') {
			let listDescriptionStepDeleteTmp = listDescriptionStepDelete;
			listDescriptionStepDeleteTmp.push(stepId);
			setListDescriptionStepDelete([...listDescriptionStepDeleteTmp]);
		}
	}

	const DeleteNeedDo = (needDoId: string, index: number) => {
		let listTmp = listDescription;
		listTmp.splice(index, 1)
		setListDescription([...listTmp]);

		if (needDoId !== '') {
			let listDescriptionDeleteTmp = listDescriptionDelete;
			listDescriptionDeleteTmp.push(needDoId);
			setListDescriptionDelete([...listDescriptionDeleteTmp]);
		}
	}

	const SaveData = async () => {
		let model = {
			ID: id,
			Question: question.trim(),
			Answer: answer.trim(),
			FormFill: formFill.trim(),
			ProcessTime: processingTime.trim(),
			Payment: payment.trim(),
			Icon: avatarData.trim(),
			ListSteps: listDescriptionStep,
			ListWhatNeed: listDescription,
			ListStepsDelete: listDescriptionStepDelete,
			ListWhatNeedDelete: listDescriptionDelete
		}
		let errorCount = 0;
		if (model.Question === '') {
			errorCount++;
			showNotification('Warning', 'Question cannot be left blank', 'danger');
		}
		if (model.Answer === '') {
			errorCount++;
			showNotification('Warning', 'Answer cannot be left blank', 'danger');
		}
		if (model.FormFill === '') {
			errorCount++;
			showNotification('Warning', 'Form fill cannot be left blank', 'danger');
		}
		if (model.ProcessTime === '') {
			errorCount++;
			showNotification('Warning', 'Processing Time cannot be left blank', 'danger');
		}
		if (model.Payment === '') {
			errorCount++;
			showNotification('Warning', 'Payment cannot be left blank', 'danger');
		}


		if (errorCount > 0) return;
		let url = '/FrequentlyAskedQuestions/CreateQuestion';
		if (model.ID !== '') url = '/FrequentlyAskedQuestions/UpdateQuestion';
		setIsLoading(true);
		let rs = await SendPostRequest(url, model);
		setIsLoading(false);
		if (CheckErrorResponse(rs) === false) return;
		showNotification('Congratulation', 'Updated successfully', 'success');
		LoadListData();
		setId('');
		setQuestion('');
		setAvatarData('');
		setAvatarPreview('');
		setAnswer('');
		setFormFill('');
		setProcessingTime('');
		setPayment('');
		setListDescription([]);
		setListDescriptionStep([]);
		setListDescriptionDelete([]);
		setListDescriptionStepDelete([]);
	}
	const LoadListData = async () => {
		let rs = await SendGetRequest(`/FrequentlyAskedQuestions/GetListQuestion?page=${curentPage}&rowPerPage=${rowPerPage}`);
		if (CheckErrorResponse(rs) === false) return;	
		setTotalPage(GetObjectProperty(rs.data, 'totalPage', 1));
		setListData(rs.data.listData);
	}

	const RowPerPageChange = (e: any) => {
		let size = $(e.target).val();
		if (size !== '' && size !== undefined) {
			setRowPerPage(parseInt(size + '')); setCurentPage(1);
			LoadListData();
		}

	}
	useEffect(() => {
		LoadListData();
	}, [curentPage,rowPerPage]);
	return (
		<PageWrapper title={settingsMenu.settings.subMenu.faqs.text}>
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
							<Button title='Add new' icon='Add' isLight isOutline color='success' onClick={OpenUpdateModal}>Add new</Button>
						</div>

				
					</CardHeader>
					<CardBody isScrollable className='table-responsive'>
						<table className='table table-modern table-hover'>
							<thead>
								<tr>
									<th style={{ width: 60 }}>No</th>
									<th style={{ width: 60 }}></th>
									<th>Avatar</th>
									<th>Question</th>
								</tr>
							</thead>
							<tbody>
								{
									listData.length <= 0 ?
										<tr>
											<td colSpan={4}>No data</td>
										</tr> :
										(listData.map((item, index) => {
											return (
												<tr key={index}>
													<td>{((curentPage - 1) * rowPerPage + index + 1)}</td>
													<td>			
														<div className="dropup" data-id={item.ID} >
															<button type="button" className="btn " aria-expanded="true" onClick={ToggleDropdown}><i className="fa-solid fa-bars"></i></button>
															<ul style={{ zIndex: 5, position: 'absolute', display: 'none', flexDirection: 'column', backgroundColor: '#dbddd8', padding: 0, margin: 0, borderRadius: 10, borderWidth: .5, borderColor: '#00000020 !important' }}>
																<Button style={{ width: 80 }} onClick={OpenEditModal}>Edit</Button>
																<Button style={{ width: 80 }} onClick={ConfirmDelete}>Delete</Button>
															</ul>
														</div>
													</td>
													<td><img src={CONSTANT.HOST_URL + item.Icon} style={{ width: 60, height: 60, objectFit: 'cover' }} /></td>
													<td>{item.Question}</td>
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
				size={'lg'} // 'sm' || 'lg' || 'xl' 
				fullScreen={'md'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
				isAnimation={true}>
				<ModalHeader
					setIsOpen={CloseUpdateModal} // Example: setState
				>
					<ModalTitle id={'UpdateServiceModalTitle'}>Update FAQ</ModalTitle>
				</ModalHeader>
				<ModalBody >
					<div className='faqs-update-form'>
						<div>
							<div>Question</div>
							<Textarea style={{ resize: 'none' }} rows={4} value={question} onChange={QuestionOnChange} id={'question'}/>
						</div>

						<div style={{ flexDirection: 'row', gap: 15 }}>
							<div style={{ width: 90 }}>
								<div>Avatar</div>
								<input type={'hidden'} id={'avatar-base-64'} value={avatarData} />
								<input type={'file'} accept={'image/*'} id={'avatar'} style={{ display: 'none' }} onChange={AvatarOnChange} />
								<div style={{ display: 'flex', flexDirection: 'column' }}>
									<img style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 7 , cursor: 'pointer' }} src={avatarPreview === '' ? DEFAULT_NO_IMAGE : avatarPreview} id={'avatar-preview'} onClick={AvatarOpenFileChoose} />
									<span style={{ fontSize: 13, paddingTop: 5, fontStyle: 'italic', color: '#b8b8b8' }}>(Định dạng ảnh png, jpg,...)</span>
								</div>
							</div>

							<div style={{ flex: 1 }}>
								<div>Form fill</div>
								<Textarea style={{ resize: 'none' }} rows={4} value={formFill} onChange={FormFillOnChange} />
							</div>

							<div style={{ flex: 1 }}>
								<div>Processing time</div>
								<Textarea style={{ resize: 'none' }} rows={4} value={processingTime} onChange={ProcessingTimeOnChange} />
							</div>
						</div>

						<div style={{ flexDirection: 'row', gap: 15 }}>
							<div>Payment</div>
							<div style={{ display: 'flex', flexDirection: 'row', gap: 15 }}>
								<Checks
									checked={payment}
									label={'Free'}
									name={'payment'}
									type="radio"
									value={'0'}
									onChange={PaymentOnChange}
								/>
								<Checks
									checked={payment}
									label={'Condition'}
									name={'payment'}
									type="radio"
									value={'1'}
									onChange={PaymentOnChange}
								/>
							</div>
						</div>

						<div>
							<div>Answer</div>
							<Textarea value={answer} onChange={AnswerOnChange} style={{ resize: 'none' }} rows={4} />
						</div>

						<div style={{ gap: 7 }}>
							<div style={{ color: '#6c5dd3' }}>What do I need?</div>
							<Input placeholder='Description' id='description-1' value={description} onChange={DescriptionOnChange} />
							<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
								<Button color='primary' onClick={AddDescription}>Add</Button>
							</div>

							<div>
								<table className='table'>
									<thead>
										<tr>
											<th style={{ width: 60 }}>No</th>
											<th style={{ width: 60 }}></th>
											<th>What do I need?</th>
										</tr>
									</thead>
									<tbody>
										{
											listDescription.map((item, index) => {
												return (<tr key={index}>
													<td>{index + 1}</td>
													<td data-id={item.ID}>
														<button className='btn' style={{ border: 'none' }} onClick={() => { DeleteNeedDo(item.ID, index) }}><Icon icon='Close' color='danger' size={'lg'} /></button>
													</td>
													<td>
														<div>{item.Description}</div>
													</td>
												</tr>);
											})
										}
									</tbody>
								</table>
							</div>
						</div>

						<div style={{ gap: 7 }}>
							<div style={{ color: '#6c5dd3' }}>Steps</div>
							<Input placeholder='Description' id='description-2' value={stepDescription} onChange={StepDescriptionOnChange} />
							<Input placeholder='Note' value={stepNote} onChange={StepNoteOnChange} />
							<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
								<Button color='primary' onClick={AddStepDescription}>Add</Button>
							</div>

							<div>
								<table className='table'>
									<thead>
										<tr>
											<th style={{ width: 60 }}>No</th>
											<th style={{ width: 60 }}></th>
											<th>Description</th>
										</tr>
									</thead>
									<tbody>
										{
											listDescriptionStep.map((item, index) => {
												return (<tr key={index}>
													<td>{index + 1}</td>
													<td data-id={item.ID}>
														<button className='btn' style={{ border: 'none' }} onClick={() => { DeleteStep(item.ID, index) }}><Icon icon='Close' color='danger' size={'lg'} /></button>
													</td>
													<td>
														<div>
															<div>{item.Description}</div>
															<div style={{ fontStyle: 'italic', color: '#c4c4c4' }}>{item.Note}</div>
														</div>
													</td>
												</tr>);
											})
										}
									</tbody>
								</table>
							</div>
						</div>

					</div>


				</ModalBody>
				<ModalFooter  >
					<Button isLight isDisable={isLoading} isOutline color='success' onClick={SaveData}>Save</Button>
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
	DataQuestion: {}
}
