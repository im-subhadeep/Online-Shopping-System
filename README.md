<div align="center">
  <h1><img src="https://gocartshop.in/favicon.ico" width="20" height="20" alt="GoCart Favicon">
   GoCart</h1>
</div>

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🛠️ SDLC Approach](#-sdlc-approach)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## Features

- **Multi-Vendor Architecture:** Allows multiple vendors to register, manage their own products, and sell on a single platform.
- **Customer-Facing Storefront:** A beautiful and responsive user interface for customers to browse and purchase products.
- **Vendor Dashboards:** Dedicated dashboards for vendors to manage products, view sales analytics, and track orders.
- **Admin Panel:** A comprehensive dashboard for platform administrators to oversee vendors, products, and commissions.

## 🛠️ SDLC Approach <a name="-sdlc-approach"></a>

Even when rapid prototyping, we document the standard SDLC activities behind GoCart so contributors can inherit a disciplined delivery process:

- **Requirements & Vision:** Captured marketplace personas (platform admin, vendor, shopper) and framed each capability as user stories with acceptance criteria so requirements stay traceable through delivery.
- **Planning & Estimation:** Broke stories into a Work Breakdown Structure, sized them via story points, and validated effort using the intermediate COCOMO model (organic mode) to keep the release plan aligned with capacity.
- **Analysis & Modeling:** Produced an Entity Relationship Diagram covering vendors, products, inventory, orders, customers, and payments, alongside Level 0/1 Data Flow Diagrams that illustrate browsing, checkout, fulfillment, and refund pathways. These artefacts live in `docs/architecture`.
- **Design Decisions:** Logged architecture decisions (ADRs) around Next.js routing, Prisma data access, caching, and security boundaries. Sequence diagrams show request flow from the storefront to Prisma and external services, while UI wireframes document responsive layouts.
- **Implementation Standards:** Applied lint/format checks, TypeScript strict mode, commit conventions, and pull-request templates that reference the originating user story or ADR to keep code reviews focused on the intended scope.
- **Verification & Validation:** Combined Jest unit tests, React Testing Library component tests, Playwright end-to-end flows, and Thunder Client API collections. Static analysis (ESLint) and `next lint` run automatically in CI alongside Prisma schema validation.
- **Deployment & Operations:** Prepared environment configuration matrices, migration runbooks (Prisma Migrate), health check monitors, and rollback steps. CI/CD pipelines gate promotion on test suites and enforce semantic version tagging.
- **Continuous Improvement:** Sprint reviews compare actual velocity against COCOMO estimates, and retrospectives capture lessons to refine estimation and risk mitigation in future iterations.

## 🛠️ Tech Stack <a name="-tech-stack"></a>

- **Framework:** Next.js
- **Styling:** Tailwind CSS
- **UI Components:** Lucide React for icons
- **State Management:** Redux Toolkit
- **Database:** MySQL (via Prisma ORM)

## 🚀 Getting Started <a name="-getting-started"></a>

First, install the dependencies. We recommend using `npm` for this project.

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/(public)/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Outfit](https://vercel.com/font), a new font family for Vercel.

---

## 🤝 Contributing <a name="-contributing"></a>

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for more details on how to get started.

---

## 📜 License <a name="-license"></a>

This project is licensed under the MIT License. See the [LICENSE.md](./LICENSE.md) file for details.
