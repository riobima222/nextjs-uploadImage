"use server";
import { z } from "zod";
import { put } from "@vercel/blob";
import {prisma} from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const UploadSchema = z.object({
  title: z.string().min(1),
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "image is required" })
    .refine((file) => file.size === 0 || file.type.startsWith("image/"), {
      message: "only images are allowed",
    })
    .refine((file) => file.size < 4000000, {
      message: "Image must less then 4Mb",
    }),
});

export const uploadImage = async (prevState: unknown, data: FormData) => {
  const validatedFields = UploadSchema.safeParse(
    Object.fromEntries(data.entries())
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {title, image} = validatedFields.data;
  const {url} = await put(image.name, image, {access: "public", multipart: true})

  try {
    await prisma.upload.create({
        data: {
            title,
            image: url
        }
    })
  } catch(err) {
    return {
        message: "Something went wrong"
    }
  }
  revalidatePath("/");
  redirect("/")
};
