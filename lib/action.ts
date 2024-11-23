"use server";
import { z } from "zod";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getImageById } from "./data";

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

const EditSchema = z.object({
  title: z.string().min(1),
  image: z
    .instanceof(File)
    .refine((file) => file.size === 0 || file.type.startsWith("image/"), {
      message: "only images are allowed",
    })
    .refine((file) => file.size < 4000000, {
      message: "Image must less then 4Mb",
    }).optional(),
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

  const { title, image } = validatedFields.data;
  const { url } = await put(image.name, image, {
    access: "public",
    multipart: true,
  });

  try {
    await prisma.upload.create({
      data: {
        title,
        image: url,
      },
    });
  } catch (err) {
    return {
      message: "Something went wrong",
    };
  }
  revalidatePath("/");
  redirect("/");
};



export const updateImage = async (
  id: string,
  prevState: unknown,
  data: FormData
) => {
  const validatedFields = EditSchema.safeParse(
    Object.fromEntries(data.entries())
  );

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const dataImage = await getImageById(id);
  if(!dataImage) return {message: "No data found"}
  let imagePath
  const { title, image } = validatedFields.data;
  if(!image || image.size <= 0) {
    imagePath = dataImage.image;
  } else {
    await del(dataImage.image);
    const { url } = await put(image.name, image, {
      access: "public",
      multipart: true,
    });
    imagePath = url
  }
  
  try {
    await prisma.upload.update({
      data: {
        title,
        image: imagePath,
      },
      where: {id}
    });
  } catch (err) {
    return {
      message: "Something went wrong",
    };
  }
  revalidatePath("/");
  redirect("/");
};


export const deleteImage = async (id: string): Promise<any> => {
  const data = await getImageById(id);
  if (!data) {
    return {
      message: "No data found",
    };
  }
  // Hapus data di blob
  await del(data.image);

  try {
    await prisma.upload.delete({
      where: { id },
    });
  } catch (error) {
    return { message: "Failed to delete data" };
  }
  revalidatePath("/");
};
