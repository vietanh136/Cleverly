import React, { useState, useRef, useEffect, useCallback } from 'react';
import Button from '../../../../../components/bootstrap/Button';
import Label from '../../../../../components/bootstrap/forms/Label';
import Input from '../../../../../components/bootstrap/forms/Input';
import Select from '../../../../../components/bootstrap/forms/Select';
import Option from '../../../../../components/bootstrap/Option';
import showNotification from '../../../../../components/extras/showNotification';
import Icon from '../../../../../components/icon/Icon';
import { CheckErrorResponse, CONSTANT, GetObjectProperty, SendGetRequest, SendPostRequest } from '../../../../../helpers/helpers';
import $ from 'jquery';
import { CardBody } from '../../../../../components/bootstrap/Card';
const OnlyContent = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');

    const [listProvince, setListProvince] = useState<any[]>([]);
    const [listDistrict, setListDistrict] = useState<any[]>([]);
    const [listWard, setListWard] = useState<any[]>([]);


    const AddressOnChange = (obj: any) => { setAddress(obj.target.value); }
    const ProvinceOnChange = (obj: any) => {
        setProvince(obj.target.value);
        setDistrict('');
        setWard('');
    }
    const DistrictOnChange = (obj: any) => { setDistrict(obj.target.value); setWard(''); }
    const WardOnChange = (obj: any) => { setWard(obj.target.value); }

    const SaveData = async () => {
        setIsLoading(true);
        try {
            let model = {  Address: address.trim(), ProvinceID: province, DistrictID: district, WardID: ward };
            let errorCount = 0;
            if (model.Address === '') { errorCount++; showNotification('Warning', 'Address cannot be null', 'danger'); }
            if (model.ProvinceID === '') { errorCount++; showNotification('Warning', 'Choose province', 'danger'); }
            if (model.DistrictID === '') { errorCount++; showNotification('Warning', 'Choose district', 'danger'); }
            if (model.WardID === '') { errorCount++; showNotification('Warning', 'Choose ward', 'danger'); }
            if (errorCount > 0) throw new Error();

            let rs = await SendPostRequest('/NomineesAddress/Update', model);

            if (CheckErrorResponse(rs) === false) throw new Error();
            showNotification('Congratulation', 'Updated successfully', 'success');
        }
        catch (ex) {

        }
        setIsLoading(false);
    }


    const InitPage = async () => {
        let rs = await SendGetRequest('/location/GetListProvince');
        if (CheckErrorResponse(rs) === false) return;
        let listProvinceData = [{ text: 'Please choose province', value: '' }];
        listProvinceData.push(...rs.data);
        setListProvince(listProvinceData);

        rs = await SendGetRequest('/location/GetListDistrict');
        if (CheckErrorResponse(rs) === false) return;
        let listDistrictData = [{ text: 'Please choose district', value: '' }]
        listDistrictData.push(...rs.data);
        setListDistrict(listDistrictData);

        rs = await SendGetRequest('/location/GetListWard');
        if (CheckErrorResponse(rs) === false) return;
        let listWardData = [{ text: 'Please choose ward', value: '' }]
        listWardData.push(...rs.data);
        setListWard(listWardData);

        rs = await SendGetRequest('/NomineesAddress/GetAddress');
        if (CheckErrorResponse(rs) === false) return;
        setAddress(GetObjectProperty(rs.data,'Address'));
        setProvince(GetObjectProperty(rs.data, 'ProvinceID') );
        setDistrict(GetObjectProperty(rs.data, 'DistrictID') );
        setWard(GetObjectProperty(rs.data, 'WardID') );
    }

    useEffect(() => { InitPage(); }, [])

    return (
        <>
            <CardBody isScrollable className='table-responsive'>
                <div style={{ width: '100%', maxWidth: 400 }}>
                    <div style={innerStyle.FormItem}>
                        <Label style={innerStyle.FormItemLabel} >Address</Label>
                        <Input style={innerStyle.FormItemInput} value={address} onChange={AddressOnChange} autoComplete={'false'} />
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
                            list={[{ text: 'Please choose district', value: '' }, ...listDistrict.filter((item) => {
                                if (item.ProvinceID === province) {
                                    return item;
                                }
                            })]}
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
                            list={[{ text: 'Please choose ward', value: '' }, ...listWard.filter((item) => {
                                if (item.DistrictID === district) {
                                    return item;
                                }
                            })]}
                            value={ward}
                            onChange={WardOnChange}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 10 }}>
                        <Button isLight color='success' isDisable={isLoading} onClick={SaveData}>
                            Save
                        </Button>
                    </div>
                </div>
            </CardBody>
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