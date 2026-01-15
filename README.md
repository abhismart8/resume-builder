## Getting Started

First, run the development server:

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Admin Features

### Template Management

Admin users can manage templates through the admin dashboard:

1. **Login as Admin**: Use the admin credentials created during setup
2. **Access Admin Dashboard**: On the templates page, click "Manage Templates (Admin)" button (visible only to admins)
3. **Create New Templates**: Add new template designs with custom CSS styles
4. **Edit Existing Templates**: Modify template properties, styles, and settings
5. **Delete Templates**: Remove templates from the system
6. **Toggle Active Status**: Enable/disable templates for user visibility

### Admin User Setup

To create an admin user, run:

```bash
node scripts/create-admin.js
```

Default admin credentials:
- Email: admin@resumebuilder.com
- Password: admin123

**Important**: Change the password after first login!

### Template Properties

Each template can be configured with:

- **Basic Info**: ID, name, description, category
- **Visual Settings**: Thumbnail URL, sort order
- **CSS Styles**: Background color, text color, header color, accent color
- **Status**: Active/inactive toggle

## Features

- User authentication with role-based access
- Comprehensive resume builder with multiple sections
- PDF export functionality
- Template customization for admins
- Responsive design

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
