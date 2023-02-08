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

const OnlyContent = () => {
	const [isUpdateModalOpen, setIsUpdateModalOpenState] = useState(false);
	const [pauseProcess, setPauseProcess] = useState(false);
	const [fieldCode, setFieldCode] = useState('');
	const [fieldNameVN, setFieldNameVN] = useState('');
	const [fieldNameEN, setFieldNameEN] = useState('');


	const [listData, setListData] = useState<any[]>([{No : 1, FieldCode : 'Code' ,FieldNameInVN : 'Code VN',FieldNameInEN : 'Code EN' }]);
	const [totalPage, setTotalPage] = useState([1]);
	const [curentPage, setCurentPage] = useState(1);

	const CloseUpdateModal = () => {
		setIsUpdateModalOpenState(false);
		setPauseProcess(false);
		setFieldCode('');
		setFieldNameVN('');
		setFieldNameEN('');
	}
	const OpenUpdateModal = () => {
		setIsUpdateModalOpenState(true);
	}
	const FieldCodeOnChange = (event: any) => {
		setFieldCode(event.target.value);
	}
	const FieldNameVnOnChange = (event: any) => {
		setFieldNameVN(event.target.value);
	}
	const FieldNameEnOnChange = (event: any) => {
		setFieldNameEN(event.target.value);
	}
	const PauseProcessOnChange = (event: any) => {
		setPauseProcess(event.target.checked);
		console.log(event.target.checked)
	}

	return (
		<PageWrapper title={settingsMenu.settings.subMenu.fields.text}>
			<Page>
				<div className='user-account'>
					
					<div className='list-data' style={{ paddingTop: 15 }}>
						<ul className='list-data-header'>
							<li>
								<div className='header-item'>
									<div style={{ width: 80 }}>No</div>
									<div style={{ width: 80 }}></div>
									<div style={{ width: 200 }}>Field Code</div>
									<div style={{ flex: 1 }}>Field Name (VN)</div>
									<div style={{ flex: 1 }}>Field Name (ENG)</div>
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
												<div style={{ width: 200 }}>{item.FieldCode}</div>
												<div style={{ flex: 1 }}>{item.FieldNameInVN}</div>
												<div style={{ flex: 1 }}>{item.FieldNameInEN}</div>
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
