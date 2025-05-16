const BlogMPage = async ({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) => {
  const { slug } = await params;

  return (
    <>
      <h1>Blog Slug:</h1>
      <p>{slug.join(" / ")}</p>
    </>
  );
};

export default BlogMPage;
