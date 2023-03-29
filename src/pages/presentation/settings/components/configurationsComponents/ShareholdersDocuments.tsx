import React, { useState, useEffect } from 'react';
import Button from '../../../../../components/bootstrap/Button';
import Label from '../../../../../components/bootstrap/forms/Label';
import Input from '../../../../../components/bootstrap/forms/Input';
import Select from '../../../../../components/bootstrap/forms/Select';
import Option from '../../../../../components/bootstrap/Option';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../../../components/bootstrap/Modal';
import Icon from '../../../../../components/icon/Icon';
import { CardActions, CardBody, CardFooter, CardHeader, CardLabel } from '../../../../../components/bootstrap/Card';
import { CheckErrorResponse, CONSTANT, GetObjectProperty, SendGetRequest, SendPostRequest } from '../../../../../helpers/helpers';
import $ from 'jquery';
import showNotification from '../../../../../components/extras/showNotification';
const OnlyContent = () => {
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [id, setId] = useState('');
    const [listData, setListData] = useState<any[]>([{ No: 1, ShareholderType: 'Type', DocumentName: 'Document Name' }]);
    const [totalPage, setTotalPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowPerPage, setRowPerPage] = useState(CONSTANT.RowPerPage[0]);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [listShareholderType, setListShareholderType] = useState<any[]>([]);
    const [documentName, setDocumentName] = useState('');
    const [shareholderType, setShareholderType] = useState('');

    const OpenUpdateModal = () => {
        setIsUpdateModalOpen(true);
    }

    const AcceptDelete = async (e: any) => {
        let rs = await SendGetRequest('/ShareholdersDocument/delete?id=' + id);
        if (CheckErrorResponse(rs) === false) return;
        showNotification('Congratulation', 'Deleted successfully', 'success');
        CloseConfirmDelete()
        LoadData();
    }
    const ConfirmDelete = (e: any) => {
        const deleteId = $(e.target).closest('td').data('id');
        setId(deleteId);
        setIsConfirmDeleteModalOpen(true);
    }
    const CloseConfirmDelete = () => {
        setId('');
        setDocumentName('');
        setShareholderType('');
        setIsConfirmDeleteModalOpen(false);
    }
    const SaveData = async () => {
        let model = {
            Type: shareholderType,
            DocumentName: documentName
        };

        let errorCount = 0;
        if (model.Type === '') {
            errorCount++;
            showNotification('Warning', 'Please choose Shareholder type', 'danger');
        }
        if (model.DocumentName === '') {
            errorCount++;
            showNotification('Warning', 'Document name cannot be left blank', 'danger');
        }
        if (errorCount > 0) return;
        setIsLoading(true);
        let rs = await SendPostRequest('/ShareholdersDocument/Insert', model);
        setIsLoading(false);
        if (CheckErrorResponse(rs) === false) return;
        showNotification('Congratulation', 'Updated successfully', 'success');
        setIsUpdateModalOpen(false);
        setDocumentName('');
        setShareholderType('');
        LoadData();
    }
    const DocumentNameOnChange = (obj: any) => { setDocumentName(obj.target.value); }
    const ShareholderTypeOnChange = (obj: any) => { setShareholderType(obj.target.value); }

    const LoadData = async () => {
        let rs = await SendGetRequest(`/ShareholdersDocument/GetList?page=${currentPage}&rowPerPage=${rowPerPage}`);
        if (CheckErrorResponse(rs) === false) return;
        setListData(rs.data.listData);
        setTotalPage(GetObjectProperty(rs.data, 'totalPage', 1));       
    }

    const LoadShareholderType = async () => {
        let rs = await SendGetRequest('/ShareholdersDocument/GetListShareholderType');
        if (CheckErrorResponse(rs) === false) return;
        setListShareholderType([{ value: '', text: 'Please choose Shareholder type' }, ...rs.data]);
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
    }, [currentPage, rowPerPage]);
    useEffect(() => {
        LoadData();
        LoadShareholderType();
    }, []);
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
                    <Button title='Add new' isLight icon='Add' isOutline color='success' onClick={OpenUpdateModal}>Add new</Button>
                </div>
            </CardHeader>
            <CardBody isScrollable className='table-responsive'>
                <table className='table table-modern table-hover'>
                    <thead>
                        <tr>
                            <th style={{ width: 60 }}>No</th>
                            <th style={{ width: 60 }}></th>
                            <th>Shareholder type</th>
                            <th>Document name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listData.length <= 0 ?
                                <tr>
                                    <td colSpan={4}>No data</td>
                                </tr>
                                :
                                listData.map((item, index) => {
                                    return (<tr key={index}>
                                        <td>{((currentPage - 1) * rowPerPage) + index + 1}</td>
                                        <td data-id={item.ID}><button className='btn' style={{ border: 'none' }} onClick={ConfirmDelete}><Icon icon='Close' color='danger' size={'lg'} /></button></td>
                                        <td>{item.Description}</td>
                                        <td>{item.DocumentName}</td>
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
                    <ModalTitle id={'UpdateShareholderDocumentModalTitle'}>Update Shareholder Document</ModalTitle>
                </ModalHeader>
                <ModalBody >
                    <div>
                        <div style={innerStyle.FormItem}>
                            <Label style={innerStyle.FormItemLabel} htmlFor={'document-name'}>Document name</Label>
                            <Input style={innerStyle.FormItemInput} value={documentName} onChange={DocumentNameOnChange} autoComplete={'false'} id='document-name' />
                        </div>

                        <div style={innerStyle.FormItem}>
                            <Label style={innerStyle.FormItemLabel} htmlFor={'shareholder-type'}>Shareholder type</Label>
                            <Select

                                style={innerStyle.FormItemInput}
                                id={'shareholder-type'}
                                ariaLabel={'shareholder-type'}
                                list={listShareholderType}
                                value={shareholderType}
                                onChange={ShareholderTypeOnChange}
                            />
                        </div>
                    </div>


                </ModalBody>
                <ModalFooter  >
                    <Button isOutline color='success' isLight isDisable={isLoading} onClick={SaveData}>Save</Button>
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