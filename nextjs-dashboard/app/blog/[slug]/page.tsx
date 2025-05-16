interface BlogPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const BlogPage = async ({ params, searchParams }: BlogPageProps) => {
  const { slug } = await params;
  const { page = "1", sort = "asc", query = "" } = await searchParams;

  return (
    <>
      <div>Blog Post</div>
      <p>{slug}</p>
      <p>Search query: {query}</p>
      <p>Current page: {page}</p>
      <p>Sort order: {sort}</p>
    </>
  );
};

export default BlogPage;
