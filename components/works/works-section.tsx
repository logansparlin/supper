'use client'

import { FC, useMemo } from "react"
import { useWorksStore } from "./use-works-store"
import { shuffleArray } from "@/lib/shuffle-array"
import { easeInOutQuart } from "@/lib/animation"
import { AnimatePresence, motion } from "framer-motion"

import type { Image, Video } from "@/sanity/types"
import type { Project, Service } from "@/components/project/project.types"
import { WorksFilters } from "./works-filters"
import { WorksGrid } from "./works-grid"
import { WorksList } from "./works-list"
import { ViewToggle } from "./view-toggle"

interface WorksSectionProps {
  projects: Project[]
  services: Service[]
  view: 'grid' | 'list'
  setView: (view: 'grid' | 'list') => void
}

export const WorksSection: FC<WorksSectionProps> = ({ projects, services, view, setView }) => {
  const activeFilter = useWorksStore((state) => state.activeFilter)

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all' || !activeFilter) {
      return projects
    }

    return projects.filter((project) => project.services.some((service) => service.slug === activeFilter))
  }, [activeFilter])

  const mediaItems: any = useMemo(() => {
    const allMedia = filteredProjects?.reduce((acc, project) => {
      if (project.media?.length > 0) {
        project.media?.forEach((item, index) => {
          acc.push({
            index,
            title: project.title,
            slug: project.slug,
            media: item as Image | Video
          })
        })
      }
      return acc
    }, [] as Array<any>)

    return shuffleArray(allMedia, 4)
  }, [filteredProjects])

  const isGrid = useMemo(() => {
    return view === 'grid'
  }, [view])


  return (
    <div className="w-full flex flex-col gap-30">
      <div className="w-full flex items-center justify-between">
        <motion.div
          className="w-full text-nav"
          initial={{ opacity: isGrid ? 1 : 0, pointerEvents: isGrid ? 'auto' : 'none' }}
          animate={{ opacity: isGrid ? 1 : 0, pointerEvents: isGrid ? 'auto' : 'none' }}
          transition={{ duration: 0.45, ease: easeInOutQuart, delay: isGrid ? 0.45 : 0 }}
        >
          <WorksFilters filters={services} />
        </motion.div>
        <ViewToggle view={view} setView={setView} />
      </div>
      <div className="w-full flex flex-col gap-10">
        <AnimatePresence mode="wait" initial={false}>
          {view === 'grid' ? (
            <WorksGrid key={`grid-${activeFilter}`} projects={mediaItems} />
          ) : (
            <WorksList key={`list-${activeFilter}`} projects={filteredProjects} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}