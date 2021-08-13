import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import React from 'react';
import Posts, { getStaticProps } from '../../../pages/posts';
import { GetPrismicClient } from '../../../services/prismic';

jest.mock('../../../services/prismic');


const posts = [{
    slug: 'fake-slug',
    title: 'fake-title',
    excerpt: 'fake excerpt',
    updatedAt: '10 de Abril',
}];

describe('Posts page', () => {
    it('renders correctly', () => {

        render(<Posts posts={posts} />);

        expect(screen.getByText('fake-title')).toBeInTheDocument();
    });

    it('loads initial data', async () => {

        const getPrismicClientMocked = mocked(GetPrismicClient);

        getPrismicClientMocked.mockReturnValueOnce(
            {
                query: jest.fn().mockResolvedValueOnce({
                    results: [{
                        uid: 'fake-uid',
                        data: {
                            title: [{
                                type: 'heading', text: 'my new post'
                            }],
                            content: [
                                { type: 'paragraph', text: 'post exerpt' }
                            ],
                        },
                        last_publication_date: '04-01-2021'
                    }]
                })
            } as any
        );

        const response = await getStaticProps({});

        expect(response).toEqual(
            expect.objectContaining({
                props:
                {
                    posts: [
                        {
                            slug: "fake-uid",
                            title: "my new post",
                            excerpt: "post exerpt",
                            updatedAt: "01 de abril de 2021"
                        }]
                }
            })
        );
    });
});