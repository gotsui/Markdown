type Visibility = "PUBLIC" | "PRIVATE" | "DRAFT";

type Article = {
    id: string;
    title: string;
    slug: string;
    description?: string;
    visibility: Visibility;
    authorId: string;
    author: User;
    createdAt: string;
    updatedAt: string;
};

type ArticleFilter = {
    visibilities?: Visibility[];
    search?: string;
    author?: string;
    onlyMyArticles?: boolean;
};