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

interface ILoginHeaderProps {
	isNewUser?: boolean;
}
const LoginHeader: FC<ILoginHeaderProps> = ({ isNewUser }) => {
	if (isNewUser) {
		return (
			<>
				<div className='text-center h1 fw-bold mt-5'>Create Account,</div>
				<div className='text-center h4 text-muted mb-5'>Sign up to get started!</div>
			</>
		);
	}
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
	const { setUser } = useContext(AuthContext);
	const accountInput = useRef<any>(null);

	const { darkModeStatus } = useDarkMode();

	const [signInPassword, setSignInPassword] = useState<boolean>(false);
	const [singUpStatus, setSingUpStatus] = useState<boolean>(!!isSignUp);

	const [account, setAccount] = useState('');
	const [password, setPassword] = useState('');

	const AccountOnChange = (obj: any) => { setAccount(obj.target.value); }
	const PasswordOnChange = (obj: any) => { setPassword(obj.target.value); }

	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSubmit = () => {
		localStorage.setItem('userToken', 'x');

		//window.location.reload();
		window.location.href = '/'
	}
	useEffect(() => {
		const userToken = localStorage.getItem('userToken');


		if (userToken !== '' && userToken !== null && typeof userToken !== 'undefined') {
			navigate('/');
		}
		accountInput.current.focus();
		return () => { };
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
									<FormGroup
										id='loginUsername'
										isFloating
										label='Your email or username'
									>
										<Input
											ref={accountInput}
											value={account}
											onChange={AccountOnChange}
										/>
									</FormGroup>

									<FormGroup
										id='loginPassword'
										isFloating
										label='Password'
									>
										<Input
											type='password'
											value={password}
											onChange={PasswordOnChange}
										/>
									</FormGroup>

									<Button
										color='warning'
										className='w-100 py-3'
										onClick={handleSubmit}>
										Login
									</Button>
								</div>


							</CardBody>
						</Card>
						<div className='text-center'>
							<a
								href='/'
								className={classNames('text-decoration-none me-3', {
									'link-light': singUpStatus,
									'link-dark': !singUpStatus,
								})}>
								Privacy policy
							</a>
							<a
								href='/'
								className={classNames('link-light text-decoration-none', {
									'link-light': singUpStatus,
									'link-dark': !singUpStatus,
								})}>
								Terms of use
							</a>
						</div>
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
