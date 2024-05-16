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

      <div className="max-w-lg min-h-screen  overflow-hidden md:max-w-full md:m-20 flex justify-center items-center">
        <main className="flex min-h-screen flex-col gap-y-8 md:mt-16 justify my-20">
          {blogEntries.map((singlePost) => {
            const { slug, title, date, thumbnail } = singlePost.fields;
            const imageUrl = thumbnail.fields.file.url;
            return (
              <div
                key={slug}
                className="md:flex rounded-xl items-center p-6 bg-white shadow-lg"
              >
                {imageUrl && (
                  <div className="md:shrink-0">
                    <Link className="group" href={`/articles/${slug}`}>
                      <img
                        src={imageUrl}
                        alt={title}
                        className="rounded-lg h-48 w-full object-cover md:h-full md:w-48"
                      />
                    </Link>
                  </div>
                )}

                <div className="flex flex-col justify-between p-8">
                  <Link className="group" href={`/articles/${slug}`}>
                    <h2 className="font-extrabold text-xl group-hover:text-blue-500 transition-colors mb-2 ">
                      {title}
                    </h2>
                    <span className="text-gray-500">
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
        </main>
      </div>
    </div>
  );
}
