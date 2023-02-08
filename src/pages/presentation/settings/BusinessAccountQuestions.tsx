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
const OnlyContent = () => {
	const [isUpdateModalOpen, setIsUpdateModalOpenState] = useState(false);
	const [question, setQuestion] = useState('');
	const [answer, setAnswer] = useState('');
	const [answerType, setAnswerType] = useState(0);
	const [listAnswers, setListAnswers] = useState(['item 1']);



	const [listData, setListData] = useState<any[]>([{ No: 1, Question: 'Question' }]);
	const [totalPage, setTotalPage] = useState([1]);
	const [curentPage, setCurentPage] = useState(1);

	const CloseUpdateModal = () => {
		setIsUpdateModalOpenState(false);
		setAnswerType(0);
		setQuestion('');
		setAnswer('');
		setListAnswers([]);
	}
	const OpenUpdateModal = () => {
		setIsUpdateModalOpenState(true);
	}
	const QuestionOnChange = (event: any) => {
		setQuestion(event.target.value);
	}
	const AnswerOnChange = (event: any) => {
		setAnswer(event.target.value);
	}
	const AnswerTypeMultiple = () => {
		setAnswerType(1);
	}
	const AnswerTypeOnlyOne = () => {
		setAnswerType(0);
	}
	const AddAnswer = () => {
		let listAnswerTmp = listAnswers.reverse();
		listAnswerTmp.push(answer);
		setListAnswers(listAnswerTmp.reverse());
		setAnswer('');
	}

	return (
		<PageWrapper title={settingsMenu.settings.subMenu.businessAccountQuestions.text}>
			<Page>
				<div className='user-account'>
					<div>
						<Button title='Add new' icon='Add' isOutline color='success' onClick={OpenUpdateModal}>Add new</Button>
					</div>
					<div className='list-data' style={{ paddingTop: 15 }}>
						<ul className='list-data-header'>
							<li>
								<div className='header-item'>
									<div style={{ width: 80 }}>No</div>
									<div style={{ width: 80 }}></div>
									<div style={{ flex: 1 }}>Question</div>
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
												<div className='no'>{item.No}</div>
												<div className='action'>
													<button className='btn' style={{ border: 'none' }}><Icon icon='Menu' size={'lg'} /> </button>
												</div>
												<div style={{ flex: 1 }}>{item.Question}</div>
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
							<Label style={innerStyle.FormItemLabel} htmlFor={'field-code'}>Question</Label>
							<Textarea value={question} id={'field-code'} onChange={QuestionOnChange} />
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'field-code'}>Question type</Label>
							<ChecksGroup isInline={true} >
								<Checks value={1} type={'radio'} name={'answer-type'} onChange={AnswerTypeMultiple} label={'Multiple answer'} />
								<Checks value={0} type={'radio'} name={'answer-type'} checked onChange={AnswerTypeOnlyOne} label={'One answer'} />
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

							<table className='table'>
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
												<td><Button isOutline={false} isActive={false} size={'sm'}><Icon color='danger' icon='Delete' size={'lg'} /></Button></td>
												<td>{item}</td>
											</tr>);
										})
									}
								</tbody>
							</table>

						</div>

					</div>


				</ModalBody>
				<ModalFooter  >
					<Button isOutline color='success'>Save</Button>
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
