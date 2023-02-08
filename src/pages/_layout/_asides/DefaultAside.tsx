import React, { ReactNode, useContext, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Brand from '../../../layout/Brand/Brand';
import Navigation, { NavigationLine } from '../../../layout/Navigation/Navigation';
import User from '../../../layout/User/User';
import {
	customerManagementsMenu,
	settingsMenu,
	systemMenu,
	dashboardPagesMenu
} from '../../../menu';
import ThemeContext from '../../../contexts/themeContext';
import Aside, { AsideBody, AsideFoot, AsideHead } from '../../../layout/Aside/Aside';

const DefaultAside = () => {
	const { asideStatus, setAsideStatus } = useContext(ThemeContext);

	return (
		<Aside>
			<AsideHead>
				<Brand asideStatus={asideStatus} setAsideStatus={setAsideStatus} />
			</AsideHead>
			<AsideBody>
				<>
				<Navigation menu={dashboardPagesMenu} id='aside-dashboard' />
					<NavigationLine />
					<Navigation menu={customerManagementsMenu} id='aside-customer-managements' />
					<NavigationLine />
					<Navigation menu={settingsMenu} id='aside-settings' />
					<NavigationLine />
					<Navigation menu={systemMenu} id='aside-system' />
				</>
			</AsideBody>
			<AsideFoot>
				<User />
			</AsideFoot>
		</Aside>
	);
};

export default DefaultAside;
