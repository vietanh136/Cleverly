import React, { createContext, FC, ReactNode, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { IUserProps } from '../common/data/userDummyData';

export interface IAuthContextProps {
	userToken: string;
	setUserToken?(token: string) : void;
	userData: Partial<IUserProps>;
}
const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

interface IAuthContextProviderProps {
	children: ReactNode;
}
export const AuthContextProvider: FC<IAuthContextProviderProps> = ({ children }) => {
	const [userToken, setUserToken] = useState<string>(localStorage.getItem('userToken') || '');
	const [userData, setUserData] = useState<Partial<IUserProps>>({});

	const value = useMemo(
		() => ({
			userToken,
			setUserToken,
			userData
		}),
		[userToken,setUserToken,userData],
	);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
AuthContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export default AuthContext;
