

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
		icon: 'sticky_note_2',
		subMenu: {
			customerInformations : {
				id: 'customerInformations',
				text: 'Customer Informations',
				path: 'customer-managements',
				icon: 'sticky_note_2',
				subMenu: null,
			},
			purchaseOrders : {
				id: 'purchaseOrders',
				text: 'Purchase Orders',
				path: 'purchase-orders',
				icon: 'sticky_note_2',
				subMenu: null,
			},
			mailRoom : {
				id: 'mailRoom',
				text: 'Mail Room',
				path: 'mail-room',
				icon: 'sticky_note_2',
				subMenu: null,
			},
			requests: {
				id: 'requests',
				text: 'Requests',
				path: 'requests',
				icon: 'sticky_note_2',
				subMenu: null,
			},
			schedules: {
				id: 'schedules',
				text: 'Schedules',
				path: 'schedules',
				icon: 'sticky_note_2',
				subMenu: null,
			},
			dataRoom: {
				id: 'dataRoom',
				text: 'Data Room',
				path: 'data-room',
				icon: 'sticky_note_2',
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
		icon: 'sticky_note_2',
		subMenu: {
			termAndPolicy : {
				id: 'termAndPolicy',
				text: 'Term and policy',
				path: 'term-and-policy',
				icon: 'sticky_note_2',
				subMenu: null,
			},
			fees : {
				id: 'fees',
				text: 'Fees',
				path: 'fees',
				icon: 'sticky_note_2',
				subMenu: null,
			},
			emailTemplates : {
				id: 'emailTemplates',
				text: 'Email Templates',
				path: 'email-templates',
				icon: 'sticky_note_2',
				subMenu: null,
			},
			configurations : {
				id: 'configurations',
				text: 'Configurations',
				path: 'configurations',
				icon: 'sticky_note_2',
				subMenu: null,
			},			
			businessAccountQuestions : {
				id: 'businessAccountQuestions',
				text: 'Business Account Questions',
				path: 'business-account-questions',
				icon: 'sticky_note_2',
				subMenu: null,
			},
			services: {
				id: 'services',
				text: 'Services',
				path: 'services',
				icon: 'sticky_note_2',
				subMenu: null,
			},
			fields: {
				id: 'fields',
				text: 'Fields',
				path: 'fields',
				icon: 'sticky_note_2',
				subMenu: null,
			},
			faqs: {
				id: 'faqs',
				text: 'FAQs',
				path: 'faqs',
				icon: 'sticky_note_2',
				subMenu: null,
			},
			nomineesDirectorServices: {
				id: 'nomineesDirectorServices',
				text: 'Nominees Director Services',
				path: 'nominees-director-services',
				icon: 'sticky_note_2',
				subMenu: null,
			},
			accountantServices: {
				id: 'accountantServices',
				text: 'Accountant Services',
				path: 'accountant-services',
				icon: 'sticky_note_2',
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
		icon: 'sticky_note_2',
		subMenu: {
			userAccount : {
				id: 'userAccount',
				text: 'User Account',
				path: 'user-account',
				icon: 'sticky_note_2',
				subMenu: null,
			},
			roles : {
				id: 'roles',
				text: 'Roles',
				path: 'roles',
				icon: 'sticky_note_2',
				subMenu: null,
			},
			decentralization : {
				id: 'decentralization',
				text: 'Decentralization',
				path: 'decentralization',
				icon: 'sticky_note_2',
				subMenu: null,
			},
			
		},
	},
}
