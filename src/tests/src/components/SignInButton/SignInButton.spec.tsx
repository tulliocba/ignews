import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useSession } from 'next-auth/client';
import React from 'react';
import { SignInButton } from '../../../../components/SignInButton';

jest.mock('next-auth/client');


describe('SignInButton component', () => {
    it('renders correctly when user is not authenticated', () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<SignInButton />);

        expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
    });

    it('renders correctly when user is authenticated', () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValue([{
            user: {
                name: 'John Doe',
                email: 'john.doe@gmail.com'
            }, 
            expires: '60'
        }, false]);

        render(<SignInButton />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
});