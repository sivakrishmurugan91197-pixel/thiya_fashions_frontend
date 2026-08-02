# Frontend Changelog - Thiya Fashions Frontend

All changes made to clean up, configure, and optimize the frontend web application are documented below.

## [1.1.0] - 2026-08-02

### Added
- Created production environment configuration file `.env` to define the default production API URL pointing to the live Railway server: `https://thiyafashionsbackend-production.up.railway.app`.
- Integrated official Thiya Fashions YouTube logo image (`/images/thiya_logo.png`) in the header and footer across the storefront.
- Updated the contact phone number in the footer to `+91 93613 56409` matching the branding.
- Added hamburger toggle button to the top header on mobile screens to open/close the mobile sidebar.
- Added sliding drawer responsive mobile sidebar layout inside `components/AdminLayout.jsx`.
- Added backdrop/overlay that closes the drawer menu when clicked.
- Created a dedicated order confirmation success page (`pages/order-success.jsx`) featuring a pink brand header accent, animated bouncing checkmark, item descriptions, and transaction/payment details.
- Integrated Size Enabled config dropdown in Categories admin page and configured Products admin form to dynamically show/hide the "Size Variants" text field depending on the selected category's size status.
- Added a floating green pulsing WhatsApp chat widget linked directly to wa.me/919361356409 in the global storefront layout.
- Updated `pages/products/[id].jsx` to redirect to the `/order-success` page upon checkout verification.

### Changed
- Refactored all storefront pages to dynamically fetch the backend URL from `process.env.NEXT_PUBLIC_API_URL` instead of hardcoded `http://localhost:3000` links:
  - `pages/products/[id].jsx`
  - `pages/products/index.jsx`
  - `pages/admin/categories.jsx`
  - `pages/admin/products.jsx`
  - `pages/admin/reports.jsx`
- Reconfigured local `.env.local` file to override the API URL to `http://localhost:3000` for offline dev mode.
- Adjusted container paddings on all administration panels to scale cleanly on smaller device screens.
- Modified list containers in `categories.jsx`, `products.jsx`, and `reports.jsx` by wrapping tables in scrollable block elements (`overflow-x-auto`) to enable swipe-scrolling on iOS & Android screens.
- Responsive design styling added to `pages/admin/login.jsx` card layout.
- Switched default design accent colors from blue (`text-blue-600`) to pink (`text-pink-600`) in `ThiyaLayout.jsx` and `pages/index.jsx` to match the brand identity.
- Updated `pages/products/[id].jsx` to hide the size selector widget entirely if no sizes are defined for the product (e.g. Sarees), defaulting the order size label to 'Standard'.

### Removed
- Deleted unused Taskily project manager dashboard folder (`pages/dashboard/`).
- Deleted unused auth pages:
  - `pages/forgot-password.jsx`
  - `pages/register.jsx`
  - `pages/verification.jsx`
- Deleted unused layout modules inside `components/layout/`.
- Deleted unused modals inside `components/modals/`.
- Deleted unused section components inside `components/sections/`.
- Deleted unused UI atoms inside `components/ui/`.
