import React, { FC } from 'react';
import PropTypes from 'prop-types';
import CleverlyLogo from '../assets/logos/83494a00ad04765a2f15.png';
import CleverlyLogoWhiteText from '../assets/logos/83494a00ad04765a2f16.png';
interface ILogoProps {
	width?: number;
	height?: number;
	whiteText?: boolean;
}
const Logo: FC<ILogoProps> = ({ width, height, whiteText }) => {
	return (

		<div style={{ width: '100%', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={whiteText ? CleverlyLogoWhiteText : CleverlyLogo} />
		</div>
	);
};
Logo.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
};
Logo.defaultProps = {
	width: 2155,
	height: 854,
};

export default Logo;
