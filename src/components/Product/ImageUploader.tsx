import React from "react";
import { ImageUploaderProps } from "./types";

const ImageUploader = ({
  id,
  register,
  error,
  preview,
  onImageChange,
  onRemoveImage,
}: ImageUploaderProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-gray-700">
        <span className="sr-only">Choose file</span>
        <input
          id={id}
          type="file"
          {...register}
          onChange={onImageChange}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
        />
      </label>
      {error && <p className="text-red-500">{error.message}</p>}
      {preview && (
        <div className="mt-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview as string}
            alt="Image Preview"
            className="w-full h-auto rounded-md"
          />
          <button
            type="button"
            onClick={onRemoveImage}
            className="inline-block align-baseline font-medium text-sm text-red-600 hover:text-red-800"
          >
            Remove Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
