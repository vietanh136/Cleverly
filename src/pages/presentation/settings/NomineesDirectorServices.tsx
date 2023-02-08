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
const OnlyContent = () => {
	const [isUpdateModalOpen, setIsUpdateModalOpenState] = useState(false);
	const [numberOfMonth, setNumberOfMonth] = useState(3);
	const [amount, setAmount] = useState('');
	const [listData, setListData] = useState([]);
	const [totalPage, setTotalPage] = useState([1]);
	const [curentPage, setCurentPage] = useState(1);

	const CloseUpdateModal = () => {
		setIsUpdateModalOpenState(false);
		setNumberOfMonth(3);
		setAmount('');
	}
	const OpenUpdateModal = () => {
		setIsUpdateModalOpenState(true);
	}
	const AmountOnChange = (event: any) => {
		setAmount(event.target.value);
	}
	const NumberOfMonthOnChange = (event: any) => {
		setNumberOfMonth(event.target.value);
	}
	return (
		<PageWrapper title={settingsMenu.settings.subMenu.nomineesDirectorServices.text}>
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
									<div style={{ width: 200 }}>Number of month</div>
									<div style={{ flex: 1 }}>Amount</div>
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
											<div></div>
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
							<Select id='number-of-month' ariaLabel='' value={numberOfMonth + ''} onChange={NumberOfMonthOnChange}>
								<Option value={3}>3</Option>
								<Option value={6}>6</Option>
								<Option value={12}>12</Option>
							</Select>
						</div>
						<div style={innerStyle.FormItem}>
							<Label style={innerStyle.FormItemLabel} htmlFor={'amount'}>Amount</Label>
							<Input value={amount} id={'amount'} type={'number'} onChange={AmountOnChange} />
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
