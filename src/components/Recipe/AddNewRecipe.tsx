import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Category } from "./RecipeList";
import { Product } from "../Product/ProductItem";

const RecipeValidator = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name should be a minimum of 2 characters" }),
    categoryId: z.number().int(),
    products: z
      .array(
        z.object({
          productId: z.number().int(),
        })
      )
      .nonempty({ message: "At least one product must be selected" }),
  })
  .strict();

export type Recipe = z.infer<typeof RecipeValidator>;

const AddNewRecipe = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    { productId: number }[]
  >([]);
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Recipe>({
    resolver: zodResolver(RecipeValidator),
  });

  console.log({ errors });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (!storedToken) {
      setAuthError("You are not authorized. Redirecting to login...");
      return;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const responseCategories = await fetch(
          `http://localhost:3001/categories`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const responseProducts = await fetch(`http://localhost:3001/products`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!responseCategories.ok || !responseProducts.ok) {
          throw new Error("Network response was not ok");
        }

        const resCategories = await responseCategories.json();
        const resProducts = await responseProducts.json();

        setCategories(resCategories);
        setProducts(resProducts);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setAuthError("Something went wrong. Please try again later.");
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (selectedProducts && selectedProducts[0]) {
      setValue("products", [selectedProducts[0], ...selectedProducts.slice(1)]);
    }
  }, [selectedProducts, setValue]);

  const onSubmitForm = async (data: Recipe) => {
    try {
      const response = await fetch("http://localhost:3001/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const responseData = await response.json();
      setRecipes([...recipes, responseData]);
      reset();
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  const handleAddProduct = (productId: number) => {
    if (!selectedProducts.find((product) => product.productId === productId)) {
      setSelectedProducts([...selectedProducts, { productId }]);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts(
      selectedProducts.filter((product) => product.productId !== productId)
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <h1>Add new recipe</h1>
        {authError && <p>{authError}</p>}
        <label htmlFor="name">Name</label>
        <input id="name" type="text" {...register("name")} />
        {errors.name && <p>{errors.name.message}</p>}

        <label htmlFor="categoryId">Category</label>
        <select
          id="categoryId"
          defaultValue={categories[0].id}
          {...register("categoryId", { valueAsNumber: true })}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p>{errors.categoryId.message}</p>}

        <label htmlFor="products">Products</label>
        <div>
          <select
            id="product-list"
            onChange={(e) => handleAddProduct(Number(e.target.value))}
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          <ul>
            {selectedProducts.map((product) => (
              <li key={product.productId}>
                {products.find((p) => p.id === product.productId)?.name}{" "}
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(product.productId)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <input type="hidden" {...register("products")} value={"hello"} />
        </div>
        {errors.products && (
          <p className="error-message">{errors.products.message}</p>
        )}

        <button type="submit">Add recipe</button>
      </form>
    </>
  );
};

export default AddNewRecipe;

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Category } from "./RecipeList";
// import { Product } from "../Product/ProductItem";

// const RecipeValidator = z
//   .object({
//     name: z
//       .string()
//       .min(2, { message: "Name should be a minimum of 2 characters" }),
//     categoryId: z.number().int(),
//     products: z
//       .array(
//         z.object({
//           productId: z.string(),
//           quantity: z
//             .number()
//             .min(1, { message: "Quantity should be at least 1" }),
//         })
//       )
//       .nonempty({ message: "At least one product must be selected" }),
//   })
//   .strict();

// export type Recipe = z.infer<typeof RecipeValidator>;

// const AddNewRecipe = () => {
//   const [recipes, setRecipes] = useState<Recipe[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
//   const [token, setToken] = useState<string | null>(null);
//   const [authError, setAuthError] = useState<string | null>(null);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm<Recipe>({
//     resolver: zodResolver(RecipeValidator),
//   });

//   console.log({ errors });

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     setToken(storedToken);
//     if (!storedToken) {
//       setAuthError("You are not authorized. Redirecting to login...");
//       return;
//     }
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!token) return;
//       try {
//         const responseCategories = await fetch(
//           `http://localhost:3001/categories`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const responseProducts = await fetch(`http://localhost:3001/products`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!responseCategories.ok || !responseProducts.ok) {
//           throw new Error("Network response was not ok");
//         }

//         const resCategories = await responseCategories.json();
//         const resProducts = await responseProducts.json();

//         console.log("Fetched categories:", resCategories);
//         console.log("Fetched products:", resProducts);

//         setCategories(resCategories);
//         setProducts(resProducts);
//       } catch (error) {
//         console.error("Failed to fetch data", error);
//         setAuthError("Something went wrong. Please try again later.");
//       }
//     };

//     fetchData();
//   }, [token]);

//   useEffect(() => {
//     if (!selectedProducts) {
//       setValue("products", selectedProducts);
//     } else {
//       setValue("products", [""]);
//     }
//   }, [selectedProducts, setValue]);

//   const onSubmitForm = async (data: Recipe) => {
//     try {
//       const response = await fetch("http://localhost:3001/recipes", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to submit data");
//       }

//       const responseData = await response.json();
//       setRecipes(responseData);
//       reset();
//     } catch (error) {
//       console.error("Something went wrong", error);
//     }
//   };

//   const handleAddProduct = (product: string) => {
//     if (!selectedProducts.includes(product)) {
//       setSelectedProducts([...selectedProducts, product]);
//     }
//   };

//   const handleRemoveProduct = (product: string) => {
//     setSelectedProducts(selectedProducts.filter((item) => item !== product));
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit(onSubmitForm)}>
//         <h1>Add new recipe</h1>
//         {authError && <p>{authError}</p>}
//         <label htmlFor="name">Name</label>
//         <input id="name" type="text" {...register("name")} />
//         {errors.name && <p>{errors.name.message}</p>}

//         <label htmlFor="category">Category</label>
//         <select id="category" {...register("category")}>
//           {categories.map((category) => (
//             <option key={category.name} value={category.name}>
//               {category.name}
//             </option>
//           ))}
//         </select>
//         {errors.category && <p>{errors.category.message}</p>}

//         <label htmlFor="products">Products</label>
//         <div>
//           <select
//             id="product-list"
//             onChange={(e) => handleAddProduct(e.target.value)}
//           >
//             <option value="">Select a product</option>
//             {products.map((product) => (
//               <option key={product.id} value={product.name}>
//                 {product.name}
//               </option>
//             ))}
//           </select>
//           <ul>
//             {selectedProducts.map((product) => (
//               <li key={product}>
//                 {product}{" "}
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveProduct(product)}
//                 >
//                   Remove
//                 </button>
//               </li>
//             ))}
//           </ul>
//           <input
//             type="hidden"
//             {...register("products")}
//             value={selectedProducts.join(",")}
//           />
//         </div>
//         {errors.products && (
//           <p className="error-message">{errors.products.message}</p>
//         )}

//         <button type="submit">Add recipe</button>
//       </form>
//       {recipes.length ? recipes.map((recipe) => recipe.name) : ""}
//     </>
//   );
// };

// export default AddNewRecipe;
