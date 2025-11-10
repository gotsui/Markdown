type Visibility = "PUBLIC" | "PRIVATE" | "DRAFT";
type SortBy = "createdAt" | "updatedAt" | "title";
type SortOrder = "asc" | "desc";
type Role = "USER" | "ADMIN";

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
    _count?: { favorites: number };
    isFavorited?: boolean;
};

type ArticleFilter = {
    visibilities?: Visibility[];
    search?: string;
    author?: string;
    onlyMyArticles?: boolean;
    onlyFavorites?: boolean;
    sortBy?: SortBy;
    sortOrder?: SortOrder;
};