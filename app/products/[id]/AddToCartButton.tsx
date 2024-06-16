"use client";

import { useState, useTransition } from "react";
// Importing the server action directly might still be bugged on Next.js' end
// if this isn't working uncomment the code and remove the import that's the current workaround
import { incrementProductQuantity } from "./actions";
import ShoppingCartIcon from "@/components/ShoppingCartIcon";

interface AddToCartButtonProps {
  productId: string;
  // incrementProductQuantity:(productId: string) => Promise<void>
}

const AddToCartButton = ({
  productId,
  // incrementProductQuantity,
}: AddToCartButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    startTransition(() => {
      incrementProductQuantity(productId).then(() => {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
      });
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className="btn btn-primary"
        onClick={handleClick}
        disabled={isPending}
      >
        Add to Cart
        <ShoppingCartIcon />
      </button>
      {isPending && <span className="loading loading-spinner loading-md" />}
      {success && !isPending && (
        <span className="text-green-500">Added to cart!</span>
      )}
    </div>
  );
};

export default AddToCartButton;
