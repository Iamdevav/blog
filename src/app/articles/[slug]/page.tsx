import { BlogFields } from "@/app/types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { createClient, EntrySkeletonType } from "contentful";
import { BlogPageProps } from "@/app/types";
import { Document, BLOCKS, TopLevelBlock } from "@contentful/rich-text-types";

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

const fetchBlogPost = async (slug: string): Promise<BlogFields> => {
  const queryOptions = {
    content_type: "blog",
    "fields.slug[match]": slug,
  };
  const queryResult = await client.getEntries(queryOptions);
  // Ensure that at least one item is returned
  if (queryResult.items.length === 0) {
    throw new Error(`No blog post found with slug '${slug}'.`);
  }

  const blogFieldsString = JSON.stringify(queryResult.items[0].fields);
  const parsedblogFields = JSON.parse(blogFieldsString);

  const { date, title, content } = parsedblogFields;

  // Return BlogFields
  return {
    title: title,
    slug: slug,
    date: new Date(date),
    mainNodeType: content.nodeType,
    mainData: content.data,
    contents: content.content,
  };
  // return queryResult.items[0].fields;
};

export default async function BlogPage(props: BlogPageProps) {
  const { params } = props;
  const { slug } = params;
  const article = await fetchBlogPost(slug);
  const { title, date, mainNodeType, mainData, contents } = article;

  // Initialize an array to store the content nodes
  const contentNodes: TopLevelBlock[] = [];

  // Iterate over the content array and create nodes based on the nodeType
  contents.forEach((item: any) => {
    switch (item.nodeType) {
      case "paragraph":
        contentNodes.push({
          nodeType: BLOCKS.PARAGRAPH,
          content: item.content,
          data: item.data,
        });
        break;
      case "heading-3":
        contentNodes.push({
          nodeType: BLOCKS.HEADING_3,
          content: item.content,
          data: item.data,
        });
        break;
      // Add cases for other nodeTypes as needed
    }
  });

  // Create the Document object
  const document: Document = {
    nodeType: BLOCKS.DOCUMENT,
    data: mainData,
    content: contentNodes,
  };

  return (
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
        <div className="[&>p]:mb-8 [&>h2]:font-extrabold">
          {documentToReactComponents(document)}
        </div>
      </div>
    </main>
  );
}
