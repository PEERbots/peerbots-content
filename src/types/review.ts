export type Review = {
  id: string;
  data: {
    contentId: string;
    description: string;
    rating: number;
    userId: string;
  };
};
