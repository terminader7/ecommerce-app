import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Cart, Prisma } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

// Defining a type that represents a cart with its items and their associated products.
export type CartWithProducts = Prisma.CartGetPayload<{
  include: {
    items: {
      include: { product: true };
    };
  };
}>;

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;

// Extending the Cart type to include size (number of items) and subtotal (total price).
export type ShoppingCart = CartWithProducts & {
  size: number;
  subtotal: number;
};

export const getCart = async (): Promise<ShoppingCart | null> => {
  const session = await getServerSession(authOptions);

  let cart: CartWithProducts | null = null;

  if (session) {
    cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: { items: { include: { product: true } } },
    });
  } else {
    // Get the localCartId from cookies
    const localCartId = cookies().get("localCartId")?.value;

    // If there's a localCartId, try to find the cart in the database
    cart = localCartId
      ? await prisma.cart.findUnique({
          where: { id: localCartId },
          include: {
            items: {
              include: { product: true },
            },
          },
        })
      : null; // If no localCartId, cart is null
  }

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
  const session = await getServerSession(authOptions);

  let newCart: Cart;

  if (session) {
    newCart = await prisma.cart.create({
      data: {
        userId: session.user.id,
      },
    });
  } else {
    newCart = await prisma.cart.create({
      data: {},
    });

    cookies().set("localCartId", newCart.id);
  }

  // Create a new cart in the database

  // Needs encryption, this won't be okay for production

  return {
    ...newCart,
    items: [],
    size: 0,
    subtotal: 0,
  };
};
