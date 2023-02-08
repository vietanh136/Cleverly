import React from 'react';
import { RouteProps } from 'react-router-dom';

import DefaultHeader from '../pages/_layout/_headers/DefaultHeader';

const headers: RouteProps[] = [
	{ path: 'auth-pages/login', element: null },
	{ path: 'auth-pages/sign-up', element: null },
	{
		path: `*`,
		element: <DefaultHeader />,
	},
];

export default headers;
