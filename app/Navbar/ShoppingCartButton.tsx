import ShoppingCartIcon from "@/components/ShoppingCartIcon";
import { ShoppingCart } from "@/lib/db/cart";

interface ShoppingCartButtonProps {
  cart: ShoppingCart | null;
}

const ShoppingCartButton = ({ cart }: ShoppingCartButtonProps) => {
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
    </div>
  );
};

export default ShoppingCartButton;
