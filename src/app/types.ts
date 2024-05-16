import { Document } from '@contentful/rich-text-types';
import { EntrySkeletonType } from "contentful";

export type ExtendedBlogItem = BlogItem & EntrySkeletonType;

export type BlogItem = {
  fields: {
    title: string;
    slug: string;
    date: Date;
    content: Document;
    thumbnail: ImageData
  }
}

export type ImageData = {
  fields: {
    file: {
      url: string;
    }
  }
}

export type BlogItems = ReadonlyArray<BlogItem>;

export type BlogQueryResult = {
  items: BlogItems;
}

export type BlogPageProps = {
  params: {
    slug: string;
  };
}