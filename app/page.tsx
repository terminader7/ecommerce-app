import Pagination from "@/components/Pagination";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db/prisma";
import Image from "next/image";
import Link from "next/link";
import { GetServerSideProps } from "next";

interface HomeProps {
  searchParams: { page: string };
}

// Fetching data on the server side for better SEO and initial load performance
export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = context.query.page || "1";
  const currentPage = parseInt(page as string);
  const pageSize = 6;
  const heroItemCount = 1;
  const totalItemCount = await prisma.product.count();
  const totalPages = Math.ceil((totalItemCount - heroItemCount) / pageSize);

  const products = await prisma.product.findMany({
    orderBy: {
      id: "desc",
    },
    skip:
      (currentPage - 1) * pageSize + (currentPage === 1 ? 0 : heroItemCount),
    take: pageSize + (currentPage === 1 ? heroItemCount : 0),
  });

  return {
    props: {
      products,
      currentPage,
      totalPages,
    },
  };
};

interface HomeProps {
  products: any[]; // Define a more specific type for your products
  currentPage: number;
  totalPages: number;
}

export default function Home({ products, currentPage, totalPages }: HomeProps) {
  return (
    <div className="flex flex-col items-center">
      {currentPage === 1 && products.length > 0 && (
        <div className="hero rounded-xl bg-base-200">
          <div className="hero-content flex-col lg:flex-row">
            <Image
              src={products[0].imageUrl}
              alt={products[0].name}
              width={400}
              height={800}
              className="w-full max-w-sm rounded-lg shadow-2xl"
              priority
            />
            <div>
              <h1 className="text-5xl font-bold">{products[0].name}</h1>
              <p className="py-6">{products[0].description}</p>
              <Link
                href={"/products/" + products[0].id}
                className="btn btn-primary"
              >
                Check it out!
              </Link>
            </div>
          </div>
        </div>
      )}
      <div className="md: my-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(currentPage === 1 ? products.slice(1) : products).map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
