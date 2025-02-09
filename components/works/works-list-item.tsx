import { type FC, type ComponentProps } from "react";
import type { Project } from "@/components/project/project.types";
import Link from "next/link";

interface WorksListItemProps extends Partial<Project>, Omit<ComponentProps<'a'>, 'title' | 'media'> {}

export const WorksListItem: FC<WorksListItemProps> = (props) => {
  const { title, slug, client, services, year, featuredMedia, media, ...rest } = props;

  return (
    <Link
      aria-labelledby={slug}
      href={`/project/${slug}`}
      className="w-full site-grid text-list-title group-hover:text-grey group-hover:hover:text-black group-hover:hover:underline pb-5 last-of-type:pb-0 transition-colors duration-200 ease"
      {...rest}
    >
      <div className="md:col-span-9 md:grid md:grid-cols-[30%_30%_40%] gap-x-20">
        <div>{client?.title}</div>
        <div>{title}</div>
        <div>Service:</div>
      </div>
      <div className="md:col-span-3">
        {year}
      </div>
    </Link>
  )
}