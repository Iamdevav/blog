import { BlogItem } from "@/app/types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { createClient } from "contentful";
import { BlogPageProps } from "@/app/types";
import { getBlogItem } from "@/utils/type-cast.utils";
import Navbar from "@/app/component/navbar";

if (!process.env.SPACE_ID || !process.env.ACCESS_TOKEN) {
  throw new Error("SPACE_ID or ACCESS_TOKEN is not provided");
}
const client = createClient({
  space: process.env.SPACE_ID,
  accessToken: process.env.ACCESS_TOKEN,
});

export async function generateStaticParams() {
  const queryOptions = {
    content_type: "blog",
    select: "fields.slug",
  };

  const articles = await client.getEntries(queryOptions);
  return articles.items.map((article) => ({
    slug: article.fields.slug,
  }));
}

const fetchBlogPost = async (slug: string): Promise<BlogItem> => {
  const queryOptions = {
    content_type: "blog",
    "fields.slug[match]": slug,
  };
  const queryResult = await client.getEntries(queryOptions);
  if (queryResult.items.length === 0) {
    throw new Error(`No blog post found with slug '${slug}'.`);
  }

  return getBlogItem(queryResult.items[0].fields);
};

export default async function BlogPage(props: BlogPageProps) {
  const { params } = props;
  const { slug } = params;
  const article = await fetchBlogPost(slug);
  const { title, date, content, thumbnail } = article.fields;
  const imageUrl = `https:${thumbnail.fields.file.url}`;

  return (
    <div>
      <Navbar />
      <main className="min-h-screen p-24 flex justify-center">
        <div className="max-w-2xl">
          <h1 className="font-extrabold text-3xl mb-2">{title}</h1>
          <p className="mb-6 text-slate-400 ">
            Posted on{" "}
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <img src={imageUrl} alt={title} width={500} height={300} />
          <div className="mb-8 font-extrabold">
            {documentToReactComponents(content)}
          </div>
        </div>
      </main>
    </div>
  );
}
