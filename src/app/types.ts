import { Document } from "@contentful/rich-text-types";
export type Thumbnail = {
  fields: {
    file: {
      url: string;
    };
  };
};

export type BlogItem = {
  fields: {
    title: string;
    slug: string;
    date: Date;
    content: Document;
    thumbnail: Thumbnail;
  };
};
export type BlogItems = ReadonlyArray<BlogItem>;

export type BlogQueryResult = {
  items: BlogItems;
};
export type AccessToken = string;
export type SpaceId = string;
