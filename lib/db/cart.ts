import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Cart, CartItem, Prisma } from "@prisma/client";
import { authOptions } from "@/app/auth/authOptions";
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

/**
 * Retrieves the shopping cart with its items and associated products.
 * Calculates the size (number of items) and subtotal (total price) of the cart.
 * @returns The shopping cart with size and subtotal, or null if the cart is not found.
 */
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

/**
 * Creates a new shopping cart.
 * If the user is authenticated, associates the cart with the user.
 * If the user is not authenticated, sets a localCartId cookie to identify the cart.
 * @returns The newly created shopping cart.
 */
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

/**
 * Merges the items from an anonymous cart into a user's cart.
 * @param userId - The ID of the user's cart to merge into.
 */
export const mergeAnonymousCartIntoUserCart = async (userId: string) => {
  const localCartId = cookies().get("localCartId")?.value;

  const localCart = localCartId
    ? await prisma.cart.findUnique({
        where: { id: localCartId },
        include: { items: true },
      })
    : null;

  if (!localCart) return;

  const userCart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: true },
  });

  await prisma.$transaction(async (tx) => {
    if (userCart) {
      const mergedCartItems = mergeCartItems(localCart.items, userCart.items);

      await tx.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });

      await tx.cart.update({
        where: { id: userCart.id },
        data: {
          items: {
            createMany: {
              data: mergedCartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    } else {
      await tx.cart.create({
        data: {
          userId,
          items: {
            createMany: {
              data: localCart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    }

    await tx.cart.delete({ where: { id: localCart.id } });

    cookies().set("localCartId", "");
  });
};

/**
 * Merges multiple arrays of cart items into a single array.
 * If an item with the same productId already exists, the quantities are summed.
 * @param cartItems - Arrays of cart items to merge.
 * @returns The merged array of cart items.
 */
const mergeCartItems = (...cartItems: CartItem[][]): CartItem[] => {
  return cartItems.reduce((acc, items) => {
    items.forEach((item) => {
      const existingItem = acc.find((i) => i.productId === item.productId);

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
    });
    return acc;
  }, [] as CartItem[]);
};
