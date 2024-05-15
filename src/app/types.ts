import { Document } from '@contentful/rich-text-types';

export type BlogItemM = {
  fields: {
    title: string;
    slug: string;
    date: Date;
    content: Document;
  }
}

export type ContentField = {
  nodeType: string;
  data: any;
  content: ContentField | ContentField[];
}
export type ContentArray = {
  nodeType: string;
  data: any;
  content: ContentField[];
}

export type BlogFields = {
  title: string;
  slug: string;
  date: Date;
  mainData: any;
  mainNodeType: string;
  contents: ContentArray[];
};

export type BlogPageProps = {
  params: {
    slug: string;
  };
};

export type BlogItem = {
  metadata: {
    tags: string[];
  };
  sys: {
    space: {
      sys: any;
    };
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    environment: {
      sys: any;
    };
    revision: number;
    contentType: {
      sys: any;
    };
    locale: string;
  };
  fields: BlogFields
}



