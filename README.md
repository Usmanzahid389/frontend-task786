This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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


Step-by-step instructions to Run this project.

1. Instal Node.js on your pc 
2. Clone the Repository Open your terminal and clone the repository in the desired Directory git clone 
3. Navigate to the Project Directory.
4. Install Dependencies using npm install.
5. Run the Development Server. Start the Next.js development server using npm run dev.
6. Then, open your web browser and go to http://localhost:3000 to see the production build.


Components Folder:
Map Component
User Table Component 


Pages:
Homepage with use table component.
Profile Page after clicking on the view button in the table.
The Page is a dynamic route with Users ID.


Description: Fetches all users based on a given seed. The API retrieves 100 users per request.

Endpoint: GET https://randomuser.me/api/?page=1&results=100&seed={seed}

Returns: Promise<ResponseData>
Results are added in the form of an array.







Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
