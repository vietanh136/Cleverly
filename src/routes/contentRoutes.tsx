import React, { lazy } from 'react';
import { RouteProps } from 'react-router-dom';
import { customerManagementsMenu, dashboardPagesMenu, settingsMenu, systemMenu, demoPagesMenu } from '../menu';
import Login from '../pages/presentation/auth/Login';
const CUSTOMER_MANAGEMENTS = {
	CUSTOMER_INFORMATIONS: lazy(() => import('../pages/presentation/customer-managements/CustomerInfomations')),
	DATA_ROOM: lazy(() => import('../pages/presentation/customer-managements/DataRoom')),
	DATA_ROOM_UPDATE: lazy(() => import('../pages/presentation/customer-managements/components/dataRoom/UpdateDataRoom')),
	MAIL_ROOM: lazy(() => import('../pages/presentation/customer-managements/MailRoom')),
	PURCHASE_ORDERS: lazy(() => import('../pages/presentation/customer-managements/PurchaseOrders')),
	REQUESTS: lazy(() => import('../pages/presentation/customer-managements/Requests')),
	REQUESTS_DETAIL: lazy(() => import('../pages/presentation/customer-managements/RequestsDetail')),
	SCHEDULES: lazy(() => import('../pages/presentation/customer-managements/Schedules'))
};

const HOME = {
	DASHBOARD: lazy(() => import('../pages/presentation/dashboard/DashboardPage')),
	LOGIN: lazy(() => import('../pages/presentation/auth/Login')),
};

const SETTINGS = {
	TERM_AND_POLICY: lazy(() => import('../pages/presentation/settings/TermAndPolicy')),
	FEES: lazy(() => import('../pages/presentation/settings/Fees')),
	ACCOUNTANT_SERVICES: lazy(() => import('../pages/presentation/settings/AccountantServices')),
	BUSINESS_ACCOUNT_QUESTIONS: lazy(() => import('../pages/presentation/settings/BusinessAccountQuestions')),
	CONFIGURATIONS: lazy(() => import('../pages/presentation/settings/Configurations')),
	EMAIL_TEMPLATES: lazy(() => import('../pages/presentation/settings/EmailTemplates')),
	FAQS: lazy(() => import('../pages/presentation/settings/FAQs')),
	FIELDS: lazy(() => import('../pages/presentation/settings/Fields')),
	NOMINEES_DIRECTOR_SERVICES: lazy(() => import('../pages/presentation/settings/NomineesDirectorServices')),
	SERVICES: lazy(() => import('../pages/presentation/settings/Services'))
};


const SYSTEM = {
	DECENTRALIZATION: lazy(() => import('../pages/presentation/system/Decentralization')),
	ROLES: lazy(() => import('../pages/presentation/system/Roles')),
	USER_ACCOUNT: lazy(() => import('../pages/presentation/system/UserAccount'))
};

const presentation: RouteProps[] = [
	{
		path: dashboardPagesMenu.dashboard.path,
		element: <HOME.DASHBOARD />
	},
	{
		path: demoPagesMenu.login.path,
		element: <HOME.LOGIN />
	},
	/*
	* Customer Managements
	*/
	{
		path: customerManagementsMenu.customerManagements.subMenu.customerInformations.path,
		element: <CUSTOMER_MANAGEMENTS.CUSTOMER_INFORMATIONS />
	},
	{
		path: customerManagementsMenu.customerManagements.subMenu.dataRoom.path,
		element: <CUSTOMER_MANAGEMENTS.DATA_ROOM />
	},
	{
		path: customerManagementsMenu.customerManagements.subMenu.dataRoom.path + '/update',
		element: <CUSTOMER_MANAGEMENTS.DATA_ROOM_UPDATE />
	},
	{
		path: customerManagementsMenu.customerManagements.subMenu.mailRoom.path,
		element: <CUSTOMER_MANAGEMENTS.MAIL_ROOM />
	},
	{
		path: customerManagementsMenu.customerManagements.subMenu.purchaseOrders.path,
		element: <CUSTOMER_MANAGEMENTS.PURCHASE_ORDERS />
	},
	{
		path: customerManagementsMenu.customerManagements.subMenu.requests.path,
		element: <CUSTOMER_MANAGEMENTS.REQUESTS />
	},
	{
		path: customerManagementsMenu.customerManagements.subMenu.requests.path + '/detail',
		element: <CUSTOMER_MANAGEMENTS.REQUESTS_DETAIL />
	},
	{
		path: customerManagementsMenu.customerManagements.subMenu.schedules.path,
		element: <CUSTOMER_MANAGEMENTS.SCHEDULES />
	},

	/*
	* Settings
	*/
	{
		path: settingsMenu.settings.subMenu.termAndPolicy.path,
		element: <SETTINGS.TERM_AND_POLICY />
	},
	{
		path: settingsMenu.settings.subMenu.fees.path,
		element: <SETTINGS.FEES />
	},
	{
		path: settingsMenu.settings.subMenu.accountantServices.path,
		element: <SETTINGS.ACCOUNTANT_SERVICES />
	},
	{
		path: settingsMenu.settings.subMenu.businessAccountQuestions.path,
		element: <SETTINGS.BUSINESS_ACCOUNT_QUESTIONS />
	},
	{
		path: settingsMenu.settings.subMenu.configurations.path,
		element: <SETTINGS.CONFIGURATIONS />
	},
	{
		path: settingsMenu.settings.subMenu.emailTemplates.path,
		element: <SETTINGS.EMAIL_TEMPLATES />
	},
	{
		path: settingsMenu.settings.subMenu.faqs.path,
		element: <SETTINGS.FAQS />
	},
	{
		path: settingsMenu.settings.subMenu.fields.path,
		element: <SETTINGS.FIELDS />
	},
	{
		path: settingsMenu.settings.subMenu.nomineesDirectorServices.path,
		element: <SETTINGS.NOMINEES_DIRECTOR_SERVICES />
	},
	{
		path: settingsMenu.settings.subMenu.services.path,
		element: <SETTINGS.SERVICES />
	},

	/* 
	* System 
	*/
	{
		path: systemMenu.settings.subMenu.userAccount.path,
		element: <SYSTEM.USER_ACCOUNT />
	},
	{
		path: systemMenu.settings.subMenu.decentralization.path,
		element: <SYSTEM.DECENTRALIZATION />
	},
	{
		path: systemMenu.settings.subMenu.roles.path,
		element: <SYSTEM.ROLES />
	},



];

const contents = [...presentation];

export default contents;
