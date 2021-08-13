import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import React from 'react';
import Post, { getStaticProps } from '../../../pages/posts/preview/[slug]';
import { GetPrismicClient } from '../../../services/prismic';
import { redirect } from 'next/dist/next-server/server/api-utils';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

jest.mock('../../../services/prismic');
jest.mock('next/router');
jest.mock('next-auth/client');


const post = {
    slug: 'fake-slug',
    title: 'fake-title',
    content: '<p>fake content<p>',
    updatedAt: '10 de Abril',
};

describe('Posts Slug page', () => {
    it('renders correctly', () => {
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce([null, false]);

        render(<Post post={post} />);

        expect(screen.getByText('fake-title')).toBeInTheDocument();
        expect(screen.getByText('fake content')).toBeInTheDocument();
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
    });

    it('redirects the user to full post when the user is subscribed', async () => {

        const useSessionMoked = mocked(useSession);

        useSessionMoked.mockReturnValueOnce([{
           activeSubscription: 'fake-subscription'
        }, false] as any);

        const useRouterMocked = mocked(useRouter)

        const pushMock = jest.fn()
    
        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any);

        render(<Post post={post} />);

        expect(pushMock).toHaveBeenCalledWith('/posts/fake-slug');
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

        const response = await getStaticProps({
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