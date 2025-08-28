type Article = {
    id: string;
    title: string;
    slug: string;
    description?: string;
    visibility: 'PUBLIC' | 'PRIVATE' | 'DRAFT';
    authorId: string;
    author: User;
    createdAt: string;
    updatedAt: string;
};