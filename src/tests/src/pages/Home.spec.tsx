import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import React from 'react';
import { useSession } from 'next-auth/client';
import Home, { getStaticProps } from '../../../pages';
import { stripe } from '../../../services/stripe';

jest.mock('next-auth/client');
jest.mock('next/router');
jest.mock('../../../services/stripe');


describe('Home page', () => {
    it('renders correctly', () => {

        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<Home product={{ priceId: 'fake-price-id', amount: '$10.00' }} />);

        expect(screen.getByText('for $10.00 month')).toBeInTheDocument();
    });

    it('loads initial data', async () => {
        const retrievePricesStripeMocked = mocked(stripe.prices.retrieve);

        retrievePricesStripeMocked.mockResolvedValueOnce({
            id: 'fake-prices-id',
            unit_amount: 1000
        } as any);

        const response = await getStaticProps({});

        expect(response).toEqual(
            expect.objectContaining({
                props: { product: { priceId: 'fake-prices-id', amount: '$10.00' } }
            })
        );

    });
});