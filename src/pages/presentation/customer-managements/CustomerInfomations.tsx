import React, { useState } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { customerManagementsMenu } from '../../../menu';

const OnlyContent = () => {
	const [isUpdateUserModalOpen, setIsUpdateUserModalOpenState] = useState(false);
	const OpenUpdateUserModal = () => {
		setIsUpdateUserModalOpenState(true);

	}
	return (
		<PageWrapper title={customerManagementsMenu.customerManagements.subMenu.customerInformations.text}>
			<Page>
				
			</Page>

			
		</PageWrapper>
	);
};

export default OnlyContent;

