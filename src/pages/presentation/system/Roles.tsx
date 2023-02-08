import React, { useState, useEffect } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { systemMenu } from '../../../menu';
import Button from '../../../components/bootstrap/Button';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../components/bootstrap/Modal';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import Select from '../../../components/bootstrap/forms/Select';
const OnlyContent = () => {
	const [isUpdateRoleModalOpen, setIsUpdateRoleModalOpenState] = useState(false);
	const [listRole, setListRole] = useState([]);
	const [totalPage, setTotalPage] = useState([1]);
	const [curentPage, setCurentPage] = useState(1);

	

	const OpenUpdateRoleModal = () => {
		setIsUpdateRoleModalOpenState(true);
	}
	return (
		<PageWrapper title={systemMenu.settings.subMenu.roles.text}>
			<Page>
				<div className='user-account'>
					<div>
						<Button title='Add new' icon='Add' isOutline color='success' onClick={OpenUpdateRoleModal}>Add new</Button>
					</div>
					<div className='list-data' style={{ paddingTop: 15 }}>
						<ul className='list-data-header'>
							<li>
								<div className='header-item'>
									<div style={{ width: 80 }}>No</div>
									<div style={{ width: 80 }}></div>
									<div style={{ flex: 1 }}>Role name</div>
								</div>
							</li>
						</ul>
						<ul className='list-data-body'>
							{
								listRole.length <= 0 ?
								<li><div style={{ padding: 10 }}>No data</div></li>
									:
									listRole.map((item, index) => {

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
		width: 120
	},
	FormItemInput: {
		flex: 1
	}
}
