import React, { useState } from 'react';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import { customerManagementsMenu } from '../../../menu';
import Card, { CardActions, CardBody, CardFooter, CardHeader, CardLabel } from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';

const OnlyContent = () => {

	const OpenUpdateUserModal = () => {


	}
	return (
		<PageWrapper title={'Customer Infomation'}>
			<Page>
				<Card stretch={'full'}>
					<CardHeader>
						<CardLabel>{customerManagementsMenu.customerManagements.subMenu.customerInformations.text}</CardLabel>
						<CardActions>
							<Button isLight title='Add new' icon='Add' isOutline color='success' onClick={OpenUpdateUserModal}>Add new</Button>
						</CardActions>
					</CardHeader>
					<CardBody isScrollable className='table-responsive'>

					</CardBody>
					<CardFooter>


					</CardFooter>
				</Card>
			</Page>
		</PageWrapper>
	);
};

export default OnlyContent;

