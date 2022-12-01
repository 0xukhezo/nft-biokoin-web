import Head from "next/head"
import Navbar from "../components/NavBar/Navbar"

export default function Home() {
    return (
        <div>
            <Head>
                <title>BioKoin App</title>
                <meta name="description" content="Biokoin app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
        </div>
    )
}
