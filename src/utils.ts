import toast from "react-hot-toast";

export const SERVER_DOMAIN = `${process.env.NEXT_PUBLIC_API_URL}`;

export const notify = (text: string) => {
  toast.success(text);
};
