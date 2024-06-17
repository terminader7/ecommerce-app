import FormSubmitButton from "@/components/FormSubmitButton";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

export const metadata = {
  title: "Add Product - Money Sink",
};

async function addProduct(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const price = Number(formData.get("price") || 0);

  if (!name || !description || !imageUrl || !price) {
    throw Error("Missing required fields");
  }

  await prisma.product.create({
    data: { name, description, imageUrl, price },
  });

  redirect("/");
}

const AddProductPage = async () => {
  const session = await getServerSession(authOptions);

  // We don't want users to be able to add products unless they're signed in, if they aren't signed in we redirect them to sign in and then back to add product page
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }

  return (
    <div>
      <h1 className="mb-3 text-lg font-bold">Add product</h1>
      <form action={addProduct}>
        <input
          required
          name="name"
          placeholder="Name..."
          className="input input-bordered mb-3 w-full text-lg"
        />
        <textarea
          required
          name="description"
          placeholder="Description..."
          className="textarea textarea-bordered mb-3 w-full"
        />
        <input
          required
          name="imageUrl"
          placeholder="Image URL..."
          type="url"
          className="input input-bordered mb-3 w-full text-lg"
        />
        <input
          required
          name="price"
          placeholder="Price..."
          type="number"
          className="input input-bordered mb-3 w-full text-lg"
        />
        <FormSubmitButton className="btn-block">Add Product</FormSubmitButton>
      </form>
    </div>
  );
};

export default AddProductPage;
