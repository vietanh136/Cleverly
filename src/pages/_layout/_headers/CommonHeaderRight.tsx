import React, { FC, ReactNode, useContext, useLayoutEffect, useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useTour } from '@reactour/tour';
import Button, { IButtonProps } from '../../../components/bootstrap/Button';
import { HeaderRight } from '../../../layout/Header/Header';
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from '../../../components/bootstrap/OffCanvas';
import Alert from '../../../components/bootstrap/Alert';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Icon from '../../../components/icon/Icon';
import ThemeContext from '../../../contexts/themeContext';
import LANG, { getLangWithKey, ILang } from '../../../lang';
import showNotification from '../../../components/extras/showNotification';
import useDarkMode from '../../../hooks/useDarkMode';
import Popovers from '../../../components/bootstrap/Popovers';
import Spinner from '../../../components/bootstrap/Spinner';
import { CONSTANT, DateStringFormat, GetObjectProperty, SendGetRequest } from '../../../helpers/helpers';
import $ from 'jquery';
interface ICommonHeaderRightProps {
	beforeChildren?: ReactNode;
	afterChildren?: ReactNode;
}
const CommonHeaderRight: FC<ICommonHeaderRightProps> = ({ beforeChildren, afterChildren }) => {
	const { darkModeStatus, setDarkModeStatus } = useDarkMode();

	const { fullScreenStatus, setFullScreenStatus } = useContext(ThemeContext);
	const styledBtn: IButtonProps = {
		color: darkModeStatus ? 'dark' : 'light',
		hoverShadow: 'default',
		isLight: !darkModeStatus,
		size: 'lg',
	};

	const [currentPage, setCurrentPage] = useState(1);
	const [hasLoadMore, setHasLoadMore] = useState(false);
	const [listNotification, setListNotification] = useState<any[]>([]);

	const LoadNotification = async () => {
		let rs = await SendGetRequest(`/notification/GetListNotification?page=${currentPage}`);
		if (GetObjectProperty(rs, 'status') !== CONSTANT.ResponseStatus.SUCCESS) return;
		if (currentPage >= rs.data.totalPage) setHasLoadMore(false);
		else setHasLoadMore(true);
		if(currentPage === 1) { 
			setListNotification(rs.data.listData);
		}else {
			setListNotification([...listNotification,...rs.data.listData]);
		}
		setTimeout(() => {
			var el = document.getElementsByClassName("offcanvas-body")[0];
			el.scrollTop = el.scrollHeight;
		}, 500);
	}

	const [offcanvasStatus, setOffcanvasStatus] = useState(false);

	const { i18n } = useTranslation();

	const changeLanguage = (lng: ILang['key']['lng']) => {
		i18n.changeLanguage(lng).then();
		showNotification(
			<span className='d-flex align-items-center'>
				<Icon icon={getLangWithKey(lng)?.icon} size='lg' className='me-1' />
				<span>{`Language changed to ${getLangWithKey(lng)?.text}`}</span>
			</span>,
			'You updated the language of the site. (Only "Aside" was prepared as an example.)',
		);
	};

	/**
	 * Language attribute
	 */
	useLayoutEffect(() => {
		document.documentElement.setAttribute('lang', i18n.language.substring(0, 2));
	});

	useEffect(()=>{
		LoadNotification();
	},[currentPage])

	const { setIsOpen } = useTour();

	return (
		<HeaderRight>
			<div className='row g-3'>
				{beforeChildren}

				{/* Dark Mode */}
				<div className='col-auto'>
					<Popovers trigger='hover' desc='Dark / Light mode'>
						<Button
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...styledBtn}
							onClick={() => setDarkModeStatus(!darkModeStatus)}
							className='btn-only-icon'
							data-tour='dark-mode'>
							<Icon
								icon={darkModeStatus ? 'DarkMode' : 'LightMode'}
								color={darkModeStatus ? 'info' : 'warning'}
								className='btn-icon'
							/>
						</Button>
					</Popovers>
				</div>

				{/*	Full Screen */}
				<div className='col-auto'>
					<Popovers trigger='hover' desc='Fullscreen'>
						<Button
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...styledBtn}
							icon={fullScreenStatus ? 'FullscreenExit' : 'Fullscreen'}
							onClick={() => setFullScreenStatus(!fullScreenStatus)}
							aria-label='Toggle dark mode'
						/>
					</Popovers>
				</div>



				{/*	Notifications */}
				<div className='col-auto'>
					<Button
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...styledBtn}
						icon='Notifications'
						onClick={() => setOffcanvasStatus(true)}
						aria-label='Notifications'
					/>
				</div>
				{afterChildren}
			</div>

			<OffCanvas
				id='notificationCanvas'
				titleId='offcanvasExampleLabel'
				placement='end'
				isOpen={offcanvasStatus}
				setOpen={setOffcanvasStatus}>
				<OffCanvasHeader setOpen={setOffcanvasStatus}>
					<OffCanvasTitle id='offcanvasExampleLabel'>Notifications</OffCanvasTitle>
				</OffCanvasHeader>
				<OffCanvasBody>
					{
						listNotification.length <= 0 ? <Alert isLight color='light' className='flex-nowrap'>
							You don't have any notìication.
						</Alert> :
							listNotification.map((item, index) => {
								return (
									<Alert key={index} isLight color='dark' className='flex-nowrap'>
										<div style={{width:'100%'}}>

											<div>
												{GetObjectProperty(item, 'UserName') + ' ' + GetObjectProperty(item, 'Actions')}
											</div>
											<div style={{fontSize:11,paddingTop:5,textAlign:'right'}}>
												{DateStringFormat({ stringDate: GetObjectProperty(item, 'LogTime')  , currentFormat : 'yyyy/mm/dd hh:mi:ss' , newFormat : 'dd/mm/yyyy hh:mi:ss'}) }
											</div>
										</div>

									</Alert>
								);
							})
					}
				</OffCanvasBody>
				{
					hasLoadMore ? <Button isLink onClick={() => {
						 setCurrentPage(currentPage+1); }}>
						{'Load more'}
					</Button> : null
				}

			</OffCanvas>
		</HeaderRight>
	);
};
CommonHeaderRight.propTypes = {
	beforeChildren: PropTypes.node,
	afterChildren: PropTypes.node,
};
CommonHeaderRight.defaultProps = {
	beforeChildren: null,
	afterChildren: null,
};

export default CommonHeaderRight;
