import type { HomePageQueryResult } from "@/sanity.types";

export const HomePage = (props: HomePageQueryResult) => {
  if (!props) return null

  const { title, content } = props

  return (
    <div className="site-container flex flex-col gap-20">
      <h1>{title}</h1>
    </div>
  );
};

