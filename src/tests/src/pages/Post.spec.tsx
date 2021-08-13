import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import React from 'react';
import Post, { getServerSideProps } from '../../../pages/posts/[slug]';
import { GetPrismicClient } from '../../../services/prismic';
import { redirect } from 'next/dist/next-server/server/api-utils';
import { getSession } from 'next-auth/client';

jest.mock('../../../services/prismic');
jest.mock('next-auth/client');


const post = {
    slug: 'fake-slug',
    title: 'fake-title',
    content: '<p>fake content<p>',
    updatedAt: '10 de Abril',
};

describe('Posts Slug page', () => {
    it('renders correctly', () => {

        render(<Post post={post} />);

        expect(screen.getByText('fake-title')).toBeInTheDocument();
        expect(screen.getByText('fake content')).toBeInTheDocument();
    });

    it('redirects user if no subscription is found', async () => {

        const getSessionMocked = mocked(getSession);

        getSessionMocked.mockResolvedValueOnce(null);

        const response = await getServerSideProps({
            params: { slug: 'my-new-post' }
        } as any);


        expect(response).toEqual(
            expect.objectContaining({
                redirect: {
                    destination: '/',
                    permanent: false
                }
            })
        );
    });

    it('loads initial data', async () => {

        const getPrismicClientMocked = mocked(GetPrismicClient);

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [{
                        type: 'heading', text: 'my new post'
                    }],
                    content: [
                        { type: 'paragraph', text: 'post content' }
                    ],
                },
                last_publication_date: '04-01-2021'
            } as any)
        } as any);

        const getSessionMocked = mocked(getSession);
        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-subscription'
        } as any);

        const response = await getServerSideProps({
            params: { slug: 'my-new-post' }
        } as any);


        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        content: "<p>post content</p>", 
                        slug: "my-new-post", 
                        title: "my new post", 
                        updatedAt: "01 de abril de 2021"
                    }
                }
            })
        );

    });
});