import React, { FC, useRef, useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Logo from '../../../components/Logo';
import useDarkMode from '../../../hooks/useDarkMode';
import { useFormik } from 'formik';
import AuthContext from '../../../contexts/authContext';
import USERS, { getUserDataWithUsername } from '../../../common/data/userDummyData';
import Spinner from '../../../components/bootstrap/Spinner';
import Alert from '../../../components/bootstrap/Alert';
import { CheckErrorResponse, CONSTANT, GetObjectProperty } from '../../../helpers/helpers';
import showNotification from '../../../components/extras/showNotification';
import $ from 'jquery';
interface ILoginHeaderProps {
	isNewUser?: boolean;
}
const LoginHeader: FC<ILoginHeaderProps> = ({ isNewUser }) => {

	return (
		<>
			<div className='text-center h1 fw-bold mt-5'>Welcome,</div>
			<div className='text-center h4 text-muted mb-5'>Sign in to continue!</div>
		</>
	);
};

interface ILoginProps {
	isSignUp?: boolean;
}
const Login: FC<ILoginProps> = ({ isSignUp }) => {

	const accountInput = useRef<any>(null);
	const { darkModeStatus } = useDarkMode();

	const [signInPassword, setSignInPassword] = useState<boolean>(false);
	const [singUpStatus, setSingUpStatus] = useState<boolean>(!!isSignUp);

	const [account, setAccount] = useState('');
	const [password, setPassword] = useState('');

	const AccountOnChange = (obj: any) => {
		if (/[^a-zA-Z0-9\b.!$%^&*()\-_,]/.test(obj.target.value)) return;
		if (obj.target.value.length > 255) return;
		setAccount(obj.target.value);
	}
	const PasswordOnChange = (obj: any) => {
		if (/[^a-zA-Z0-9\b.!$%^&*()\-_,]/.test(obj.target.value)) return;
		if (obj.target.value.length > 255) return;
		setPassword(obj.target.value);
	}

	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSubmit = async () => {
		try {
			let model = {
				Account: account,
				Password: password
			}
			let errorCount = 0;

			if (GetObjectProperty(model, 'Account') === '') { errorCount++; showNotification('Warning', 'User name cannot be left blank', 'danger'); }
			if (GetObjectProperty(model, 'Password') === '') { errorCount++; showNotification('Warning', 'Password cannot be left blank', 'danger'); }

			if (errorCount > 0) throw new Error();
			setIsLoading(true);
			const rq = await fetch(CONSTANT.HOST_API_URL + '/user/login', {
				method: 'post',
				headers: CONSTANT.RequestHeaderDefault,
				body: JSON.stringify(model)
			});
			const rs = await rq.json();

			if (CheckErrorResponse(rs) === false) { throw new Error(); }
			localStorage.setItem('userData', JSON.stringify(rs.data));
			localStorage.setItem('userToken', GetObjectProperty(rs.data, 'Token'));

			window.location.href = '/';
		}
		catch (ex) {
			setIsLoading(false);
		}
		
	}
	useEffect(() => {
		const userToken = localStorage.getItem('userToken');
		if (userToken !== '' && userToken !== null && typeof userToken !== 'undefined') {
			window.location.href = '/'
		}
		accountInput.current.focus();
	}, [navigate]);

	return (
		<PageWrapper
			isProtected={false}
			title={'Login'}
			className={'bg-dark'}>
			<Page className='p-0'>
				<div className='row h-100 align-items-center justify-content-center'>
					<div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
						<Card className='shadow-3d-dark' data-tour='login-page'>
							<CardBody>
								<div className='text-center my-5'><Logo width={200} /></div>
								<LoginHeader isNewUser={singUpStatus} />
								<div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
									<FormGroup id='loginUsername' isFloating label='Username' >
										<Input ref={accountInput} value={account} onChange={AccountOnChange} />
									</FormGroup>

									<FormGroup id='loginPassword' isFloating label='Password' >
										<Input type='password' value={password} onChange={PasswordOnChange} />
									</FormGroup>

									<Button color='warning' className='w-100 py-3' isDisable={isLoading} onClick={handleSubmit}>Login</Button>
								</div>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};
Login.propTypes = {
	isSignUp: PropTypes.bool,
};
Login.defaultProps = {
	isSignUp: false,
};

export default Login;
