import Head from 'next/head';

import styles from './home.module.scss';

// import styles from '../styles/home.module.scss'

export default function Home() {
  return (    
    <>
      <Head>
        <title>Home | igNews</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome!</span>
          <h1>News about then <span>React</span> world </h1>
          <p>
            Get acess to all the publications <br/>
            <span>For $9.90 month</span>
          </p>
        </section>

        <img src="/images/avatar.svg" alt="Girl coding"/>
      </main>
      </>
  )
}
