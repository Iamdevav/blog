import Link from "next/link";
import { BlogItem } from "./types";
import { createClient } from "contentful";
import { getBlogItem } from "@/utils/type-cast.utils";
import Navbar from "./component/navbar";

if (!process.env.SPACE_ID || !process.env.ACCESS_TOKEN) {
  throw new Error("SPACE_ID or ACCESS_TOKEN is not provided");
}
const client = createClient({
  space: process.env.SPACE_ID,
  accessToken: process.env.ACCESS_TOKEN,
});

const getBlogEntries = async (): Promise<BlogItem[]> => {
  const entries = await client.getEntries({ content_type: "blog" });
  const blogItems = entries.items.map((item) => {
    return getBlogItem(item.fields);
  });
  return blogItems;
};

export default async function Home() {
  const blogEntries = await getBlogEntries();
  return (
    <div>
      <Navbar />
      <main className="flex min-h-screen flex-col p-24 gap-y-8">
        <div className="grid grid-cols-2 gap-16">
          {blogEntries.map((singlePost, index) => {
            const { slug, title, date, thumbnail } = singlePost.fields;
            const imageUrl = thumbnail.fields.file.url;
            return (
              <div key={slug} className="bg-white rounded-lg shadow-md flex">
                {imageUrl && (
                  <div className="w-1/2 flex items-center justify-center">
                    <Link className="group" href={`/articles/${slug}`}>
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-auto rounded-t-lg"
                      />
                    </Link>
                  </div>
                )}
                <div className="w-1/2 p-4 flex flex-col justify-between">
                  <Link className="group" href={`/articles/${slug}`}>
                    <h2 className="font-extrabold text-xl group-hover:text-blue-500 transition-colors mb-2">
                      {title}
                    </h2>
                    <span className="text-gray-500 block">
                      Posted on{" "}
                      {new Date(date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
