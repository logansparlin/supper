'use client'

import { useMemo, type FC } from "react";
import { useWorksStore } from "@/components/works/use-works-store";
import type { Project, Service } from '@/components/project/project.types'

import { AnimatePresence } from "framer-motion";
import { WorksGrid } from "@/components/works/works-grid";
import { WorksList } from "@/components/works/works-list";
import { ViewToggle } from "./view-toggle";
import { WorksFilters } from "./works-filters";

interface WorksPageProps {
  projects: Project[]
  services: Service[]
}

export const WorksPage: FC<WorksPageProps> = ({ projects, services }) => {
  const view = useWorksStore((state) => state.view)
  const activeFilter = useWorksStore((state) => state.activeFilter)

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all' || !activeFilter) {
      return projects
    }

    return projects.filter((project) => project.services.some((service) => service.slug === activeFilter))
  }, [projects, activeFilter])


  return (
    <div className="w-full flex flex-col gap-30">
      <div className="w-full text-nav">
        <WorksFilters filters={services} />
      </div>
      <div className="w-full flex flex-col gap-10">
        <AnimatePresence mode="wait" initial={false}>
          {view === 'grid' ? (
            <WorksGrid key={`grid-${activeFilter}`} projects={filteredProjects} />
          ) : (
            <WorksList key={`list-${activeFilter}`} projects={filteredProjects} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}