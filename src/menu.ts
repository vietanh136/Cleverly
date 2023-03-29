import React from 'react';

export const dashboardPagesMenu = {
	dashboard: {
		id: 'dashboard',
		text: 'Dashboard',
		path: '/',
		icon: 'Dashboard',
		subMenu: null,
	},
	
};

export const demoPagesMenu = {
	
	auth: {
		id: 'auth',
		text: 'Auth Pages',
		icon: 'Extension',
	},
	login: {
		id: 'login',
		text: 'Login',
		path: 'auth-pages/login',
		icon: 'Login',
	},
	signUp: {
		id: 'signUp',
		text: 'Sign Up',
		path: 'auth-pages/sign-up',
		icon: 'PersonAdd',
	},
	page404: {
		id: 'Page404',
		text: '404 Page',
		path: 'auth-pages/404',
		icon: 'ReportGmailerrorred',
	},
};



export const customerManagementsMenu = {
	customerManagements : {
		id: 'customerManagements',
		text: 'Customer Managements',
		path: 'customer-managements',
		icon: 'fa-solid fa-users-gear',
		subMenu: {
			customerInformations : {
				id: 'customerInformations',
				text: 'Customer Informations',
				path: 'customer-managements',
				icon: 'fa-regular fa-address-book',
				subMenu: null,
			},
			purchaseOrders : {
				id: 'purchaseOrders',
				text: 'Purchase Orders',
				path: 'purchase-orders',
				icon: 'fa-solid fa-file-invoice',
				subMenu: null,
			},
			mailRoom : {
				id: 'mailRoom',
				text: 'Mail Room',
				path: 'mail-room',
				icon: 'fa-solid fa-envelopes-bulk',
				subMenu: null,
			},
			requests: {
				id: 'requests',
				text: 'Requests',
				path: 'requests',
				icon: 'fa-solid fa-clipboard-question',
				subMenu: null,
			},
			schedules: {
				id: 'schedules',
				text: 'Schedules',
				path: 'schedules',
				icon: 'fa-solid fa-calendar-day',
				subMenu: null,
			},
			dataRoom: {
				id: 'dataRoom',
				text: 'Data Room',
				path: 'data-room',
				icon: 'fa-solid fa-hard-drive',
				subMenu: null,
			}
		},
	},
}

export const settingsMenu = {
	settings : {
		id: 'settings',
		text: 'Settings',
		path: 'configurations',
		icon: 'fa-solid fa-screwdriver-wrench',
		subMenu: {
			termAndPolicy : {
				id: 'termAndPolicy',
				text: 'Term and policy',
				path: 'term-and-policy',
				icon: 'fa-solid fa-file-shield',
				subMenu: null,
			},
			fees : {
				id: 'fees',
				text: 'Fees',
				path: 'fees',
				icon: 'fa-solid fa-file-invoice-dollar',
				subMenu: null,
			},
			emailTemplates : {
				id: 'emailTemplates',
				text: 'Email Templates',
				path: 'email-templates',
				icon: 'fa-solid fa-square-envelope',
				subMenu: null,
			},
			configurations : {
				id: 'configurations',
				text: 'Configurations',
				path: 'configurations',
				icon: 'fa-solid fa-sliders',
				subMenu: null,
			},			
			businessAccountQuestions : {
				id: 'businessAccountQuestions',
				text: 'Business Account Questions',
				path: 'business-account-questions',
				icon: 'fa-solid fa-person-circle-question',
				subMenu: null,
			},
			services: {
				id: 'services',
				text: 'Services',
				path: 'services',
				icon: 'fa-solid fa-blender-phone',
				subMenu: null,
			},
			fields: {
				id: 'fields',
				text: 'Fields',
				path: 'fields',
				icon: 'fa-solid fa-braille',
				subMenu: null,
			},
			faqs: {
				id: 'faqs',
				text: 'FAQs',
				path: 'faqs',
				icon: 'fa-regular fa-circle-question',
				subMenu: null,
			},
			nomineesDirectorServices: {
				id: 'nomineesDirectorServices',
				text: 'Nominees Director Services',
				path: 'nominees-director-services',
				icon: 'fa-solid fa-lines-leaning',
				subMenu: null,
			},
			accountantServices: {
				id: 'accountantServices',
				text: 'Accountant Services',
				path: 'accountant-services',
				icon: 'fa-solid fa-cash-register',
				subMenu: null,
			}
		},
	},
}

export const systemMenu = {
	settings : {
		id: 'system',
		text: 'System',
		path: 'user-account',
		icon: 'fa-solid fa-gear',
		subMenu: {
			userAccount : {
				id: 'userAccount',
				text: 'User Account',
				path: 'user-account',
				icon: 'fa-solid fa-users-line',
				subMenu: null,
			},
			roles : {
				id: 'roles',
				text: 'Roles',
				path: 'roles',
				icon: 'fa-solid fa-diagram-project',
				subMenu: null,
			},
			decentralization : {
				id: 'decentralization',
				text: 'Decentralization',
				path: 'decentralization',
				icon: 'fa-solid fa-user-lock',
				subMenu: null,
			},
			
		},
	},
}
