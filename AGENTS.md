<!-- BEGIN:nextjs-agent-rules -->
# Xavinex CRM - Project Rules

## Core Design Principle: "Night Owl" Premium
- Always use a dark, premium aesthetic.
- Colors: Deep backgrounds (#09090b), sleek borders (#27272a), and vibrant accents (Blue/Emerald/Purple).
- Use smooth gradients, glassmorphism effects, and subtle micro-animations.
- Charts (Recharts) must look premium: use gradients for areas, thick lines (strokeWidth={4}), and rounded tooltips.

## Tech Stack
- **Framework**: Next.js 16 (Turbopack) with App Router.
- **Styling**: Tailwind CSS 4 and Vanilla CSS.
- **Database**: MongoDB with Mongoose models.
- **Icons**: Lucide React.
- **Auth**: NextAuth (v5 Beta).

## Module Architecture
- **Views**: UI components located in `components/[Module]/[Module]View.tsx`. They should be "dumb" or focused on presentation.
- **Pages**: Data fetching and business logic should stay in `app/(main)/[module]/page.tsx`.
- **Modals**: Consistent modal style using `components/ui/Modal.tsx`.

## Chart Conventions
- Always use `ResponsiveContainer` for charts.
- Custom tooltips should have dark backgrounds and rounded corners.
- Avoid default browser colors; use curated HSL or HEX palettes.

<!-- END:nextjs-agent-rules -->
