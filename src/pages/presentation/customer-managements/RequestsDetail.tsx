import React, { useEffect, useState } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { customerManagementsMenu } from '../../../menu';
import Card, { CardActions, CardBody, CardFooter, CardHeader, CardLabel } from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import { CheckErrorResponse, CONSTANT, DateStringFormat, GetObjectProperty, GetQueryParam, SendGetRequest, SendPostRequest } from '../../../helpers/helpers';
import $ from 'jquery';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import Select from '../../../components/bootstrap/forms/Select';
import Input from '../../../components/bootstrap/forms/Input';
import showNotification from '../../../components/extras/showNotification';

const OnlyContent = () => {
  const CKEditor = require("@ckeditor/ckeditor5-react").CKEditor;
  const ClassicEditor = require("@ckeditor/ckeditor5-build-classic");

  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [enquiry, setEnquiry] = useState<any>(null);
  const [listEnquiryReply, setListEnquiryReply] = useState<any[]>([]);
  const [listEnquiryFile, setListEnquiryFile] = useState<any[]>([]);
  const [listEnquiryReplyFile, setListEnquiryReplyFile] = useState<any[]>([]);

  const [replyFileName, setReplyFileName] = useState('');
  const [replyFileData, setReplyFileData] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyFileDataExt, setReplyFileDataExt] = useState('');

  const [listReplyFile, setListReplyFile] = useState<any[]>([]);

  const LoadEnquiry = async () => {
    const enquiryId = GetQueryParam('id');
    if (enquiryId === '' || enquiryId === null || typeof enquiryId === 'undefined') return;
    const rs = await SendGetRequest('/Enquiry/GetEnquiry?id=' + enquiryId);
    if (!CheckErrorResponse(rs)) return;

    setEnquiry(rs.data.enquiry);
    setListEnquiryFile(rs.data.listFile);

  }
  const CKEditorOnChange = (event: any, editor: { getData: () => any; }) => {
    const data = editor.getData();
    setReplyContent(data);
  }

  const OpenReply = () => {
    setIsReplyModalOpen(true);
  }

  const LoadListEnquiryReply = async () => {
    const enquiryId = GetQueryParam('id');
    if (enquiryId === '' || enquiryId === null || typeof enquiryId === 'undefined') return;
    const rs = await SendGetRequest('/Enquiry/GetListEnquiryReply?enquiryId=' + enquiryId);
    if (!CheckErrorResponse(rs)) return;

    setListEnquiryReply(rs.data.listReply);
    setListEnquiryReplyFile(rs.data.listReplyFile);
  }

  const ToggleContent = (e: any) => {
    const cardBody = $(e.target).closest('.card-body');
    const contentDiv = $(cardBody).find('.enquiry-content');
    if ($(contentDiv).hasClass('open')) {
      $(contentDiv).removeClass('open');
      $(contentDiv).css('display', 'none');
    } else {
      $(contentDiv).addClass('open');
      $(contentDiv).css('display', 'flex');
    }
  }
  const BrowseFileOnChange = async (event: any) => {


    const reader = new FileReader();
    reader.onloadend = function (rs: any) {
      if (rs.total > 5242880) {
        showNotification('Warning', 'File size must be less than 5MB', 'danger');
        $(event.target).val('');
        return;
      }
      const base64Data = rs?.currentTarget?.result.split('base64,');

      let extData = base64Data[0].replace(';', '').replace('data:', '');
      let extPart = extData.split('/');
      let ext = '';
      switch (extPart[1]) {
        case 'vnd.openxmlformats-officedocument.wordprocessingml.document': ext = 'docx'; break;
        case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet': ext = 'xlsx'; break;
        case 'vnd.openxmlformats-officedocument.presentationml.presentation': ext = 'pptx'; break;
        case 'msword': ext = 'doc'; break;
        case 'pdf': ext = 'pdf'; break;
        case 'vnd.ms-powerpoint': ext = 'ppt'; break;
        case 'vnd.ms-excel': ext = 'xls'; break;
        default: ext = 'png';
      }
      setReplyFileDataExt(ext);
      setReplyFileData(base64Data[1]);

    }
    reader.readAsDataURL(event.target.files[0]);

  }
  const InitPage = async () => {
    LoadEnquiry();
    LoadListEnquiryReply();
  }

  const ReplyFileNameOnChange = (e: any) => {
    setReplyFileName(e.target.value);
  }

  const AddFile = () => {
    if (replyFileName === '') {
      showNotification('Warning', 'Please enter file name', 'danger');
      return;
    }
    if (replyFileData === '') {
      showNotification('Warning', 'Please choose file', 'danger');
      return;
    }
    let model = {
      FileName: replyFileName,
      FilePath: replyFileData,
      FileType:5
    };

    if (replyFileDataExt === 'docx' || replyFileDataExt === 'doc') model.FileType = 1;
    else if (replyFileDataExt === 'xlsx' || replyFileDataExt === 'xls') model.FileType = 2;
    else if (replyFileDataExt === 'pptx' || replyFileDataExt === 'ppt') model.FileType = 3;
    else if (replyFileDataExt === 'pdf') model.FileType = 4;

    setListReplyFile([model, ...listReplyFile]);
    setReplyFileName('');
    setReplyFileData('');
    setReplyFileDataExt('');
    $('#reply-file').val('');
  }
  const DeleteFile = (e: any) => {

  }

  const SendReply = async ()=>{
    let model = {
      EnquiryID:enquiry.ID,
      Content: replyContent,
      ListFile : listReplyFile
    };
    if(model.Content === '') {
      showNotification('Warning','Content cannot be null','danger');
      return;
    }

    let rs = await SendPostRequest('/Enquiry/SendReply',model);
    if(!CheckErrorResponse(rs)) return;
    showNotification('Congratulation','Sent mail successfully','success');
    setIsReplyModalOpen(false);
  }
  useEffect(() => {
    InitPage();
  }, []);

  return (
    <PageWrapper title={customerManagementsMenu.customerManagements.subMenu.requests.text}>
      <Page>

        <h3>{GetObjectProperty(enquiry, 'Title')}</h3>

        <Card className='bg-l25-dark text-white'>
          <CardBody>
            <Button isLight isLink onClick={ToggleContent}>{`${GetObjectProperty(enquiry, 'UserName')} - ${DateStringFormat({ stringDate: GetObjectProperty(enquiry, 'SentDate'), newFormat: 'dd/mm/yyyy hh:mi:ss', currentFormat: 'yyyy/mm/dd hh:mi:ss' })}`}</Button>
            <div className='enquiry-content text-dark' style={{ paddingLeft: 15, display: 'none' }}>
              <div className=''>
                <div>
                  {GetObjectProperty(enquiry, 'Content')}
                </div>
                <div>
                  {
                    listEnquiryFile.map((item, index) => {
                      return (<div key={index}>{item.FileName}</div>)
                    })
                  }
                </div>
              </div>

            </div>
          </CardBody>
        </Card>

        {
          listEnquiryReply.map((reply, index1) => {
            return (
              <Card key={index1} className={`${reply.IsCustomer ? 'bg-l25-success' : 'bg-l25-dark'} text-white`}>
                <CardBody>
                  <Button isLight isLink onClick={ToggleContent}>{`${GetObjectProperty(reply, 'SentFrom','Cleverly')} - ${DateStringFormat({ stringDate: GetObjectProperty(reply, 'SentDate'), newFormat: 'dd/mm/yyyy hh:mi:ss', currentFormat: 'yyyy/mm/dd hh:mi:ss' })}`}</Button>
                  <div className='enquiry-content text-dark' style={{ paddingLeft: 15, display: 'none' }}>
                    <div className=''>
                      <div dangerouslySetInnerHTML={{ __html:  GetObjectProperty(reply, 'Content') }}>
                       
                      </div>
                      <div>
                        {
                          listEnquiryReplyFile.map((replyFile, index2) => {
                            if (replyFile.EnquiryReplyID === reply.ID)
                              return (<div key={index2}>{replyFile.FileName}</div>)
                          })
                        }
                      </div>
                    </div>

                  </div>
                </CardBody>
              </Card>
            );
          })
        }

        <Modal
          isOpen={isReplyModalOpen} // Example: state
          setIsOpen={setIsReplyModalOpen} // Example: setState
          isStaticBackdrop={true}
          isScrollable={true}
          isCentered={true}
          size={'lg'} // 'sm' || 'lg' || 'xl' 
          fullScreen={'md'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
          isAnimation={true}>
          <ModalHeader setIsOpen={setIsReplyModalOpen}>
            <ModalTitle id='' >Send Mail</ModalTitle>
          </ModalHeader>
          <ModalBody >
            <div>
              <div style={innerStyle.FormItem}>
                <div style={innerStyle.FormItemLabel}>Content</div>
                <CKEditor
                  editor={ClassicEditor}
                  data={replyContent}
                  onChange={CKEditorOnChange}
                />
              </div>
              <div style={innerStyle.FormItem}>
                <div style={innerStyle.FormItemLabel}>File name</div>
                <Input value={replyFileName} onChange={ReplyFileNameOnChange} />
              </div>
              <div style={innerStyle.FormItem}>
                <div style={innerStyle.FormItemLabel}>Browse</div>
                <Input type='file' accept={'image/*,.pdf,.xlsx,.pptx,.docx,.xls,.ppt,.doc'} id='reply-file' onChange={BrowseFileOnChange}/>
              </div>
              <div style={{ padding: 15, display: 'flex', justifyContent: 'flex-end' }}>
                <Button icon='add' title='Add' color='primary' isOutline onClick={AddFile}>Add</Button>
              </div>
              <table className='table table-modern table-striped table-hover'>
                <tbody>
                  {
                    listReplyFile.length > 0 ?
                      listReplyFile.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td style={{ width: 60, textAlign: 'right' }}>{index + 1}</td>
                            <td style={{ width: 60, textAlign: 'center' }}>
                              <button className='btn btn-outline-danger border-transparent' onClick={DeleteFile}><i className="fa-solid fa-xmark"></i></button>
                            </td>
                            <td>{item.FileName}</td>
                          </tr>
                        );
                      })

                      :
                      <tr><td colSpan={3}>{'No file'}</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </ModalBody>
          <ModalFooter>
            <div style={{ display: 'flex', justifyItems: 'flex-end', paddingRight: 15 }}>
              <button className='btn btn-outline-danger ' onClick={SendReply}><i className="fa-regular fa-paper-plane"></i> Send</button>
            </div>
          </ModalFooter>
        </Modal>

        <div style={{ position: 'fixed', right: 20, bottom: 100, zIndex: 5 }}>
          <Button color='success' isOutline onClick={OpenReply}>
            <i className="fa-solid fa-reply fa-2xl"></i>
            <span style={{ padding: 5, fontSize: 20 }}>Reply</span>
          </Button>
        </div>

      </Page>
    </PageWrapper>
  );
};

export default OnlyContent;

const innerStyle = {
  TabNavigation: {},
  FormItem: {
    padding: 15,
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
  FormItemLabel: {
    width: 120
  },
  FormItemInput: {
    flex: 1
  }
}