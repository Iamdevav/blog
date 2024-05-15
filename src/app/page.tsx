import Link from "next/link";
import { BlogItem } from "./types";
import { createClient } from "contentful";

if (!process.env.SPACE_ID || !process.env.ACCESS_TOKEN) {
  throw new Error("SPACE_ID or ACCESS_TOKEN is not provided");
}
const client = createClient({
  space: process.env.SPACE_ID,
  accessToken: process.env.ACCESS_TOKEN,
});

const getBlogEntries = async (): Promise<BlogItem[]> => {
  const entries = await client.getEntries({ content_type: "blog" });

  const blogItemsString = JSON.stringify(entries.items);
  const parsedblogItems = JSON.parse(blogItemsString);
  return parsedblogItems;
};

export default async function Home() {
  const blogEntries = await getBlogEntries();
  console.log("Home -> blogEntries", blogEntries);
  return (
    <main className="flex min-h-screen flex-col p-24 gap-y-8">
      {blogEntries.map((singlePost) => {
        const { slug, title, date } = singlePost.fields;
        return (
          <div key={slug}>
            <Link className="group" href={`/articles/${slug}`}>
              <h2 className="font-extrabold text-xl group-hover:text-blue-500 transition-colors">
                {title}
              </h2>
              <span>
                Posted on{" "}
                {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </Link>
          </div>
        );
      })}
    </main>
  );
}
