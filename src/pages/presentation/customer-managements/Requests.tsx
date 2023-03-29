import React, { useEffect, useState } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { customerManagementsMenu } from '../../../menu';
import Card, { CardActions, CardBody, CardFooter, CardHeader, CardLabel } from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Popovers from '../../../components/bootstrap/Popovers';
import { CheckErrorResponse, CONSTANT, DateStringFormat, GetObjectProperty, SendGetRequest, ToggleDropdown, CloseAllDropup } from '../../../helpers/helpers';
import Badge from '../../../components/bootstrap/Badge';
import TagWrapper from '../../../components/TagWrapper';
import Select from '../../../components/bootstrap/forms/Select';
import Option from '../../../components/bootstrap/Option';
import Input from '../../../components/bootstrap/forms/Input';

const OnlyContent = () => {
	const [listData, setListData] = useState<any[]>([]);
	const [curentPage, setCurentPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);
	const [rowPerPage, setRowPerPage] = useState(CONSTANT.RowPerPage[0]);
	const [status, setStatus] = useState('-1');
	const GoToDetail = (id: string) => {
		window.location.href = '/requests/detail?id=' + id;
	}

	const LoadListData = async () => {
		let rs = await SendGetRequest(`/Enquiry/GetListEnquiry?page=${curentPage}&status=${status}&rowPerPage=${rowPerPage}`);
		if (!CheckErrorResponse(rs)) return;
		setTotalPage(rs.data.totalPage);
		setListData(rs.data.listData);
	}

	const StatusOnChange = (e: any) => {
		setStatus(e.target.value);
	}

	useEffect(() => {
		LoadListData();
	}, [status, curentPage, rowPerPage])

	const RowPerPageChange = (e: any) => {
		let size = $(e.target).val();
		if (size !== '' && size !== undefined) {
			setRowPerPage(parseInt(size + '')); setCurentPage(1);
			LoadListData();
		}

	}
	return (
		<PageWrapper title={customerManagementsMenu.customerManagements.subMenu.requests.text}>
			<Page>
				<Card stretch={'full'} onClick={CloseAllDropup} >
					<CardHeader>
						<div>
							<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
								<div style={{ width: 120 }}>{'Row per page'}</div>
								<Select ariaLabel={''}
									value={rowPerPage + ''}
									style={{width:100}}
									onChange={RowPerPageChange} >
									{
										CONSTANT.RowPerPage.map((item, index) => {
											return (<Option key={index} value={item}>{item + ''}</Option>)
										})

									}
								</Select>
							</div>

							<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',marginTop:10 }}>
								<div style={{ width: 120 }}>{'Status'}</div>
								<Select
									style={{ width: 100 }}
									list={[{ text: 'All', value: '-1' }, { text: 'Solved', value: '3' }]}
									onChange={StatusOnChange}
									value={status} ariaLabel={''} />
							</div>
						</div>



						<div>

						</div>


					</CardHeader>
					<CardBody isScrollable className='table-responsive'>

						<table className='table table-modern table-hover'>
							<thead>
								<tr>
									<th style={{ width: 60 }}>No</th>
									<th style={{ width: 60 }}></th>
									<th>From</th>
									<th>Title</th>
									<th>Created date</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{
									listData.map((item, index) => {

										let enquiryStatus = <Badge className="" color="danger" rounded="pill">Unread</Badge>
										if (item.IsCustomer === true) enquiryStatus = <Badge className="" color="success" rounded="pill">Read</Badge>

										return (
											<tr key={index}>
												<td>{((curentPage - 1) * CONSTANT.NUMBER.ROW_PER_PAGE + index + 1)}</td>
												<td>
												
													<div className="dropup" data-id={item.ID} >
														<button type="button" className="btn " aria-expanded="true" onClick={ToggleDropdown}><i className="fa-solid fa-bars"></i></button>
														<ul style={{ zIndex: 5, position: 'absolute', display: 'none', flexDirection: 'column', backgroundColor: '#dbddd8', padding: 0, margin: 0, borderRadius: 10, borderWidth: .5, borderColor: '#00000020 !important' }}>
															<Button onClick={() => { GoToDetail(item.ID) }}>Detail</Button>
														</ul>
													</div>
												</td>
												<td>{item.UserName}</td>
												<td>{item.Title}</td>
												<td>{DateStringFormat({ stringDate: GetObjectProperty(item, 'SentDate'), newFormat: 'dd/mm/yyyy hh:mi:ss', currentFormat: 'yyyy/mm/dd hh:mi:ss' })}</td>
												<td><TagWrapper tag="h5">{enquiryStatus}</TagWrapper></td>
											</tr>
										);
									})
								}
							</tbody>
						</table>
					</CardBody>
					<CardFooter>

						<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
							<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
								<Input type='number' value={curentPage} style={{ width: 80 }} onChange={(e: any) => { if (GetObjectProperty(e.target, 'value') > 0 && GetObjectProperty(e.target, 'value') <= totalPage) setCurentPage(e.target.value); }} /> / {totalPage}
							</div>
						</div>
					</CardFooter>
				</Card>

			</Page>
		</PageWrapper>
	);
};

export default OnlyContent;
