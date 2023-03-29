import React from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { settingsMenu } from '../../../menu';

const OnlyContent = () => {
	return (
		<PageWrapper title={settingsMenu.settings.subMenu.accountantServices.text}>
			<Page>
				<div className='row d-flex align-items-center h-100'>
					<div
						className='col-12 d-flex justify-content-center'
						style={{ fontSize: 'calc(3rem + 3vw)' }}>
						<p>
                        Accountant Services
						</p>
					</div>
					
				</div>
			</Page>
		</PageWrapper>
	);
};

export default OnlyContent;
