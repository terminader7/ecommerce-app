"use client";

import ShoppingCartIcon from "@/components/ShoppingCartIcon";
import { ShoppingCart } from "@/lib/db/cart";
import { formatPrice } from "@/lib/format";
import Link from "next/link";

interface ShoppingCartButtonProps {
  cart: ShoppingCart | null;
}

const ShoppingCartButton = ({ cart }: ShoppingCartButtonProps) => {
  const closeDropdown = () => {
    const focusedElem = document.activeElement as HTMLElement;

    if (focusedElem) {
      focusedElem.blur();
    }
  };
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-circle btn-ghost">
        <div className="indicator">
          <ShoppingCartIcon />
          <span className="badge indicator-item badge-sm">
            {cart?.size || 0}
          </span>
        </div>
      </label>
      <div
        tabIndex={0}
        className="card dropdown-content card-compact z-30 mt-3 w-52 bg-base-100 shadow"
      >
        <div className="card-body">
          <span className="text-lg font-bold">{cart?.size || 0} Items</span>
          <span className="text-info">
            Subtotal: {formatPrice(cart?.subtotal || 0)}
          </span>
          <div className="card-actions">
            <Link
              href="/cart"
              className="btn btn-primary btn-block"
              onClick={closeDropdown}
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartButton;
