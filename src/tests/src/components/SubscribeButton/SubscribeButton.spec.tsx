import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import React from 'react';
import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { SubscribeButton } from '../../../../components/SubscribeButton';

jest.mock('next-auth/client');
jest.mock('next/router');


describe('SubscribeButton component', () => {
    it('renders correctly', () => {

        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<SubscribeButton />);

        expect(screen.getByText('Subscribe now')).toBeInTheDocument();
    });

    it('redirects user to signin when the use is not authenticated', () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false]);

        const signInMocked = mocked(signIn);

        render(<SubscribeButton />);

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton);

        expect(signInMocked).toHaveBeenCalled();
    });

    it('redirects to posts when the user already has a subscription', () => {

        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([{
            user: {
                name: 'John Doe',
                email: 'john.doe@gmail.com'
            },
            activeSubscription: 'active',
            expires: '60'
        }, false]);

        const useRouterMocked = mocked(useRouter);

        const pushMocked = jest.fn();

        useRouterMocked.mockReturnValueOnce({
            push: pushMocked,
        } as any);

        render(<SubscribeButton />);

        const subscribeButton = screen.getByText('Subscribe now');

        fireEvent.click(subscribeButton);

        expect(pushMocked).toHaveBeenCalledWith('/posts');
    });
});