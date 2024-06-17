# Ecommerce App

This repository contains the source code for a feature-rich eCommerce application developed with Next.js, TypeScript, Daisy UI, Prisma, Zod, Tailwind CSS, and utilizing Google Sign-In for user authentication. The app showcases modern web development techniques and technologies, offering functionalities like user authentication, cart management, product addition, search functionality, pagination, and more. It serves as both a practical tool and a learning resource for developers interested in these technologies.

## Key Features

- **User Authentication via Google Sign-In**: Users can securely sign up and log in using their Google accounts.
- **Cart Management**: Allows anonymous users to add items to their cart. Upon logging in, the system merges the anonymous cart with the authenticated user's cart and removes the anonymous cart.
- **Search Functionality**: Enables users to search for products within the database.
- **Product Addition**: Provides administrators with the capability to add new products to the database.
- **Pagination**: Facilitates efficient navigation through product listings.
- **Validation**: Utilizes Zod for robust data validation across the application.
- **Styling**: Leverages Tailwind CSS for rapid UI development and Daisy UI for enhanced component design.

## Technologies Used

- **Frontend**: Next.js (React framework) with TypeScript for type safety.
- **UI Frameworks**: Daisy UI for styled components and Tailwind CSS for utility-first CSS framework.
- **ORM**: Prisma for efficient database interactions.
- **Data Validation**: Zod for schema validation.
- **Authentication**: Google Sign-In integrated through NextAuth for user authentication.
