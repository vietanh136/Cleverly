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
  const [listServicesIncluded, setListServicesIncluded] = useState<any[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [serviceIncludedName, setServiceIncludedName] = useState('');
  const [serviceIncludedId, setServiceIncludedId] = useState('');
  const [scopeOfWork, setScopeOfWork] = useState('');

  const OpenUpdateModal = async (e: any) => {
    ToggleDropdown(e);
    const id = $(e.target).closest('.dropup').data('id');
    await LoadServiceIncluded(id);
    setIsUpdateModalOpen(true);
  }
  const CloseUpdateModal = () => {
    setServiceIncludedId('');
    setServiceIncludedName('');
    setScopeOfWork('');
    setIsUpdateModalOpen(false);
  }
  const SaveData = async () => {

    setIsLoading(true);
    try {
      let errorCount = 0;
      if (serviceIncludedName === '') {
        errorCount++;
        showNotification('Warning','This description cannot be left blank','danger');
      }


      if(errorCount > 0) throw new Error();
      let model = {
        ID: serviceIncludedId,
        Description: serviceIncludedName,
        ScopeOfWork:scopeOfWork
      };
      let rs = await SendPostRequest('/AccountingService/UpdateAccountingServiceIncluded', model);
      if (GetObjectProperty(rs, 'status') === CONSTANT.ResponseStatus.ERROR) throw new Error(GetObjectProperty(rs, 'message'));
      else if (GetObjectProperty(rs, 'status') === CONSTANT.ResponseStatus.SUCCESS) {
        showNotification('Congratulation', 'Updated successfully', 'success');
        setIsUpdateModalOpen(false);
      }
    }
    catch (ex: any) {
      
    }
    setIsLoading(false);

  }

  const LoadListServiceIncluded = async () => {
    let rs = await SendGetRequest('/AccountingService/GetListAccountingServiceIncluded');
    if (!CheckErrorResponse(rs)) throw new Error();
    setListServicesIncluded(rs.data);
  }

  const LoadServiceIncluded = async (id: any) => {
    let rs = await SendGetRequest('/AccountingService/GetAccountingServiceIncluded?id=' + id);
    if (!CheckErrorResponse(rs)) throw new Error();
    setServiceIncludedName(GetObjectProperty(rs.data, 'Description'));
    setScopeOfWork(GetObjectProperty(rs.data, 'ScopeOfWork'));
    setServiceIncludedId(GetObjectProperty(rs.data, 'ID'));
  }

  const InitPage = async () => {
    LoadListServiceIncluded();
  }
  const ServiceIncludedNameOnChange = (e: any) => {
    setServiceIncludedName(e.target.value);
  }
  const ServiceIncludedScopeOfWorkOnChange = (e: any) => {
    setScopeOfWork(e.target.value);
  }
  useEffect(() => {
    InitPage();
  }, [])

  return (
    <PageWrapper title={settingsMenu.settings.subMenu.accountantServicesIncluded.text}>
      <Page>
        <Card stretch={'full'} onClick={CloseAllDropup}>

          <CardBody isScrollable className='table-responsive'>
            <table className='table table-modern table-hover'>
              <thead>
                <tr>
                  <th style={{ width: 60 }}>No</th>
                  <th style={{ width: 60 }}></th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {
                  listServicesIncluded.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{(index + 1)}</td>
                        <td>
                          <div className="dropup" data-id={item.ID} >
                            <button type="button" className="btn " aria-expanded="true" onClick={ToggleDropdown}><i className="fa-solid fa-bars"></i></button>
                            <ul style={{ zIndex: 5, position: 'absolute', display: 'none', flexDirection: 'column', backgroundColor: '#dbddd8', listStyle: 'none', padding: 0, margin: 0, borderRadius: 10, borderWidth: .5, borderColor: '#00000020 !important' }}>
                              <li><Button style={{ width: 80 }} onClick={OpenUpdateModal}>Edit</Button></li>
                            </ul>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div style={{fontWeight:'bold',fontSize:14}}>{item.Description}</div>
                            <div style={{whiteSpace:'pre-line'}}>{item.ScopeOfWork}</div>
                          </div>
                          
                        </td>
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
          <ModalTitle id={'UpdateServiceModalTitle'}>Update Service Included</ModalTitle>
        </ModalHeader>
        <ModalBody >
          <div>
            <div style={innerStyle.FormItem}>
              <Label style={innerStyle.FormItemLabel} >Description</Label>
              <div style={innerStyle.FormItemInput}>
                <Input value={serviceIncludedName} onChange={ServiceIncludedNameOnChange} id={'service-included-name'} />
              </div>
            </div>

            <div style={innerStyle.FormItem}>
              <Label style={innerStyle.FormItemLabel} >Scope Of Work</Label>
              <div style={innerStyle.FormItemInput}>
                <Textarea value={scopeOfWork} rows={10} onChange={ServiceIncludedScopeOfWorkOnChange} />
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