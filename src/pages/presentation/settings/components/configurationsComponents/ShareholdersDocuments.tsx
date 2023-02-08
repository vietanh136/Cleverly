import React, { useState } from 'react';
import Button from '../../../../../components/bootstrap/Button';
import Label from '../../../../../components/bootstrap/forms/Label';
import Input from '../../../../../components/bootstrap/forms/Input';
import Select from '../../../../../components/bootstrap/forms/Select';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../../../components/bootstrap/Modal';
import Icon from '../../../../../components/icon/Icon';

const OnlyContent = () => {
    const [listData, setListData] = useState<any[]>([{ No: 1, ShareholderType: 'Type', DocumentName: 'Document Name' }]);
    const [totalPage, setTotalPage] = useState([1]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const [listShareholderType, setListShareholderType] = useState([{ text: 'a', value: 1 }, { text: 'b', value: 2 }, { text: 'c', value: 3 }]);
    const [documentName, setDocumentName] = useState('');
    const [shareholderType, setShareholderType] = useState('');

    const OpenUpdateModal = () => {
        setIsUpdateModalOpen(true);
    }

    const DocumentNameOnChange = (obj: any) => { setDocumentName(obj.target.value); }
    const ShareholderTypeOnChange = (obj: any) => { setShareholderType(obj.target.value); }

    return (


        <div style={{ display: 'block' }}>
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
                                <div style={{ flex: 1 }}>Shareholder type</div>
                                <div style={{ flex: 1 }}>Document name</div>
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
                                                <button className='btn' style={{ border: 'none' }}><Icon icon='Close' color='danger' size={'lg'} /></button>
                                            </div>
                                            <div style={{ flex: 1 }}>{item.ShareholderType}</div>
                                            <div style={{ flex: 1 }}>{item.DocumentName}</div>
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
                                        <Button isOutline color={item === currentPage ? 'primary' : 'link'} >{item}</Button>
                                    </li>
                                )
                            })
                        }

                    </ul>
                </div>

            </div>
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
                            <Label style={innerStyle.FormItemLabel} htmlFor={'document-name'}>Director name</Label>
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
                    <Button isOutline color='success'>Save</Button>
                </ModalFooter>
            </Modal>
        </div>

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