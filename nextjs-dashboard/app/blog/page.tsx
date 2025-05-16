import Link from "next/link";
import Header from "../components/header";

function AboutPage() {
  return (
    <main>
      <Header />
      <h1>Blog Page!</h1>
      <p>🔥 Let&apos;s get started! 🔥</p>
      <Link href="/blog/blog-1">Blog-1</Link>
      <Link href="/blog/blog-2">Blog-2</Link>
      <Link href="/blog/blog-3/blog">Blog-3</Link>
    </main>
  );
}

export default AboutPage;
