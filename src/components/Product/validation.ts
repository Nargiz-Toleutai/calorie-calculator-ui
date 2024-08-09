import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ProductValidator = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name should be a minimum of 2 characters" }),
    unit: z.string().min(1, { message: "Unit should not be empty" }),
    quantity: z.preprocess(
      (val) => Number(val),
      z.number().nonnegative({ message: "Quantity should be non-negative" })
    ),
    protein: z.preprocess(
      (val) => Number(val),
      z.number().nonnegative({ message: "Protein should be non-negative" })
    ),
    carbs: z.preprocess(
      (val) => Number(val),
      z.number().nonnegative({ message: "Carbs should be non-negative" })
    ),
    fat: z.preprocess(
      (val) => Number(val),
      z.number().nonnegative({ message: "Fat should be non-negative" })
    ),
    calories: z.preprocess(
      (val) => Number(val),
      z.number().min(0, { message: "Calories should be non-negative" })
    ),
    portion: z.preprocess(() => 0, z.number().min(0).default(0)),
    file: z
      .any()
      .optional()
      .refine((files) => {
        console.log({ f: files.length, files });
        return !files?.length || files?.[0]?.size <= MAX_FILE_SIZE;
      }, `Max image size is 5MB.`)
      .refine(
        (files) =>
          !files?.length ||
          ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      ),
  })
  .strict();

export type Product = z.infer<typeof ProductValidator>;
