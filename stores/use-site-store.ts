import { create } from "zustand";

interface SiteStore {
  informationOpen: boolean;
  setInformationOpen: (open: boolean) => void;
  contactOpen: boolean;
  setContactOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useSiteStore = create<SiteStore>((set) => ({
  informationOpen: false,
  setInformationOpen: (open: boolean) => set({ informationOpen: open }),
  contactOpen: false,
  setContactOpen: (open: boolean) => set({ contactOpen: open }),
  mobileMenuOpen: false,
  setMobileMenuOpen: (open: boolean) => set({ mobileMenuOpen: open }),
}))