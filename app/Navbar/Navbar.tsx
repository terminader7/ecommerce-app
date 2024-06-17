import Image from "next/image";
import Link from "next/link";
import logo from "@/public/assets/logo.svg";
import githubLogo from "@/public/assets/github-logo.svg";
import { redirect } from "next/navigation";
import { getCart } from "@/lib/db/cart";
import ShoppingCartButton from "./ShoppingCartButton";
import UserMenuButton from "./UserMenuButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

const searchProducts = async (formData: FormData) => {
  "use server";

  const searchQuery = formData.get("searchQuery")?.toString();

  if (searchQuery) {
    redirect("/search?query=" + searchQuery);
  }
};

const Navbar = async () => {
  // Get server session will not work if it doesn't get the authOptions
  const session = await getServerSession(authOptions);
  const cart = await getCart();

  return (
    <div className="bg-base-100">
      <div className="max-w-8xl navbar m-auto flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl normal-case">
            <Image src={logo} height={40} width={40} alt="Money Sink Logo" />
            Money Sink
          </Link>
        </div>
        <div className="flex-none gap-2">
          <Link
            href="https://github.com/terminader7/ecommerce-app"
            className="btn btn-ghost text-sm normal-case"
          >
            <Image src={githubLogo} height={20} width={20} alt="Github Logo" />
            View the Code Here!
          </Link>
          <form action={searchProducts}>
            <div className="form-control">
              <input
                name="searchQuery"
                placeholder="Search"
                className="input input-bordered w-full min-w-[100px]"
              />
            </div>
          </form>
          <ShoppingCartButton cart={cart} />
          <UserMenuButton session={session} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
