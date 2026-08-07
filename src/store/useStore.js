import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Cart + wishlist, persisted to localStorage. */
export const useStore = create(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],

      addItem: (item) =>
        set((state) => {
          const key = item.key || item.handle;
          const existing = state.items.find((i) => (i.key || i.handle) === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                (i.key || i.handle) === key ? { ...i, qty: i.qty + (item.qty || 1) } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, key, qty: item.qty || 1 }] };
        }),

      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((i) => (i.key || i.handle) !== key) })),

      setQty: (key, qty) =>
        set((state) => ({
          items: state.items
            .map((i) => ((i.key || i.handle) === key ? { ...i, qty: Math.max(0, qty) } : i))
            .filter((i) => i.qty > 0),
        })),

      clear: () => set({ items: [] }),

      toggleWish: (handle) =>
        set((state) => ({
          wishlist: state.wishlist.includes(handle)
            ? state.wishlist.filter((h) => h !== handle)
            : [...state.wishlist, handle],
        })),

      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.price * i.qty, 0),
    }),
    { name: 'mapalu-cart' },
  ),
);

/** Ephemeral UI state — drawers, overlays, toasts. Not persisted. */
export const useUI = create((set) => ({
  cartOpen: false,
  menuOpen: false,
  searchOpen: false,
  toast: null,
  openCart: () => set({ cartOpen: true, menuOpen: false, searchOpen: false }),
  closeCart: () => set({ cartOpen: false }),
  openMenu: () => set({ menuOpen: true, cartOpen: false, searchOpen: false }),
  closeMenu: () => set({ menuOpen: false }),
  openSearch: () => set({ searchOpen: true, cartOpen: false, menuOpen: false }),
  closeSearch: () => set({ searchOpen: false }),
  closeAll: () => set({ cartOpen: false, menuOpen: false, searchOpen: false }),
  showToast: (toast) => set({ toast: { ...toast, id: Date.now() } }),
  hideToast: () => set({ toast: null }),
}));
