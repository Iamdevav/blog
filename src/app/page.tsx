import Link from "next/link";
import { BlogQueryResult, AccessToken, SpaceId } from "./types";
import { createClient } from "contentful";
import Navbar from "./Navbar";

const accessToken: AccessToken = process.env.ACCESS_TOKEN!;
const spaceId: SpaceId = process.env.SPACE_ID!;

const client = createClient({
  space: spaceId,
  accessToken: accessToken,
});
const getBlogEntries = async (): Promise<BlogQueryResult> => {
  const entries = await client.getEntries({ content_type: "blog" });
  return entries;
};

export default async function Home() {
  const blogEntries = await getBlogEntries();

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <main className="flex min-h-screen flex-col p-20 items-center gap-y-8">
          {blogEntries.items.map((singlePost) => {
            if (singlePost.fields) {
              const { slug, title, date, thumbnail } = singlePost.fields;

              const imageUrl =
                thumbnail &&
                thumbnail.fields &&
                thumbnail.fields.file &&
                thumbnail.fields.file.url;

              return (
                <div
                  key={slug}
                  className="bg-white rounded-lg shadow-md p-6 flex w-1/2"
                >
                  {imageUrl && (
                    <div className="w-1/5 mr-6">
                      <Link className="group" href={`/articles/${slug}`}>
                        <img
                          src={imageUrl}
                          alt={title}
                          className="w-full h-auto rounded-lg"
                        />
                      </Link>
                    </div>
                  )}

                  <div className="flex flex-col justify-between">
                    <Link className="group" href={`/articles/${slug}`}>
                      <h2 className="font-extrabold text-xl group-hover:text-blue-500 transition-colors mb-2">
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
            } else {
              console.error("Fields are undefined for post:", singlePost);
              return null;
            }
          })}
        </main>
      </div>
    </>
  );
}
