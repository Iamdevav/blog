import Navbar from "@/app/Navbar";
import { BlogItem, AccessToken, SpaceId } from "@/app/types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { createClient } from "contentful";

const accessToken: AccessToken = process.env.ACCESS_TOKEN!;
const spaceId: SpaceId = process.env.SPACE_ID!;

const client = createClient({
  space: spaceId,
  accessToken: accessToken,
});

type BlogPageProps = {
  params: {
    slug: string;
  };
};

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
    select: "fields.title,fields.date,fields.content,fields.thumbnail",
  };
  const queryResult = await client.getEntries(queryOptions);
  return queryResult.items[0];
};

export default async function BlogPage(props: BlogPageProps) {
  const { params } = props;
  const { slug } = params;
  const article = await fetchBlogPost(slug);
  const { title, date, content, thumbnail } = article.fields;

  const imageUrl = `https:${thumbnail.fields.file.url}`;

  return (
    <>
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
          <img
            src={imageUrl}
            alt={title}
            style={{ width: "100%", height: "30%" }}
            className="mb-6 justify-center items-center flex"
          />
          <div className="mb-8 font-extrabold">
            {documentToReactComponents(content)}
          </div>
        </div>
      </main>
    </>
  );
}
