'use client'

import { type FC, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSiteStore } from "@/stores/use-site-store";
import { getRelativePath } from "@/lib/get-relative-path";
import { easeInOutQuart } from "@/lib/animation";
import { useClickAway } from "react-use";
import { useKeyPress } from "@/hooks/use-key-press";

import type { SanityLink } from "@/sanity/types";

import { AnimatePresence, motion } from "framer-motion";
import { PortableText, PortableTextBlock } from "next-sanity";
import { MobileMenuButton } from "../mobile-menu/mobile-menu-button";
import { MobileMenu } from "../mobile-menu/mobile-menu";
import { Logo } from "./logo";
import Link from "next/link";
import { useLenis } from "lenis/react";

export interface HeaderProps {
  links: SanityLink[]
  contact: {
    label: string
    url?: string
    content: {
      _key: string
      label: string
      url?: string
    }[]
  }
  information: {
    label: string
    content: PortableTextBlock
  }
  projectCount?: string | number
}

export const Header: FC<HeaderProps> = (props) => {
  const { links, contact, information } = props
  
  const [hasScrolled, setHasScrolled] = useState(false)
  const [disableTheme, setDisableTheme] = useState(false)
  const informationOpen = useSiteStore((state) => state.informationOpen)
  const contactOpen = useSiteStore((state) => state.contactOpen)
  const pathname = usePathname()
  
  const setInformationOpen = useSiteStore((state) => state.setInformationOpen)
  const setMobileMenuOpen = useSiteStore((state) => state.setMobileMenuOpen)
  const setContactOpen = useSiteStore((state) => state.setContactOpen)
  
  useLenis(({ scroll }) => {
    if (typeof window === 'undefined') return

    const themeDisabled = scroll > (window.innerHeight - 50)
    const hasScrolled = scroll > 100
    
    setDisableTheme(themeDisabled)
    setHasScrolled(hasScrolled)
  });

  const headerRef = useRef<HTMLDivElement>(null)

  const isActive = useMemo(() => {
    return (pathname === '/' || contactOpen) && !hasScrolled
  }, [pathname, contactOpen, hasScrolled])

  const toggleInfo = useCallback(() => {
    setInformationOpen(!informationOpen)
  }, [informationOpen, setInformationOpen])

  const toggleContact = useCallback(() => {
    setContactOpen(!contactOpen)
    setInformationOpen(false)
  }, [contactOpen, setContactOpen, setInformationOpen])

  useEffect(() => {
    setInformationOpen(false)
    if (pathname !== '/') {
      setContactOpen(false)
    }
  }, [pathname])

  useClickAway(headerRef, () => {
    setContactOpen(false)
    setMobileMenuOpen(false)
    setInformationOpen(false)
  })

  const handleLinkClick = useCallback(() => {
    setInformationOpen(false)
  }, [setContactOpen, setInformationOpen])

  useKeyPress('Escape', () => {
    setContactOpen(false)
    setInformationOpen(false)
  })

  return (
    <header 
      ref={headerRef}
      className={`
        w-full fixed top-0 left-0 px-site-x z-[100] py-16 md:pt-16 md:pb-12 bg-translucent backdrop-blur-nav text-nav text-black transition-colors duration-500 ease
        ${!disableTheme && !informationOpen ? 'dark:text-white' : ''}`
      }
    >
      <div className="w-full flex items-start justify-between md:site-grid place-items-start">
        <nav className="hidden md:flex items-center md:col-span-3">
          {links?.map((link) => {
            const { _key, label, to } = link;

            const url = getRelativePath({
              slug: to?.slug,
              type: to?._type
            })

            return (
              <Link key={_key} scroll={false} onClick={handleLinkClick} href={url}>{label}</Link>
            )
          })}
        </nav>
        <Link scroll={false} href="/" className="md:col-span-3">
          <Logo className="w-full h-auto max-w-70 md:max-w-100" />
        </Link>
        <div className="hidden md:grid md:col-span-3 grid-contain">
          <ToggleRow
            label={contact.label}
            url={contact.url}
            enabled={isActive}
            onLabelClick={toggleContact}
          >
            <div className="w-full">
              {contact.content?.map((row) => (
                <div key={row._key}>
                  {row.url ? (
                    <a className="site-link" href={row.url} target="_blank">{row.label}</a>
                  ) : (
                    <div>{row.label}</div>
                  )}
                </div>
              ))}
            </div>
          </ToggleRow>
        </div>
        <div className="hidden md:grid md:col-span-3 w-full">
          <ToggleRow
            label={information.label}
            suffix={(<span>(C){new Date().getFullYear()}</span>)}
            enabled={isActive}
            onLabelClick={toggleInfo}
          >
            <div className="w-full flex items-start justify-start">
              <button onClick={toggleInfo} className="site-link w-full max-w-[350px] text-left">
                <PortableText value={information.content} components={{
                  block: {
                    normal: ({ children }) => (
                      <span>{children}</span>
                    )
                  }
                }} />
              </button>
            </div>
          </ToggleRow>
        </div>
        <MobileMenuButton />
      </div>
      <MobileMenu {...props} />
    </header>
  )
}

const ToggleRow = ({ label, children, enabled, onLabelClick, suffix, url }: { label: string, children: ReactNode, enabled: boolean, suffix?: ReactNode, onLabelClick?: () => void, url?: string }) => {
  return (
    <div className="w-full grid-contain">
      <AnimatePresence initial={false}>
        {enabled ? (
          <motion.div
            key={`${label}-content`}
            className="w-full overflow-hidden"
            initial={{ opacity: 0, height: 0, y: 4 }}
            animate={{ opacity: 1, height: 'auto', y: 0, transition: { duration: 0.55, ease: easeInOutQuart, delay: 0.15 } }}
            exit={{ opacity: 0, height: 0, y: 4 }}
            transition={{
              duration: 0.55,
              ease: easeInOutQuart
            }}
          >
            <div className="w-full">{children}</div>
          </motion.div>
        ) : (
          <motion.div
            key={label}
            className="w-full flex items-start justify-between"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: easeInOutQuart, delay: 0.15 } }}
            exit={{ opacity: 0, y: -4 }}
            transition={{
              duration: 0.55,
              ease: easeInOutQuart
            }}
          >
            {url ? (
              <a href={url} target="_blank" className="site-link" onClick={onLabelClick}>{label}</a>
            ) : (
              <button className="site-link" onClick={onLabelClick}>{label}</button>
            )}
            {suffix ?? null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}