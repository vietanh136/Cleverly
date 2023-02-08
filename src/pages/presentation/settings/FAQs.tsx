import React, { useState, useEffect } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { customerManagementsMenu } from '../../../menu';
import Button from '../../../components/bootstrap/Button';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import Checks from '../../../components/bootstrap/forms/Checks';
const DEFAULT_NO_IMAGE = require('../../../assets/img/thumb.jpg');
const OnlyContent = () => {
	const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
	const [listData, setListData] = useState<any[]>([]);
	const [totalPage, setTotalPage] = useState([1]);
	const [curentPage, setCurentPage] = useState(1);
	const [avatarData, setAvatarData] = useState('');
	const [avatarPreview, setAvatarPreview] = useState('');

	const [question, setQuestion] = useState('');
	const [answer, setAnswer] = useState('');
	const [formFill, setFormFill] = useState('');
	const [processingTime, setProcessingTime] = useState('');
	const [payment, setPayment] = useState('free');
	const [description, setDescription] = useState('');
	const [stepDescription, setStepDescription] = useState('');
	const [stepNote, setStepNote] = useState('');

	const [listDescription, setListDescription] = useState<any[]>([]);
	const [listDescriptionStep, setListDescriptionStep] = useState<any[]>([]);

	const AvatarOnChange = (event: any) => {
		const reader = new FileReader();
		reader.onloadend = function (rs: any) {
			setAvatarPreview(rs?.currentTarget?.result);
			const basr64Data = rs?.currentTarget?.result.split('base64,');
			setAvatarData(basr64Data);
		}
		reader.readAsDataURL(event.target.files[0]);
	}
	const AvatarOpenFileChoose = () => { document.getElementById('avatar')?.click(); }

	const QuestionOnChange = (obj: any) => { setQuestion(obj.target.value); }
	const AnswerOnChange = (obj: any) => { setAnswer(obj.target.value); }
	const FormFillOnChange = (obj: any) => { setFormFill(obj.target.value); }
	const ProcessingTimeOnChange = (obj: any) => { setProcessingTime(obj.target.value); }
	const PaymentOnChange = (obj: any) => { setPayment(obj.target.value); }
	const DescriptionOnChange = (obj: any) => { setDescription(obj.target.value); }
	const StepDescriptionOnChange = (obj: any) => { setStepDescription(obj.target.value); }
	const StepNoteOnChange = (obj: any) => { setStepNote(obj.target.value); }

	const AddDescription = () => {
		let model = {
			Description: description
		}
		let errorCount = 0;
		if (model.Description === '') { errorCount++; showNotification('Warning', 'Description cannot be null', 'danger'); }
		if (errorCount > 0) return;
		listDescription.push(model);
		setDescription('');
	}

	const AddStepDescription = () => {
		let model = {
			Description: stepDescription,
			Note: stepNote
		}
		let errorCount = 0;
		if (model.Description === '') { errorCount++; showNotification('Warning', 'Description cannot be null', 'danger'); }
		if (model.Note === '') { errorCount++; showNotification('Warning', 'Note cannot be null', 'danger'); }
		if (errorCount > 0) return;
		listDescriptionStep.push(model);
		setStepDescription('');
		setStepNote('');
	}


	const OpenUpdateModal = () => { setIsUpdateModalOpen(true); }
	const CloseUpdateModal = () => { setIsUpdateModalOpen(false); }

	const SaveData = () => { }
	return (
		<PageWrapper title={customerManagementsMenu.customerManagements.subMenu.customerInformations.text}>
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
									<div style={{ width: 150 }}>Avatar</div>
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
												<div className='action' >
													<button className='btn' style={{ border: 'none' }}><Icon icon='Menu' size={'lg'} /> </button>
												</div>
												<div style={innerStyle.DataItemAvatar}>
													<img src={item.Avatar} style={{ width: 60, height: 60, borderRadius: 7, objectFit: 'cover' }} />
												</div>
												<div style={innerStyle.DataQuestion}>{item.ServiceName}</div>
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
					<ModalTitle id={'UpdateServiceModalTitle'}>Update FAQ</ModalTitle>
				</ModalHeader>
				<ModalBody >
					<div className='faqs-update-form'>
						<div>
							<div>Question</div>
							<Textarea style={{resize:'none'}} rows={4} value={question} onChange={QuestionOnChange} />
						</div>

						<div style={{ flexDirection: 'row' ,gap:15}}>
							<div style={{width:90}}>
								<div>Avatar</div>
								<input type={'hidden'} id={'avatar-base-64'} value={avatarData} />
								<input type={'file'} accept={'image/*'} id={'avatar'} style={{ display: 'none' }} onChange={AvatarOnChange} />
								<img style={{ width: 90, height: 90, objectFit: 'cover',borderRadius:7 }} src={avatarPreview === '' ? DEFAULT_NO_IMAGE : avatarPreview} id={'avatar-preview'} onClick={AvatarOpenFileChoose} />
							</div>

							<div style={{flex:1}}>
								<div>Form fill</div>
								<Textarea style={{resize:'none'}} rows={4} value={formFill} onChange={FormFillOnChange} />
							</div>

							<div style={{flex:1}}>
								<div>Processing time</div>
								<Textarea style={{resize:'none'}} rows={4} value={processingTime} onChange={ProcessingTimeOnChange} />
							</div>
						</div>

						<div style={{ flexDirection: 'row' ,gap:15}}>
							<div>Payment</div>
							<div style={{display:'flex', flexDirection: 'row' ,gap:15}}>
								<Checks
									checked={payment}
									label={'Free'}
									name={'payment'}
									type="radio"
									value={'free'}
									onChange={PaymentOnChange}
								/>
								<Checks
									checked={payment}
									label={'Condition'}
									name={'payment'}
									type="radio"
									value={'condition'}
									onChange={PaymentOnChange}
								/>
							</div>
						</div>

						<div>
							<div>Answer</div>
							<Textarea value={answer} onChange={AnswerOnChange} style={{resize:'none'}} rows={4} />
						</div>

						<div style={{gap:7}}>
							<div>What do i need?</div>
							<Input placeholder='Description' value={description} onChange={DescriptionOnChange} />
							<div style={{ display:'flex', justifyContent:'flex-end'}}>
								<Button color='primary' onClick={AddDescription}>Add</Button>
							</div>

							<div>
								<table className='table'>
									<thead>
										<tr>
											<th style={{ width: 60 }}>No</th>
											<th style={{ width: 60 }}></th>
											<th>What do i need?</th>
										</tr>
									</thead>
									<tbody>
										{
											listDescription.map((item, index) => {
												return (<tr key={index}>
													<td>{index + 1}</td>
													<td>
														<button className='btn' style={{ border: 'none' }}><Icon icon='Close' color='danger' size={'lg'} /></button>
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

						<div  style={{gap:7}}>
							<div>Steps</div>
							<Input placeholder='Description' value={stepDescription} onChange={StepDescriptionOnChange} />
							<Input placeholder='Note' value={stepNote} onChange={StepNoteOnChange} />
							<div style={{ display:'flex', justifyContent:'flex-end'}}>
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
													<td>
														<button className='btn' style={{ border: 'none' }}><Icon icon='Close' color='danger' size={'lg'} /></button>
													</td>
													<td>
														<div>
															<div>{item.Description}</div>
															<div style={{fontStyle:'italic',color:'#c4c4c4'}}>{item.Note}</div>
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
	DataQuestion: {}
}
