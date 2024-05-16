import { BlogItem } from "@/app/types";


export const getBlogItem = (data: any): BlogItem => {
    return {
        fields: {
            title: data.title,
            slug: data.slug,
            date: new Date(data.date),
            thumbnail: data.thumbnail,
            content: data.content
        }
    };

}