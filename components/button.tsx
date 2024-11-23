"use client";
import { useFormStatus } from "react-dom";
import clsx from "clsx";
import Link from "next/link";

export const SubmitButton = ({ label }: { label: string }) => {
  const { pending } = useFormStatus();

  const classname = clsx(
    "bg-blue-700 text-white w-full font-medium py-2.5 px-6 text-base rounded-sm hover:bg-blue-600",
    {
      "opacity-50 cursor-progress": pending,
    }
  );
  return (
    <button type="submit" disabled={pending} className={classname}>
      {label === "upload" ? (
        <>{pending ? "Uploading..." : "Upload"}</>
      ) : (
        <>{pending ? "Updating..." : "Update"}</>
      )}
    </button>
  );
};

export const EditButton = ({id}: {id: string}) => {
  return (
    <Link href={`edit/${id}`} className="py-3 text-sm bg-gray-50 rounded-bl-md hover:bg-gray-100 text-center">Edit</Link>
  )
}

export const DeleteButton = ({ id }: { id: string }) => {
  return (
    <form className="py-3 text-sm bg-gray-50 rounded-bl-md hover:bg-gray-100 text-center">
      <button type="submit">Delete</button>
    </form>
  );
};