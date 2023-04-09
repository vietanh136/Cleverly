import React, { useState, useEffect } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { settingsMenu } from '../../../menu';
import Card, { CardBody, CardHeader } from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import { CONSTANT, CheckErrorResponse, CloseAllDropup, GetObjectProperty, SendGetRequest, SendPostRequest, ToggleDropdown } from '../../../helpers/helpers';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import Label from '../../../components/bootstrap/forms/Label';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Input from '../../../components/bootstrap/forms/Input';
import $ from 'jquery';
import set from 'date-fns/set';
import showNotification from '../../../components/extras/showNotification';
const OnlyContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listServicesCategory, setListServicesCategory] = useState<any[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [serviceCategoryName, setServiceCategoryName] = useState('');
  const [serviceCategoryId, setServiceCategoryId] = useState('');
  const [errorMessageServiceCategoryName, setErrorMessageServiceCategoryName] = useState('');
  
  const OpenUpdateModal = async (e : any) => { 
    ToggleDropdown(e);
    const id = $(e.target).closest('.dropup').data('id'); 
    await LoadServiceCategory(id);  
    setIsUpdateModalOpen (true);
  }
  const CloseUpdateModal = () => { 
    setServiceCategoryId('');
    setServiceCategoryName('');
    setIsUpdateModalOpen(false); 
  }
  const SaveData = async () => {
    
    setErrorMessageServiceCategoryName('');
    setIsLoading(true);
    try {
      if (serviceCategoryName === '') throw new Error('This category name cannot be left blank');
      
      let model = {
        ID: serviceCategoryId,
        Description : serviceCategoryName
      };
      let rs = await SendPostRequest('/AccountingService/UpdateAccountingServiceCategory',model);
      if (GetObjectProperty(rs, 'status') === CONSTANT.ResponseStatus.ERROR)  throw new Error(GetObjectProperty(rs,'message'));
      else if (GetObjectProperty(rs, 'status') === CONSTANT.ResponseStatus.SUCCESS) {
        showNotification('Congratulation', 'Updated successfully', 'success');
        setIsUpdateModalOpen(false);
      }
    }
    catch(ex : any){
      setErrorMessageServiceCategoryName(ex.message);
    }
    setIsLoading(false);

   }

  const LoadListServiceCategory = async () => {
    let rs = await SendGetRequest('/AccountingService/GetListAccountingServiceCategory');
    if (!CheckErrorResponse(rs)) throw new Error();
    setListServicesCategory(rs.data);
  }

  const LoadServiceCategory = async (id : any) => {
    let rs = await SendGetRequest('/AccountingService/GetAccountingServiceCategory?id=' + id);
    if (!CheckErrorResponse(rs)) throw new Error();
    setServiceCategoryName(GetObjectProperty(rs.data,'Description') );
    setServiceCategoryId(GetObjectProperty(rs.data, 'ID'));
  }

  const InitPage = async () => {
    LoadListServiceCategory();
  }
  const ServiceCategoryNameOnChange = (e : any)=>{
    setServiceCategoryName(e.target.value);
  }
  useEffect(() => {
    InitPage();
  }, [])

  return (
    <PageWrapper title={settingsMenu.settings.subMenu.accountantServicesCategories.text}>
      <Page>
        <Card stretch={'full'} onClick={CloseAllDropup}>
          
          <CardBody isScrollable className='table-responsive'>
            <table className='table table-modern table-hover'>
              <thead>
                <tr>
                  <th style={{ width: 60 }}>No</th>
                  <th style={{ width: 60 }}></th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {
                  listServicesCategory.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{(index + 1)}</td>
                        <td>
                          <div className="dropup" data-id={item.ID} >
                            <button type="button" className="btn " aria-expanded="true" onClick={ToggleDropdown}><i className="fa-solid fa-bars"></i></button>
                            <ul style={{ zIndex: 5, position: 'absolute', display: 'none', flexDirection: 'column', backgroundColor: '#dbddd8', listStyle:'none', padding: 0, margin: 0, borderRadius: 10, borderWidth: .5, borderColor: '#00000020 !important' }}>
                              <li><Button style={{ width: 80 }} onClick={OpenUpdateModal}>Edit</Button></li>
                            </ul>
                          </div>
                        </td>
                        <td>{item.Description}</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </CardBody>
        </Card>


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
          <ModalTitle id={'UpdateServiceModalTitle'}>Update Service</ModalTitle>
        </ModalHeader>
        <ModalBody >
          <input type='hidden' id='service-category-id' value={''}/>
          <div>
            <div style={innerStyle.FormItem}>
              <Label style={innerStyle.FormItemLabel} htmlFor={'service-name'}>Service name</Label>
              <div style={innerStyle.FormItemInput}>
                <Input value={serviceCategoryName} onChange={ServiceCategoryNameOnChange} id={'service-category-name'} />
                <span style={{paddingLeft:10, color:'red'}}>{errorMessageServiceCategoryName}</span>
              </div>
              
            </div>


          </div>


        </ModalBody>
        <ModalFooter  >
          <Button isOutline isDisable={isLoading} color='success' onClick={SaveData}>Save</Button>
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
  DataItemServiceName: { flex: 1 },

}