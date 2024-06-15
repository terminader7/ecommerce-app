"use server";

import { createCart, getCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export const incrementProductQuantity = async (productId: string) => {
  // We only want the cart to be created if it's modified, we don't want to bloat the db with a bunch of
  // empty carts, so that's why we want to not create it when the user enters the site
  const cart = (await getCart()) ?? (await createCart());

  const itemInCart = cart.items.find((item) => item.productId === productId);

  if (itemInCart) {
    await prisma.cartItem.update({
      where: { id: itemInCart.id },
      data: { quantity: { increment: 1 } },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: 1,
      },
    });
  }

  revalidatePath("/products/[id]");
};
