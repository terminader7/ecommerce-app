import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Cart, Prisma } from "@prisma/client";

// Defining a type that represents a cart with its items and their associated products.
export type CartWithProducts = Prisma.CartGetPayload<{
  include: {
    items: {
      include: { product: true };
    };
  };
}>;

// Extending the Cart type to include size (number of items) and subtotal (total price).
export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
};

export const getCart = async (): Promise<ShoppingCart | null> => {
  // Get the localCartId from cookies
  const localCartId = cookies().get("localCartId")?.value;

  // If there's a localCartId, try to find the cart in the database
  const cart = localCartId
    ? await prisma.cart.findUnique({
        where: { id: localCartId },
        include: {
          items: {
            include: { product: true },
          },
        },
      })
    : null; // If no localCartId, cart is null

  if (!cart) {
    return null;
  }

  // Calculate the size and subtotal of the cart
  return {
    ...cart,
    size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: cart.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    ),
  };
};

export const createCart = async (): Promise<ShoppingCart> => {
  // Create a new cart in the database
  const newCart = await prisma.cart.create({
    data: {},
  });

  // Needs encryption, this won't be okay for production
  cookies().set("localCartId", newCart.id);

  return {
    ...newCart,
    items: [],
    size: 0,
    subtotal: 0,
  };
};
