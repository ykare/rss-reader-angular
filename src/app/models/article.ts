export interface Article {
    feedId?: string;
    id: string;
    prev?: string;
    next?: string;
    title: string;
    url: string;
    imageUrl?: string;
    description: string;
  }
