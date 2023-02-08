import React, { useState,useRef,useEffect } from 'react';
import Button from '../../../../../components/bootstrap/Button';
import Label from '../../../../../components/bootstrap/forms/Label';
import Input from '../../../../../components/bootstrap/forms/Input';
import Select from '../../../../../components/bootstrap/forms/Select';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../../../components/bootstrap/Modal';
import showNotification from '../../../../../components/extras/showNotification';
import Icon from '../../../../../components/icon/Icon';

const OnlyContent = () => {
    const [listData, setListData] = useState<any[]>([]);
    const [totalPage, setTotalPage] = useState([1]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const [currentIndexRow, setCurrentIndexRow] = useState(1);

    const [address, setAddress] = useState('');
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');

    const [listProvince, setListProvince] = useState([{ text: 'Chọn tỉnh/thành', value: '' }, { text: 'a', value: '1' }, { text: 'b', value: '2' }, { text: 'c', value: '3' },]);
    const [listDistrict, setListDistrict] = useState([{ text: 'Chọn quận/huyện', value: '' }, { text: 'a', value: 1 }, { text: 'b', value: 2 }, { text: 'c', value: 3 },]);
    const [listWard, setListWard] = useState([{ text: 'Chọn phường/xã', value: '' }, { text: 'a', value: 1 }, { text: 'b', value: 2 }, { text: 'c', value: 3 },]);

    const [listDistrictInProvince, setListDistrictInProvince] = useState([{ text: 'Chọn quận/huyện', value: '' }, { text: 'a', value: 1 }, { text: 'b', value: 2 }, { text: 'c', value: 3 },]);
    const [listWardInDistrict, setListWardInDistrict] = useState([{ text: 'Chọn phường/xã', value: '' }, { text: 'a', value: 1 }, { text: 'b', value: 2 }, { text: 'c', value: 3 },]);

    const OpenUpdateModal = () => {
        setIsUpdateModalOpen(true);
      
    }
    const CloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setAddress('');
        setProvince('');
        setDistrict('');
        setWard('');
    }

    const AddressOnChange = (obj: any) => { setAddress(obj.target.value); }
    const ProvinceOnChange = (obj: any) => { setProvince(obj.target.value); }
    const DistrictOnChange = (obj: any) => { setDistrict(obj.target.value); }
    const WardOnChange = (obj: any) => { setWard(obj.target.value); }

    const SaveData = () => {
        let model = {
            No: currentIndexRow,
            Address: address,
            Province: province,
            District: district,
            Ward: ward
        };
        let errorCount = 0;
        if (model.Address === '') { errorCount++; showNotification('Warning', 'Address cannot be null', 'danger'); }
        if (model.Province === '') { errorCount++; showNotification('Warning', 'Choose province', 'danger'); }
        if (model.District === '') { errorCount++; showNotification('Warning', 'Choose district', 'danger'); }
        if (model.Ward === '') { errorCount++; showNotification('Warning', 'Choose ward', 'danger'); }
        if (errorCount > 0) return;
        listData.push(model);
        CloseUpdateModal();
        setCurrentIndexRow(currentIndexRow + 1);
    }

    
	

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
                                <div style={{ flex: 1 }}>Address</div>
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
                                        <div >
                                            <div className='no'>{item.No}</div>
                                            <div className='action'>
                                                <button className='btn' style={{ border: 'none' }}><Icon icon='Close' color='danger' size={'lg'} /></button>
                                            </div>
                                            <div style={{ flex: 1 }}>{item.Address}</div>
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
                    <ModalTitle id={'UpdateNomineesAddressModalTitle'}>Update Nominees Address</ModalTitle>
                </ModalHeader>
                <ModalBody >
                    <div>
                        <div style={innerStyle.FormItem}>
                            <Label style={innerStyle.FormItemLabel} htmlFor={'address'}>Address</Label>
                            <Input style={innerStyle.FormItemInput}  value={address} onChange={AddressOnChange} autoComplete={'false'} id='address' />
                        </div>

                        <div style={innerStyle.FormItem}>
                            <Label style={innerStyle.FormItemLabel} htmlFor={'province'}>Province</Label>
                            <Select

                                style={innerStyle.FormItemInput}
                                id={'province'}
                                ariaLabel={'province'}
                                list={listProvince}
                                value={province}
                                onChange={ProvinceOnChange}
                            />
                        </div>

                        <div style={innerStyle.FormItem}>
                            <Label style={innerStyle.FormItemLabel} htmlFor={'district'}>District</Label>
                            <Select

                                style={innerStyle.FormItemInput}
                                id={'district'}
                                ariaLabel={'district'}
                                list={listDistrictInProvince}
                                value={district}
                                onChange={DistrictOnChange}
                            />
                        </div>

                        <div style={innerStyle.FormItem}>
                            <Label style={innerStyle.FormItemLabel} htmlFor={'ward'}>Ward</Label>
                            <Select

                                style={innerStyle.FormItemInput}
                                id={'ward'}
                                ariaLabel={'ward'}
                                list={listWardInDistrict}
                                value={ward}
                                onChange={WardOnChange}

                            />
                        </div>

                    </div>


                </ModalBody>
                <ModalFooter  >
                    <Button isOutline color='success' onClick={SaveData}>Save</Button>
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