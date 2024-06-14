export const metadata = {
  title: "Add Product - Money Sink",
};

const AddProductPage = () => {
  return (
    <div>
      <h1 className="mb-3 text-lg font-bold">Add product</h1>
      <form>
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
        <button type="submit" className="btn btn-primary btn-block">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
