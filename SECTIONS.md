# Bakry LLC — Section map

Use this when something looks wrong: find the **section number**, open the **component**, then check **styles** there (or in `app/globals.css` if noted).

| # | On-page name | Component file | Styles live in | DOM id |
|---|--------------|----------------|----------------|--------|
| 0 | Global chrome (cursor, GSAP bootstrap, scroll progress) | `components/GlobalDotCursor.tsx`, `GsapScrollBootstrap.tsx`, `SiteScrollProgress.tsx` | mostly Tailwind / cursor in `app/globals.css`; progress styles in `SiteScrollProgress.tsx` | — |
| 1 | Hero — BAKRY LLC | `app/page.tsx` (inline) + `CyberGridBackground.tsx` + `ui/text-hover-effect.tsx` | Tailwind in `page.tsx`; grid canvas in `CyberGridBackground.tsx` | — |
| 2 | Wire cards | `components/WireSection.tsx` | **Inline `<style>` inside WireSection.tsx** | `#wire-section` |
| 3 | Services (Web / Mobile / SaaS / Automation) | `components/ServicesSection.tsx` | **`app/globals.css`** (`.services-*`, `#services-*`) | `#services` |
| 3b | Service detail (iframe page) | `app/services/[slug]/page.tsx` | Tailwind on that page | — |
| 4 | HyperScroll 3D tunnel | `components/HyperScrollSection.tsx` | **Inline `<style>` inside HyperScrollSection.tsx** | `#hyper-scroll` |
| 5 | Text reveal (How we work) | `components/TextRevealSection.tsx` | **Inline `<style>` inside TextRevealSection.tsx** | `#text-reveal` |
| 6 | Featured Work (Webflow stacking stickies) | `components/FeaturedWorkSection.tsx` | Inline CSS + ScrollTrigger scale (from `ideas/Stacking cards animation.html`) | `#featured-work` |
| 7 | Contact (circle → form morph) | `components/ContactMorphSection.tsx` | **Inline `<style>` inside ContactMorphSection.tsx** | `#contact` |
| 8 | Site footer | `components/SiteFooter.tsx` | Tailwind in SiteFooter.tsx | — |
| — | Old contact scroll story (unused) | `components/ContactSection.tsx` | still in repo; not mounted | — |
| — | Brand tokens (colors) | — | `app/globals.css` `:root` | — |
| — | Legal pages | `app/terms/page.tsx`, `app/privacy/page.tsx` | Tailwind on those pages | — |

## Page order (`app/page.tsx`)

1. Hero  
2. WireSection  
3. ServicesSection  
4. HyperScrollSection  
5. TextRevealSection  
6. FeaturedWorkSection (FEATURED WORK title only)  
7. ContactMorphSection  
8. SiteFooter

## Quick tips

- **Click-open wipe on Services** → `app/globals.css` (`#services-frame`, `.services-active`)
- **Scroll title fill on Services** → `ServicesSection.tsx` ScrollTrigger + `globals.css` `.services-panel h2`
- **Most motion sections** keep CSS in the same `.tsx` file as a `<style>` block — search that file first
- **Bottom progress bar** → `components/SiteScrollProgress.tsx` (Wire → page end)