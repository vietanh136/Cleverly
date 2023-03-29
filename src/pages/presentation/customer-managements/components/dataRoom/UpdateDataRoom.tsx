import React, { useState, useRef, useEffect } from 'react';
import PageWrapper from '../../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../../layout/Page/Page';
import { customerManagementsMenu } from '../../../../../menu';
import Button from '../../../../../components/bootstrap/Button';
import Label from '../../../../../components/bootstrap/forms/Label';
import Input from '../../../../../components/bootstrap/forms/Input';
import Select from '../../../../../components/bootstrap/forms/Select';
import Modal, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../../../components/bootstrap/Modal';
import showNotification from '../../../../../components/extras/showNotification';
import Icon from '../../../../../components/icon/Icon';
import Checks from '../../../../../components/bootstrap/forms/Checks';
import { CheckErrorResponse, CONSTANT, DateStringFormat, GetQueryParam, SendGetRequest, SendPostRequest } from '../../../../../helpers/helpers';
import $ from 'jquery';

const OnlyContent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const fileChoose = useRef<any>();
    const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
    const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
    const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] = useState(false);

    const [confirmDeleteMessage, setConfirmDeleteMessage] = useState('');
    const [deleteId, setDeleteId] = useState('');
    const [deleteType, setDeleteType] = useState('');

    const [companyId, setCompanyId] = useState(GetQueryParam('id'));
    const [currentFolder, setCurrentFolder] = useState<any>({});
    const [folderName, setFolderName] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileData, setFileData] = useState('');
    const [fileDataExt, setFileDataExt] = useState('');

    const [listFolder, setListFolder] = useState<any[]>([]);
    const [listFile, setListFile] = useState<any[]>([]);

    const FolderNameOnChange = (obj: any) => {
        if (/[^a-zA-Z0-9\b.!()-_,]/.test(obj.target.value)) return; if (obj.target.value.length > 255) return;
        setFolderName(obj.target.value);
    }
    const FileNameOnChange = (obj: any) => {
        if (/[^a-zA-Z0-9\b.!()-_,]/.test(obj.target.value)) return; if (obj.target.value.length > 255) return;
        setFileName(obj.target.value);
    }
    const BrowseFileOnChange = (event: any) => {

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
            setFileDataExt(ext);
            setFileData(base64Data[1]);
        }
        reader.readAsDataURL(event.target.files[0]);

    }
    const SaveAddFile = async () => {
        let errorCount = 0;
        if (fileName === '') {
            errorCount++;
            showNotification('', '', '');
        }
        if (fileData === '') {
            errorCount++;
            showNotification('', '', '');
        }
        if (errorCount > 0) return;

        let model = {
            FolderID: currentFolder.ID,
            FileName: fileName,
            FileData: fileData,
            FileType: 5,
            FileExt: fileDataExt
        };

        if (model.FileExt === 'docx' || model.FileExt === 'doc') model.FileType = 1;
        else if (model.FileExt === 'xlsx' || model.FileExt === 'xls') model.FileType = 2;
        else if (model.FileExt === 'pptx' || model.FileExt === 'ppt') model.FileType = 3;
        else if (model.FileExt === 'pdf') model.FileType = 4;

        const rs = await SendPostRequest('/DataRoom/UploadFile', model);
        if (!CheckErrorResponse(rs)) return;
        LoadFileAndFolderInFolder(currentFolder.ID);
        showNotification('Congratulation', 'Updated successfully', 'success');
        CloseModal();
    }
    const SaveAddFolder = async () => {
        let model = {
            CompanyID: companyId,
            FolderName: folderName,
            ParentID: currentFolder.ID
        };
        const rs = await SendPostRequest('/DataRoom/CreateFolder', model);
        if (!CheckErrorResponse(rs)) return;
        LoadFileAndFolderInFolder(currentFolder.ID);
        showNotification('Congratulation', 'Updated successfully', 'success');
        CloseModal();
    }
    const CloseModal = () => {
        setDeleteId('');
        setDeleteType('');
        setConfirmDeleteMessage('');
        setFileName('');
        setFolderName('');
        setFileData('');
        setFileDataExt('');
        setIsAddFileModalOpen(false);
        setIsAddFolderModalOpen(false);
        setIsConfirmDeletePopupOpen(false);
    }
    const OpenAddFolderModal = () => { setIsAddFolderModalOpen(true); }
    const OpenAddFileFolderModal = () => { setIsAddFileModalOpen(true); }

    const LoadFileAndFolderInFolder = async (folderId = '') => {
        if (folderId === '' || folderId === null || typeof folderId === 'undefined') return;
        let rs = await SendGetRequest('/DataRoom/LoadListDataInFolder?folderId=' + folderId);
        if (!CheckErrorResponse(rs)) return;
        setListFolder(rs.data.ListFolder);
        setListFile(rs.data.ListFile);
        setCurrentFolder(rs.data.CurrentFolder);
    }
    const BackFolder = async () => {
        LoadFileAndFolderInFolder(currentFolder.ParentID);
    }

    const InitPage = async () => {
        let rs = await SendGetRequest('/DataRoom/LoadListFolderAndFileInRoot?companyId=' + companyId);
        if (!CheckErrorResponse(rs)) return;
        setListFolder(rs.data.ListFolder);
        setListFile(rs.data.ListFile);
        setCurrentFolder(rs.data.CurrentFolder);
    }
    const FileOnClick = async (e: any) => { }
    const FolderOnClick = async (folderId: string) => {
        LoadFileAndFolderInFolder(folderId);
    }

    const ConfirmDelete = async (id: string, type: string) => {
        setDeleteId(id);
        setDeleteType(type);

        if (type === 'folder') {
            const rs = await SendGetRequest('/dataroom/checkfolderhaschild?id=' + id);
            if (!CheckErrorResponse(rs)) return;
            if (rs.data === true) {
                setConfirmDeleteMessage('This folder is not empty. Are you sure you want to delete?');
            } else {
                setConfirmDeleteMessage('Are you sure you want to delete?');
            }
        } else {
            setConfirmDeleteMessage('Are you sure you want to delete?');
        }
        setIsConfirmDeletePopupOpen(true);
    }

    const DeleteAccept = async () => {
        setIsLoading(true);
        try {

            if (deleteId === '' || deleteType === '') throw new Error();
            let url = '/dataroom/deletefile?id=' + deleteId;
            if (deleteType === 'folder') url = '/dataroom/deletefolder?id=' + deleteId;
            const rs = await SendGetRequest(url);
            if (!CheckErrorResponse(rs)) throw new Error();
            LoadFileAndFolderInFolder(currentFolder.ID);
            showNotification('Congratulation', 'Deleted successfully', 'success');
            CloseModal();

        }
        catch (ex) {

        }
        setIsLoading(false);
    }


    useEffect(() => {
        InitPage();
    }, []);

    return (
        <PageWrapper title={'Update Data Room'}>
            <Page>
                <div style={{ display: 'block' }}>
                    <div className='data-room'>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <Button isOutline color='success' onClick={OpenAddFolderModal}>Add folder</Button>
                            <Button isOutline color='success' onClick={OpenAddFileFolderModal}>Add file</Button>
                        </div>
                        <ul style={{ paddingTop: 20, listStyle: 'none', paddingLeft: 0 }}>
                            <li className='list-header'>
                                <div>
                                    <div className='action'></div>
                                    <div className='name'>
                                        <Button >Name </Button>
                                    </div>
                                    <div className='created-time'>

                                    </div>
                                </div>
                            </li>
                        </ul>
                        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                            <li>
                                <div onClick={BackFolder}>
                                    <div className='action'>

                                    </div>
                                    <div className='folder'>
                                        <i className="fa-solid fa-turn-up fa-xl"></i>
                                    </div>
                                    <div className='created-time'>

                                    </div>
                                </div>
                            </li>
                            {
                                listFolder.map((item, index) => {
                                    return (
                                        <li data-folder-id={item.ID} key={index}>
                                            <div >
                                                <div className='action'>
                                                    <Button size={'lg'} onClick={() => { ConfirmDelete(item.ID, 'folder'); }}><Icon icon='Menu' size={'lg'} /></Button>
                                                </div>
                                                <div className='folder' onClick={() => { FolderOnClick(item.ID); }}>
                                                    <i className="fa-regular fa-folder fa-xl"></i>
                                                    <span>{item.FolderName}</span>
                                                </div>
                                                <div className='created-time'>
                                                    {DateStringFormat({ stringDate: item.CreatedDate, newFormat: 'dd/mm/yyyy hh:mi:ss', currentFormat: 'yyyy/mm/dd hh:mi:ss' })}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })
                            }
                            {
                                listFile.map((item, index) => {
                                    let fileIcon = '';
                                    if (item.FileType === 1) { fileIcon = 'fa-regular fa-file-word fa-xl'; }
                                    else if (item.FileType === 2) { fileIcon = 'fa-regular fa-file-excel fa-xl'; }
                                    else if (item.FileType === 3) { fileIcon = 'fa-regular fa-file-powerpoint fa-xl'; }
                                    else if (item.FileType === 4) { fileIcon = 'fa-regular fa-file-pdf fa-xl'; }
                                    else if (item.FileType === 5) { fileIcon = 'fa-regular fa-file-image fa-xl'; }

                                    return (
                                        <li data-file-id={item.ID} key={index}>
                                            <div >
                                                <div className='action'>
                                                    <Button size={'lg'} onClick={() => { ConfirmDelete(item.ID, 'file'); }}><Icon icon='Menu' size={'lg'} /></Button>
                                                </div>
                                                <div className='folder' onClick={FileOnClick}>
                                                    <i className={fileIcon}></i>
                                                    <span>{item.FileName}</span>
                                                </div>
                                                <div className='created-time'>
                                                    {DateStringFormat({ stringDate: item.CreatedDate, newFormat: 'dd/mm/yyyy hh:mi:ss', currentFormat: 'yyyy/mm/dd hh:mi:ss' })}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })
                            }

                        </ul>
                    </div>
                </div>
            </Page>
            <Modal
                isOpen={isAddFileModalOpen} // Example: state
                setIsOpen={setIsAddFileModalOpen} // Example: setState
                isStaticBackdrop={true}
                isScrollable={true}
                isCentered={true}
                size={'lg'} // 'sm' || 'lg' || 'xl' 
                fullScreen={'md'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
                isAnimation={true}>
                <ModalHeader
                    setIsOpen={setIsAddFileModalOpen} // Example: setState
                >
                    <ModalTitle id={''}>Add file</ModalTitle>
                </ModalHeader>
                <ModalBody >
                    <div>
                        <div style={innerStyle.FormItem}>
                            <Label style={innerStyle.FormItemLabel} htmlFor={'file-name'}>File name</Label>
                            <Input style={innerStyle.FormItemInput} value={fileName} onChange={FileNameOnChange} autoComplete={'false'} id='file-name' />
                        </div>
                        <div style={innerStyle.FormItem}>
                            <Label style={innerStyle.FormItemLabel} htmlFor={'file'}>Browse</Label>
                            <input type={'hidden'} id={'file-base-64'} value={fileData} />
                            <input type={'file'} ref={fileChoose} id={'file'} style={{}} onChange={BrowseFileOnChange} accept={'image/*,.pdf,.xlsx,.pptx,.docx,.xls,.ppt,.doc'} />

                        </div>
                    </div>
                </ModalBody>
                <ModalFooter  >
                    <Button isOutline color='success' onClick={SaveAddFile}>Save</Button>
                </ModalFooter>
            </Modal>


            <Modal
                isOpen={isAddFolderModalOpen} // Example: state
                setIsOpen={setIsAddFolderModalOpen} // Example: setState
                isStaticBackdrop={true}
                isScrollable={true}
                isCentered={true}
                size={'lg'} // 'sm' || 'lg' || 'xl' 
                fullScreen={'md'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
                isAnimation={true}>
                <ModalHeader
                    setIsOpen={setIsAddFolderModalOpen} // Example: setState
                >
                    <ModalTitle id={''}>Add folder</ModalTitle>
                </ModalHeader>
                <ModalBody >
                    <div>
                        <div style={innerStyle.FormItem}>
                            <Label style={innerStyle.FormItemLabel} htmlFor={'title'}>Folder name</Label>
                            <Input style={innerStyle.FormItemInput} value={folderName} onChange={FolderNameOnChange} autoComplete={'false'} id='title' />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter  >
                    <Button isOutline color='link' onClick={CloseModal}>Close</Button>
                    <Button isOutline color='success' onClick={SaveAddFolder}>Save</Button>
                </ModalFooter>
            </Modal>


            <Modal
                isOpen={isConfirmDeletePopupOpen} // Example: state
                setIsOpen={setIsConfirmDeletePopupOpen} // Example: setState
                isStaticBackdrop={true}
                isScrollable={true}
                isCentered={true}
                size={'lg'} // 'sm' || 'lg' || 'xl' 
                fullScreen={'md'} // true || 'sm' || 'md' || 'lg' || 'xl' || 'xxl' 
                isAnimation={true}>
                <ModalHeader
                    setIsOpen={setIsConfirmDeletePopupOpen} // Example: setState
                >
                    <ModalTitle id={''}>Confirm delete</ModalTitle>
                </ModalHeader>
                <ModalBody >
                    <div>
                        {confirmDeleteMessage}
                    </div>
                </ModalBody>
                <ModalFooter  >
                    <Button isOutline color='link' onClick={CloseModal}>Close</Button>
                    <Button isOutline color='success' onClick={DeleteAccept}>Accept</Button>
                </ModalFooter>
            </Modal>

        </PageWrapper>




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