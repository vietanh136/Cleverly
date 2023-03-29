import React, { useState, useEffect } from 'react';
import Button from '../../../../../components/bootstrap/Button';
import Label from '../../../../../components/bootstrap/forms/Label';
import Input from '../../../../../components/bootstrap/forms/Input';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../../../components/bootstrap/Modal';
import Icon from '../../../../../components/icon/Icon';
import Select from '../../../../../components/bootstrap/forms/Select';
import Option from '../../../../../components/bootstrap/Option';
import Card, { CardActions, CardBody, CardFooter, CardHeader, CardLabel } from '../../../../../components/bootstrap/Card';
import { CheckErrorResponse, CONSTANT, GetObjectProperty, SendGetRequest, SendPostRequest } from '../../../../../helpers/helpers';
import showNotification from '../../../../../components/extras/showNotification';
import $ from 'jquery';
const OnlyContent = () => {
    const [listData, setListData] = useState<any[]>([{ No: 1, DirectorName: 'DirectorName' }]);
    const [totalPage, setTotalPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowPerPage, setRowPerPage] = useState(CONSTANT.RowPerPage[0]);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
	const [id, setId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [directorName, setDirectorName] = useState('');

    const OpenUpdateModal = () => {
        setIsUpdateModalOpen(true);
    }
    const CloseDetailModal = ()=>{
        setIsDetailModalOpen(false);
        setDirectorName('');
    }

    const DirectorNameOnChange = (obj: any) => { setDirectorName(obj.target.value); }
    const SaveData = async () => {
        let model = {
            DirectorName: directorName
        }
        if (model.DirectorName === '') {
            showNotification('Warning', 'Director name cannot be left blank', 'danger');
            return;
        }
        setIsLoading(true);
        let rs = await SendPostRequest('/NomineesDirectorName/Insert', model);
        setIsLoading(false);
        if (CheckErrorResponse(rs) === false) return;
        showNotification('Congratulation', 'Updated successfully', 'success');
        InitPage();
        setIsUpdateModalOpen(false);
        setDirectorName('');
    }
    const OpenDetail = async (e: any) => {
        const directorNameId = $(e.target).closest('tr').data('id');
        let rs = await SendGetRequest('/NomineesDirectorName/GetDetail?id=' + directorNameId);
        if (CheckErrorResponse(rs) === false) return;
        setIsDetailModalOpen(true);
        setDirectorName(rs.data.DirectorName);

    }
	const AcceptDelete = async (e: any) => {
		let rs = await SendGetRequest('/NomineesDirectorName/Delete?id=' + id);
		if (CheckErrorResponse(rs) === false) return;
		showNotification('Congratulation', GetObjectProperty(rs, 'message') === '' ? 'Deleted successfully' : GetObjectProperty(rs, 'message'), 'success');
		CloseConfirmDelete()
		InitPage();
	}
	const ConfirmDelete = (e: any) => {
		const deleteId =  $(e.target).closest('tr').data('id');
		setId(deleteId);
		setIsConfirmDeleteModalOpen(true);
	}
	const CloseConfirmDelete = () => {
		setId('');
		setIsConfirmDeleteModalOpen(false);
	}
    const InitPage = async () => {
        let rs = await SendGetRequest(`/NomineesDirectorName/GetList?page=${currentPage}&rowPerPage=${rowPerPage}`);
        if (CheckErrorResponse(rs) === false) return;
        setListData(rs.data.listData);
        setTotalPage(GetObjectProperty(rs.data, 'totalPage', 1));
    }
    const RowPerPageChange = (e: any) => {
        let size = $(e.target).val();
        if (size !== '' && size !== undefined) {
            setRowPerPage(parseInt(size + '')); setCurrentPage(1);
            InitPage();
        }

    }

    useEffect(() => {
        InitPage();
    }, [currentPage,rowPerPage]);
    return (
        <>

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
                    <Button title='Add new' icon='Add' isOutline isLight color='success' onClick={OpenUpdateModal}>Add new</Button>
                </div>

            </CardHeader>
            <CardBody isScrollable className='table-responsive'>
                <table className='table table-modern table-hover'>
                    <thead>
                        <tr>
                            <th style={{ width: 60 }}>No</th>
                            <th style={{ width: 60 }}></th>
                            <th>Director name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listData.length <= 0 ?
                                <tr>
                                    <td colSpan={3}>No data</td>
                                </tr>
                                :
                                listData.map((item, index) => {

                                    return (<tr key={index} data-id={item.ID}>
                                        <td>{((currentPage - 1) * rowPerPage) + index + 1}</td>
                                        <td ><button className='btn' style={{ border: 'none' }}><Icon icon='Close' color='danger' size={'lg'} onClick={ConfirmDelete} /></button></td>
                                        <td onClick={OpenDetail} style={{ cursor: 'pointer' }}>{item.DirectorName}</td>
                                    </tr>)
                                })
                        }
                    </tbody>
                </table>
            </CardBody>
            <CardFooter>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Input type='number' value={currentPage} style={{ width: 80 }} onChange={(e: any) => { if (GetObjectProperty(e.target, 'value') > 0 && GetObjectProperty(e.target, 'value') <= totalPage) setCurrentPage(e.target.value); }} /> / {totalPage}
                    </div>
                </div>
            </CardFooter>
            <Modal
                isOpen={isDetailModalOpen} // Example: state
                setIsOpen={CloseDetailModal} // Example: setState
                isStaticBackdrop={true}
                isScrollable={true}
                isCentered={true}
                size={'lg'} // 'sm' || 'lg' || 'xl' 
                fullScreen={'md'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
                isAnimation={true}>
                <ModalHeader
                    setIsOpen={CloseDetailModal} // Example: setState
                >
                    <ModalTitle id={'UpdateNomineesDirectorNameModalTitle'}>Nominees Director Name</ModalTitle>
                </ModalHeader>
                <ModalBody >
                    <div>
                        <div style={innerStyle.FormItem}>
                            <Label style={innerStyle.FormItemLabel} htmlFor={'director-name'}>Director name</Label>
                            <Input style={innerStyle.FormItemInput} value={directorName} onChange={DirectorNameOnChange} autoComplete={'false'} id='director-name' />
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal
                isOpen={isUpdateModalOpen} // Example: state
                setIsOpen={setIsUpdateModalOpen} // Example: setState
                isStaticBackdrop={true}
                isScrollable={true}
                isCentered={true}
                size={'lg'} // 'sm' || 'lg' || 'xl' 
                fullScreen={'md'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
                isAnimation={true}>
                <ModalHeader
                    setIsOpen={setIsUpdateModalOpen} // Example: setState
                >
                    <ModalTitle id={'UpdateNomineesDirectorNameModalTitle'}>Update Nominees Director Name</ModalTitle>
                </ModalHeader>
                <ModalBody >
                    <div>
                        <div style={innerStyle.FormItem}>
                            <Label style={innerStyle.FormItemLabel} htmlFor={'director-name'}>Director name</Label>
                            <Input style={innerStyle.FormItemInput} value={directorName} onChange={DirectorNameOnChange} autoComplete={'false'} id='director-name' />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter  >
                    <Button isOutline isLight color='success' onClick={SaveData}>Save</Button>
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
        </>

    );
};

export default OnlyContent;

const innerStyle = {
    TabNavigation: {},
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