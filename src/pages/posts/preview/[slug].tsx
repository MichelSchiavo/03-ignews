import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
// import { getSession } from "next-auth/client";
import Head from "next/head";
import Link from "next/link";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic";

import styles from '../post.module.scss'

interface PostPreviewrops {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

export default function PostPreview({ post }: PostPreviewrops) {
    const [session] = useSession()

    const router = useRouter()

    useEffect(() => {
        router.push(`/posts/${post.slug}`)
    },[session])

    return (
        <>
           <Head>
                <title>{post.title} | Ignews</title>
            </Head> 

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div 
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{ __html: post.content }} 
                    />

                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href="/">
                        <a href="">Subscribe now 🤗</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],//Faz com que todos os pots sejam carregados de acordo com o primeiro acesso ao mesmo.
        // paths: [
        //     { params: { slug: 'take-away-skills'} }
        // ],
        fallback: 'blocking'//fallback recebe 3 opções, true, false e blocking, no true ele deixa a pessoa acessar o conteúdo mesmo que não tenha sido carregado de forma estática direto pelo browser, o false dá um 404 quando a página não for carregada, o blocking executa o código todo no serverside do next e carrega tudo para depois exibir o html em tela.
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params;

    const prismic = getPrismicClient()

    const response = await prismic.getByUID('publitaction', String(slug), {})

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0,3)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return {
        props: {
            post,
        }, 
        revalidate: 60 * 30, //30 minutes
    }
}