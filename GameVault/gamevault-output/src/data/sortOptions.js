// Shared UI sort labels -> RAWG's `ordering` query param, used by any page
// that renders a filterable game grid (Library, Marketplace store front).
export const SORT_TO_ORDERING = {
  hot: "-added",
  new: "-released",
  rating: "-rating",
  players: "-added",
  az: "name",
};

export const SORT_OPTIONS = [
  { value: "hot", label: "🔥 Trending" },
  { value: "new", label: "✨ Newest First" },
  { value: "rating", label: "⭐ Top Rated" },
  { value: "az", label: "🔤 A-Z" },
];

export default SORT_TO_ORDERING;
