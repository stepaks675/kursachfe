# Kin4ik - Movie Recommendation Platform

This is a Next.js application that provides personalized movie recommendations based on user preferences.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL database

### Database Setup

1. Create a PostgreSQL database named `kin4ik`
2. The application will automatically create the required tables when first run

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
DATABASE_URL=postgres://username:password@localhost:5432/kin4ik
```

Replace `username` and `password` with your PostgreSQL credentials.

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- User registration with profile creation
- Personalized movie recommendations
- User preference survey for better recommendations
- Responsive design

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- TailwindCSS
- DrizzleORM
- PostgreSQL

## Project Structure

- `app/` - App Router components and pages
- `lib/` - Utility functions and database logic
  - `db/` - Database schema and connection
  - `actions/` - Server actions
- `public/` - Static assets

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
