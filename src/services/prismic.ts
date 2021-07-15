import Prismic from '@prismicio/client';


export function GetPrismicClient(req?: unknown) {
    return Prismic.client(
        process.env.PRISMIC_ENDPOINT,
        { 
            req: req,
            accessToken: process.env.PRISMIC_ACCESS_TOKEN,
        }
    );
}