// import { zodResolver } from "@hookform/resolvers/zod";
// import { useEffect, useState, ChangeEvent } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import toast from "react-hot-toast";

// import { useRouter } from "next/router";
// import Link from "next/link";

// const MAX_FILE_SIZE = 1024 * 1024 * 5;
// const ACCEPTED_IMAGE_MIME_TYPES = [
//   "image/jpeg",
//   "image/jpg",
//   "image/png",
//   "image/webp",
// ];
// const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];

// const ProductValidator = z
//   .object({
//     name: z
//       .string()
//       .min(2, { message: "Name should be a minimum of 2 characters" }),
//     unit: z.string().min(1, { message: "Unit should not be empty" }),
//     quantity: z.preprocess(
//       (val) => Number(val),
//       z.number().min(0, { message: "Quantity should be non-negative" })
//     ),
//     protein: z.preprocess(
//       (val) => Number(val),
//       z.number().min(0, { message: "Protein should be non-negative" })
//     ),
//     carbs: z.preprocess(
//       (val) => Number(val),
//       z.number().min(0, { message: "Carbs should be non-negative" })
//     ),
//     fat: z.preprocess(
//       (val) => Number(val),
//       z.number().min(0, { message: "Fat should be non-negative" })
//     ),
//     calories: z.preprocess(
//       (val) => Number(val),
//       z.number().min(0, { message: "Calories should be non-negative" })
//     ),
//     // imageUrl: z.string().url().optional(),
//     image: z
//       .any()
//       .refine((files) => {
//         console.log({ files });
//         return files?.[0]?.size <= MAX_FILE_SIZE;
//       }, `Max image size is 5MB.`)
//       .refine(
//         (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
//         "Only .jpg, .jpeg, .png and .webp formats are supported."
//       ),
//   })
//   .strict();

// export type Product = z.infer<typeof ProductValidator>;

// const notify = () => {
//   toast.success("Product was added");
// };

// const AddNewProduct = () => {
//   const [token, setToken] = useState<string | null>(null);
//   const [authError, setAuthError] = useState<string | null>(null);
//   const [image, setImage] = useState<File | null>(null);
//   const [imageUrl, setImageUrl] = useState<string>("");
//   const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
//   const [file, setFile] = useState<File | undefined>();

//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<Product>({
//     resolver: zodResolver(ProductValidator),
//   });

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     setToken(storedToken);
//     if (!storedToken) {
//       setAuthError("You are not authorized. Redirecting to login...");
//       return;
//     }
//   }, []);

//   //   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//   //     if (e.target.files && e.target.files[0]) {
//   //       setImage(e.target.files[0]);
//   //     }
//   //   };

//   function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
//     const target = e.target as HTMLInputElement & {
//       files: FileList;
//     };

//     console.log({ target });

//     setFile(target.files[0]);
//   }
//   console.log({ file });

//   const handleImageChange = (e: React.FormEvent<HTMLInputElement>) => {
//     const target = e.target as HTMLInputElement & {
//       files: FileList;
//     };

//     setFile(target.files[0]);

//     const file = new FileReader();

//     file.onload = function () {
//       setPreview(file.result);
//     };

//     file.readAsDataURL(target.files[0]);
//   };

//   const onSubmitForm = async (data: Product) => {
//     if (typeof file === "undefined") return;
//     const formData = new FormData();
//     formData.append("name", data.name);
//     formData.append("unit", data.unit);
//     formData.append("quantity", data.quantity.toString());
//     formData.append("protein", data.protein.toString());
//     formData.append("carbs", data.carbs.toString());
//     formData.append("fat", data.fat.toString());
//     formData.append("calories", data.calories.toString());
//     formData.append("file", file);

//     if (image) {
//       formData.append("image", image);
//     } else if (imageUrl) {
//       formData.append("imageUrl", imageUrl);
//     }

//     try {
//       const response = await fetch("http://localhost:3000/products", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       console.log({ response });

//       if (!response.ok) {
//         throw new Error("Failed to submit data");
//       }

//       notify();
//       router.push("/products");
//       reset();
//     } catch (error) {
//       console.error("Something went wrong", error);
//     }
//   };
//   console.log({ errors });

//   return (
//     <div
//       className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
//       style={{
//         backgroundImage: "url('./background-images/add-new-recipe-page.jpg')",
//       }}
//     >
//       <div className="bg-white bg-opacity-80 shadow-md rounded-lg p-8 max-w-md w-full">
//         <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
//         {authError && <p className="text-red-500">{authError}</p>}
//         <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
//           <div>
//             <label htmlFor="name" className="block text-gray-700">
//               Product Name
//             </label>
//             <input
//               id="name"
//               type="text"
//               {...register("name")}
//               className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//                 errors.name ? "border-red-500" : ""
//               }`}
//             />
//             {errors.name && (
//               <p className="text-red-500">{errors.name.message}</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="unit" className="block text-gray-700">
//               Unit
//             </label>
//             <input
//               id="unit"
//               type="text"
//               {...register("unit")}
//               className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//                 errors.unit ? "border-red-500" : ""
//               }`}
//             />
//             {errors.unit && (
//               <p className="text-red-500">{errors.unit.message}</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="quantity" className="block text-gray-700">
//               Quantity
//             </label>
//             <input
//               id="quantity"
//               type="number"
//               {...register("quantity")}
//               className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//                 errors.quantity ? "border-red-500" : ""
//               }`}
//             />
//             {errors.quantity && (
//               <p className="text-red-500">{errors.quantity.message}</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="protein" className="block text-gray-700">
//               Protein
//             </label>
//             <input
//               id="protein"
//               type="number"
//               {...register("protein")}
//               className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//                 errors.protein ? "border-red-500" : ""
//               }`}
//             />
//             {errors.protein && (
//               <p className="text-red-500">{errors.protein.message}</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="carbs" className="block text-gray-700">
//               Carbs
//             </label>
//             <input
//               id="carbs"
//               type="number"
//               {...register("carbs")}
//               className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//                 errors.carbs ? "border-red-500" : ""
//               }`}
//             />
//             {errors.carbs && (
//               <p className="text-red-500">{errors.carbs.message}</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="fat" className="block text-gray-700">
//               Fat
//             </label>
//             <input
//               id="fat"
//               type="number"
//               {...register("fat")}
//               className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//                 errors.fat ? "border-red-500" : ""
//               }`}
//             />
//             {errors.fat && <p className="text-red-500">{errors.fat.message}</p>}
//           </div>

//           <div>
//             <label htmlFor="calories" className="block text-gray-700">
//               Calories
//             </label>
//             <input
//               id="calories"
//               type="number"
//               {...register("calories")}
//               className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//                 errors.calories ? "border-red-500" : ""
//               }`}
//             />
//             {errors.calories && (
//               <p className="text-red-500">{errors.calories.message}</p>
//             )}
//           </div>

//           {/* <div>
//             <label htmlFor="imageUrl" className="block text-gray-700">
//               Image URL
//             </label>
//             <input
//               id="imageUrl"
//               type="url"
//               {...register("imageUrl")}
//               className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//                 errors.imageUrl ? "border-red-500" : ""
//               }`}
//               onChange={(e) => setImageUrl(e.target.value)}
//             />
//             {errors.imageUrl && (
//               <p className="text-red-500">{errors.imageUrl.message}</p>
//             )}
//           </div> */}

//           <div>
//             <label htmlFor="image" className="block text-gray-700">
//               Image File
//             </label>
//             <input
//               id="image"
//               type="file"
//               onChange={handleOnChange}
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             />
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700"
//             >
//               Add Product
//             </button>
//           </div>
//           <div className="flex justify-between items-center mb-6">
//             <Link href="/products">
//               <span className="inline-block align-baseline font-medium text-sm text-green-600 hover:text-green-800">
//                 Go back to Products
//               </span>
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddNewProduct;

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, ChangeEvent } from "react";
import { useForm, FieldError } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";

import { useRouter } from "next/router";
import Link from "next/link";

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];

const ProductValidator = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name should be a minimum of 2 characters" }),
    unit: z.string().min(1, { message: "Unit should not be empty" }),
    quantity: z.preprocess(
      (val) => Number(val),
      z.number().min(0, { message: "Quantity should be non-negative" })
    ),
    protein: z.preprocess(
      (val) => Number(val),
      z.number().min(0, { message: "Protein should be non-negative" })
    ),
    carbs: z.preprocess(
      (val) => Number(val),
      z.number().min(0, { message: "Carbs should be non-negative" })
    ),
    fat: z.preprocess(
      (val) => Number(val),
      z.number().min(0, { message: "Fat should be non-negative" })
    ),
    calories: z.preprocess(
      (val) => Number(val),
      z.number().min(0, { message: "Calories should be non-negative" })
    ),
    file: z
      .any()
      .refine((files) => {
        return files?.[0]?.size <= MAX_FILE_SIZE;
      }, `Max image size is 5MB.`)
      .refine(
        (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      ),
  })
  .strict();

export type Product = z.infer<typeof ProductValidator>;

const notify = () => {
  toast.success("Product was added");
};

const AddNewProduct = () => {
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [file, setFile] = useState<File | undefined>();
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  console.log({ file });
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Product>({
    resolver: zodResolver(ProductValidator),
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (!storedToken) {
      setAuthError("You are not authorized. Redirecting to login...");
      router.push("/login");
    }
  }, [router]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);

      const reader = new FileReader();
      reader.onload = function () {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  console.log({ errors });

  const onSubmitForm = async (data: Product) => {
    console.log({ file });
    if (typeof file === "undefined") return;
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("unit", data.unit);
    formData.append("quantity", data.quantity.toString());
    formData.append("protein", data.protein.toString());
    formData.append("carbs", data.carbs.toString());
    formData.append("fat", data.fat.toString());
    formData.append("calories", data.calories.toString());
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      notify();
      //   router.push("/products");
      //   reset();
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('./background-images/add-new-recipe-page.jpg')",
      }}
    >
      <div className="bg-white bg-opacity-80 shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
        {authError && <p className="text-red-500">{authError}</p>}
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700">
              Product Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message as string}</p>
            )}
          </div>

          <div>
            <label htmlFor="unit" className="block text-gray-700">
              Unit
            </label>
            <input
              id="unit"
              type="text"
              {...register("unit")}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.unit ? "border-red-500" : ""
              }`}
            />
            {errors.unit && (
              <p className="text-red-500">{errors.unit.message as string}</p>
            )}
          </div>

          <div>
            <label htmlFor="quantity" className="block text-gray-700">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              {...register("quantity")}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.quantity ? "border-red-500" : ""
              }`}
            />
            {errors.quantity && (
              <p className="text-red-500">
                {errors.quantity.message as string}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="protein" className="block text-gray-700">
              Protein
            </label>
            <input
              id="protein"
              type="number"
              {...register("protein")}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.protein ? "border-red-500" : ""
              }`}
            />
            {errors.protein && (
              <p className="text-red-500">{errors.protein.message as string}</p>
            )}
          </div>

          <div>
            <label htmlFor="carbs" className="block text-gray-700">
              Carbs
            </label>
            <input
              id="carbs"
              type="number"
              {...register("carbs")}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.carbs ? "border-red-500" : ""
              }`}
            />
            {errors.carbs && (
              <p className="text-red-500">{errors.carbs.message as string}</p>
            )}
          </div>

          <div>
            <label htmlFor="fat" className="block text-gray-700">
              Fat
            </label>
            <input
              id="fat"
              type="number"
              {...register("fat")}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.fat ? "border-red-500" : ""
              }`}
            />
            {errors.fat && (
              <p className="text-red-500">{errors.fat.message as string}</p>
            )}
          </div>

          <div>
            <label htmlFor="calories" className="block text-gray-700">
              Calories
            </label>
            <input
              id="calories"
              type="number"
              {...register("calories")}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.calories ? "border-red-500" : ""
              }`}
            />
            {errors.calories && (
              <p className="text-red-500">
                {errors.calories.message as string}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="image" className="block">
              <span className="sr-only">Choose file</span>
              <input
                id="file"
                type="file"
                {...register("file")}
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-green-50 file:text-green-700
                          hover:file:bg-green-100
                        "
              />
            </label>

            {errors.file && (
              <p className="text-red-500">
                {(errors.file as FieldError).message}
              </p>
            )}
          </div>
          {preview && (
            <div className="mt-4">
              <img
                src={preview as string}
                alt="Image Preview"
                className="w-full h-auto rounded-md"
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700"
            >
              Add Product
            </button>
          </div>
          <div className="flex justify-between items-center mb-6">
            <Link href="/products">
              <span className="inline-block align-baseline font-medium text-sm text-green-600 hover:text-green-800">
                Go back to Products
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewProduct;

{
  /* <label htmlFor="image" className="block text-gray-700">
              Image File
            </label>
            <input
              id="file"
              type="file"
              {...register("file")}
              onChange={handleImageChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            /> */
}
