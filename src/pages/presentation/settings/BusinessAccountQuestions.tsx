import React, { useState, useEffect } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { settingsMenu } from '../../../menu';
import Button from '../../../components/bootstrap/Button';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import Icon from '../../../components/icon/Icon';
import Card, { CardActions, CardBody, CardFooter, CardHeader, CardLabel } from '../../../components/bootstrap/Card';
import Popovers from '../../../components/bootstrap/Popovers';
import Select from '../../../components/bootstrap/forms/Select';
import Option from '../../../components/bootstrap/Option';
import { CheckErrorResponse, CONSTANT, GetObjectProperty, SendGetRequest, SendPostRequest, ToggleDropdown, CloseAllDropup } from '../../../helpers/helpers';
import showNotification from '../../../components/extras/showNotification';
import $ from 'jquery';
const OnlyContent = () => {
	const [isUpdateModalOpen, setIsUpdateModalOpenState] = useState(false);
	const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [id, setId] = useState('');
	const [question, setQuestion] = useState('');
	const [answer, setAnswer] = useState('');
	const [answerType, setAnswerType] = useState('1');
	const [listAnswers, setListAnswers] = useState<any[]>([]);
	const [listAnswersDelete, setListAnswersDelete] = useState<any[]>([]);


	const [listData, setListData] = useState<any[]>([]);
	const [totalPage, setTotalPage] = useState(1);
	const [curentPage, setCurrentPage] = useState(1);
	const [rowPerPage, setRowPerPage] = useState(CONSTANT.RowPerPage[0]);

	const CloseUpdateModal = () => {
		setIsUpdateModalOpenState(false);
		setAnswerType('1');
		setQuestion('');
		setAnswer('');
		setListAnswers([]);
		setId('');
	}
	const OpenUpdateModal = () => { setTimeout(() => {
		$('#question').focus();
	}, 100); setIsUpdateModalOpenState(true); }
	const QuestionOnChange = (event: any) => { setQuestion(event.target.value); }
	const AnswerOnChange = (event: any) => { setAnswer(event.target.value); }
	const AnswerTypeMultiple = () => { setAnswerType('1'); }
	const AnswerTypeOnlyOne = () => { setAnswerType('0'); }
	const AddAnswer = () => {
		if (answer === '') {
			showNotification('Warning', 'Answer cannot be left blank', 'danger');
			return;
		}
		let listAnswerTmp = listAnswers;
		listAnswerTmp.push({ ID: '', Answer: answer });
		setListAnswers(listAnswerTmp);
		setAnswer('');
		$('#answer').focus();
	}
	const DeleteAnswer = (answerId : any,answerIndex : any) => {
	
		let listAnswersTmp = listAnswers;
		listAnswersTmp.splice(answerIndex, 1)
		setListAnswers([...listAnswersTmp]);
	
		if (answerId !== '') {
			setListAnswersDelete([answerId,...listAnswersDelete]);
		}
	}

	const OpenEditModal = async (e: any) => {
		const questionId = $(e.target).closest('.dropup').data('id');
		$('.dropup').removeClass('open');
		$('.dropup').find('ul').css('display', 'none');
		let rs = await SendGetRequest('/BusinessAccountQuestions/GetQuestion?id=' + questionId);
		if (CheckErrorResponse(rs) === false) return;
		setId(rs.data.question.ID);
		setQuestion(rs.data.question.Question);
		setAnswerType(rs.data.question.Type + '');
		setListAnswers(rs.data.listAnswer);
		OpenUpdateModal();
	}
	const SaveData = async () => {
		let model = {
			ID: id,
			Question: question,
			Type: answerType,
			ListAnswer: listAnswers,
			ListAnswerDelete: listAnswersDelete
		};
		let errorCount = 0;
		if (model.Question === '') {
			showNotification('Warning', 'Question cannot be left blank', 'danger');
		}
		let url = '/BusinessAccountQuestions/CreateQuestion';
		if (model.ID !== '') url = '/BusinessAccountQuestions/UpdateCreateQuestion';
		if (errorCount > 0) return;
		let rs = await SendPostRequest(url, model);
		if (CheckErrorResponse(rs) === false) return;

		CloseUpdateModal();
		LoadData();
		showNotification('Congratulation', 'Updated successfully', 'success');
	}

	
	const AcceptDelete = async (e: any) => {
		let rs = await SendGetRequest('/BusinessAccountQuestions/DeleteQuestion?id=' + id);
		if (CheckErrorResponse(rs) === false) return;
		showNotification('Congratulation', 'Deleted successfully', 'success');
		CloseConfirmDelete()
		LoadData();
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

	const LoadData = async () => {
		let rs = await SendGetRequest(`/BusinessAccountQuestions/GetListQuestion?page=${curentPage}&rowPerPage=${rowPerPage}`);
		if (CheckErrorResponse(rs) === false) return;
		setListData(rs.data.listData);
		setTotalPage(GetObjectProperty(rs.data, 'totalPage', 1));
	}

	const RowPerPageChange = (e: any) => {
		let size = $(e.target).val();
		if (size !== '' && size !== undefined) {
			setRowPerPage(parseInt(size + '')); setCurrentPage(1);
			LoadData();
		}

	}

	useEffect(() => {
		LoadData();
	}, [curentPage,rowPerPage]);

	return (
		<PageWrapper title={settingsMenu.settings.subMenu.businessAccountQuestions.text}>
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
									<th>Question</th>
								</tr>
							</thead>
							<tbody>
								{
									listData.length <= 0 ?
										<tr><td colSpan={3}>No data</td></tr>
										:
										listData.map((item, index) => {
											return (
												<tr key={index}>
													<td>{((curentPage - 1) * rowPerPage+ index + 1)}</td>
													<td>
														<div className="dropup" data-id={item.ID} >
															<button type="button" className="btn " aria-expanded="true" onClick={ToggleDropdown}><i className="fa-solid fa-bars"></i></button>
															<ul style={{ zIndex: 5, position: 'absolute', display: 'none', flexDirection: 'column', backgroundColor: '#dbddd8', padding: 0, margin: 0, borderRadius: 10, borderWidth: .5, borderColor: '#00000020 !important' }}>
																<Button style={{ width: 80 }} onClick={OpenEditModal}>Edit</Button>
																<Button style={{ width: 80 }} onClick={ConfirmDelete}>Delete</Button>
															</ul>
														</div>
													</td>
													<td>{item.Question}</td>
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
								<Input type='number' value={curentPage} style={{ width: 80 }} onChange={(e: any) => { if (GetObjectProperty(e.target, 'value') > 0 && GetObjectProperty(e.target, 'value') <= totalPage) setCurrentPage(e.target.value); }} /> / {totalPage}
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
					<ModalTitle id={'UpdateFieldModalTitle'}>Update Question</ModalTitle>
				</ModalHeader>
				<ModalBody >
					<div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'question'}>Question</Label>
							<Textarea value={question} id={'question'} onChange={QuestionOnChange} />
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} >Question type</Label>
							<ChecksGroup isInline={true} >
								<Checks value={'1'} checked={answerType} type={'radio'} name={'answer-type'} onChange={AnswerTypeMultiple} label={'Multiple answer'} />
								<Checks value={'0'} checked={answerType} type={'radio'} name={'answer-type'} onChange={AnswerTypeOnlyOne} label={'One answer'} />
							</ChecksGroup>

						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'answer'}>Answer</Label>
							<Input value={answer} id={'answer'} onChange={AnswerOnChange} />
							<div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', paddingTop: 10 }}>
								<Button onClick={AddAnswer} color='info' size={'sm'} style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icon size={'lg'} icon={'Add'} /> {'Add'}</Button>
							</div>

						</div>
						<div style={innerStyle.FormItem}>

							<table className='table table-modern table-hover'>
								<thead>
									<tr>
										<th style={{ width: 60 }}>No</th>
										<th style={{ width: 60 }}></th>
										<th>Answers</th>
									</tr>
								</thead>
								<tbody>
									{
										listAnswers.map((item, index) => {
											return (<tr key={index}>
												<td>{index + 1}</td>
												<td data-id={item.ID} data-index={index}><Button isOutline={false} isActive={false} size={'sm'} onClick={()=>DeleteAnswer(item.ID,index)}><Icon color='danger' icon='Delete' size={'lg'} /></Button></td>
												<td>{item.Answer}</td>
											</tr>);
										})
									}
								</tbody>
							</table>

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
		paddingBottom: 20,
		display: 'flex',
		flexDirection: 'column' as 'column',
		alignItems: 'flex-start',
	},
	FormItemLabel: {
		width: 150
	},
	FormItemInput: {
		flex: 1
	}
}
