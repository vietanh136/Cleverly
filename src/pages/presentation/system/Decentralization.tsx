import React from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { systemMenu } from '../../../menu';

const OnlyContent = () => {
	return (
		<PageWrapper title={systemMenu.settings.subMenu.decentralization.text}>
			<Page>
				<div className='row d-flex align-items-center h-100'>
					<div
						className='col-12 d-flex justify-content-center'
						style={{ fontSize: 'calc(3rem + 3vw)' }}>
						<p>
                        Decentralization
						</p>
					</div>
					
				</div>
			</Page>
		</PageWrapper>
	);
};

export default OnlyContent;
