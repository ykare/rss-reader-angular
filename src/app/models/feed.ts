import { Article } from "./article";

export interface Feed {
    id: string;
    title: string;
    link: string;
    feedUrl: string;
    description: string;
    articles?: Article[];
  }
  