# Landing Page Audit and Placeholder Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Branch:** `feat/update-landing-audit-placeholders`

**Goal:** Audit the Tiket.ku landing page against `DESIGN.md` and the Stitch canvas, improve visual consistency and accessibility, and replace dynamic event content with mixed placeholders.

**Architecture:** Keep the existing landing page structure and reusable components. Update `Home.tsx` section by section, using placeholder boxes for images and placeholder text for event metadata. Apply accessibility fixes in shared landing components only where needed. No backend, schema, or routing changes.

**Tech Stack:** React 19, TypeScript 5.7, Tailwind CSS 4, React Router 7, existing reusable components in `src/components`.

**Spec:** `docs/superpowers/specs/2026-11-26-landing-audit-placeholders-design.md`

## Global Constraints

- Follow `DESIGN.md` tokens for color, typography, spacing, radius, and motion.
- UI text remains in Bahasa Indonesia.
- Do not introduce new dependencies.
- Do not change backend, schema, service, or routing.
- Preserve existing component APIs.
- Verify each task with `npm run lint`, `npm run build`, and `npx tsc -b` using `NODE_OPTIONS=--max-old-space-size=4096`.

## Review Focus

- Placeholder images must not create noisy screen-reader output.
- `brand-sky` text on `night-950` must remain readable.
- Keyboard users must be able to operate hero and card actions.
- Hero and venue grids must not overflow on mobile.
- Disabled card actions must remain visually and semantically disabled.

---

### Task 1: Audit and normalize hero section

**Files:**

- Modify: `src/features/home/page/Home.tsx`

**Interfaces:**

- Consumes: `Button`, `Navbar`, `Footer`
- Produces: Hero section with placeholder media and accessible actions

- [x] **Step 1: Replace external hero background image with a placeholder surface**

Use a `div` with `bg-surface-subtle`, centered `material-symbols-outlined` `image`, and `aria-hidden="true"`.

- [x] **Step 2: Replace featured card image with placeholder media**

Use the same placeholder pattern inside the featured card media area.

- [x] **Step 3: Normalize hero text and CTA classes**

Ensure heading, paragraph, badge, and buttons use existing token classes and do not introduce ad-hoc values.

- [x] **Step 4: Add accessible labels to icon-only or scroll actions**

Hero scroll buttons must have clear text labels. Icon-only spans remain `aria-hidden="true"`.

- [x] **Step 5: Verify**

Run: `npx tsc -b`  
Expected: no TypeScript errors.

- [x] **Step 6: Commit**

```bash
git add src/features/home/page/Home.tsx
git commit -m "feat(home): audit hero section and add placeholder media"
```

Commit: `4359e57` — feat(home): audit hero section and add placeholder media

---

### Task 2: Replace agenda card content with placeholders

**Files:**

- Modify: `src/features/home/page/Home.tsx`

**Interfaces:**

- Consumes: `CardAction`
- Produces: Agenda cards with placeholder metadata

- [x] **Step 1: Replace event images with placeholder media**

Pass a placeholder `div` to `CardAction` `media` instead of `<img>`.

- [x] **Step 2: Replace event metadata with placeholders**

Use:

- title: `Judul Acara`
- date: `Tanggal & Waktu`
- location: `Lokasi`
- price: `Rp ---`
- status: `Status`

- [x] **Step 3: Keep card action behavior**

`onAction` remains `handleLihatJadwal`.

- [x] **Step 4: Verify**

Run: `npx tsc -b`  
Expected: no TypeScript errors.

- [x] **Step 5: Commit**

```bash
git add src/features/home/page/Home.tsx
git commit -m "feat(home): replace agenda content with placeholders"
```

Commit: `1a9a038` — feat(home): replace agenda content with placeholders

---

### Task 3: Audit features, venue, and CTA sections

**Files:**

- Modify: `src/features/home/page/Home.tsx`

**Interfaces:**

- Consumes: `Button`
- Produces: Consistent section layout and accessible CTA

- [x] **Step 1: Normalize feature cards**

Ensure icon containers, headings, and body text use token classes and consistent spacing.

- [x] **Step 2: Normalize venue cards**

Ensure capacity, name, and description use consistent label/body classes.

- [x] **Step 3: Normalize CTA section**

Ensure heading, description, and button use existing token classes and responsive layout.

- [x] **Step 4: Verify**

Run: `npx tsc -b`  
Expected: no TypeScript errors.

- [x] **Step 5: Commit**

```bash
git add src/features/home/page/Home.tsx
git commit -m "feat(home): audit features, venue, and CTA sections"
```

Commit: `c01e384` — feat(home): audit features, venue, and CTA sections

---

### Task 4: Audit navbar and footer for landing usage

**Files:**

- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/Footer.tsx`

**Interfaces:**

- Consumes: `Button`, `FooterLinks`
- Produces: Accessible navigation and footer

- [x] **Step 1: Verify navbar semantics**

Ensure logo button, links, and auth buttons are keyboard accessible and use consistent classes.

- [x] **Step 2: Verify footer semantics**

Ensure footer text and links are readable and use token classes.

- [x] **Step 3: Verify**

Run: `npm run lint`  
Expected: no lint errors in `src/`.

- [x] **Step 4: Commit**

```bash
git add src/components/Navbar.tsx src/components/FooterLinks.tsx
git commit -m "feat(ui): audit navbar and footer for landing page"
```

Commit: `6d42b88` — feat(ui): audit navbar and footer for landing page

---

### Task 5: Accessibility pass

**Files:**

- Modify: `src/features/home/page/Home.tsx`
- Modify: `src/components/Navbar.tsx` if needed

**Interfaces:**

- Consumes: existing components
- Produces: accessible landing page

- [x] **Step 1: Add skip link target and main landmark**

Ensure `#main-content` exists and is reachable.

- [x] **Step 2: Check focus styles**

Ensure all interactive elements use visible focus styles.

- [x] **Step 3: Check responsive layout**

Ensure hero, grids, and CTA do not overflow at mobile widths.

- [x] **Step 4: Verify**

Run: `npm run build`  
Expected: build succeeds.

- [x] **Step 5: Commit**

```bash
git add src/features/home/page/Home.tsx src/components/Navbar.tsx
git commit -m "feat(a11y): improve landing page accessibility"
```

Commit: `098a645` — feat(a11y): improve landing page accessibility

---

### Task 6: Final verification

**Files:**

- No new files

- [x] **Step 1: Run lint**

Run: `npm run lint`  
Expected: no errors in `src/`.

- [x] **Step 2: Run type-check**

Run: `NODE_OPTIONS=--max-old-space-size=4096 npx tsc -b`  
Expected: no TypeScript errors.

- [x] **Step 3: Run build**

Run: `npm run build`  
Expected: build succeeds.

- [x] **Step 4: Manual responsive and keyboard check**

Check desktop, tablet, and mobile widths. Verify tab order and focus visibility.

- [x] **Step 5: Commit verification note**

No code commit required unless fixes were made.
