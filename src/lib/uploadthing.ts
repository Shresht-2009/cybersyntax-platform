import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "./auth";

const f = createUploadthing();

const getUser = async () => {
  const session = await auth();
  return session?.user;
};

export const ourFileRouter = {
  announcementImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await getUser();
      if (!user) throw new Error("Unauthorized");
      return { userId: (user as any).id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url, userId: metadata.userId };
    }),

  resumeUpload: f({
    image: { maxFileSize: "4MB" },
    pdf: { maxFileSize: "4MB" },
  })
    .middleware(async () => {
      const user = await getUser();
      if (!user) throw new Error("Unauthorized");
      return { userId: (user as any).id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url, userId: metadata.userId };
    }),

  assignmentFile: f({
    image: { maxFileSize: "4MB" },
    pdf: { maxFileSize: "4MB" },
    video: { maxFileSize: "64MB" },
  })
    .middleware(async () => {
      const user = await getUser();
      if (!user) throw new Error("Unauthorized");
      return { userId: (user as any).id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url, userId: metadata.userId };
    }),

  courseVideo: f({ video: { maxFileSize: "128MB" } })
    .middleware(async () => {
      const user = await getUser();
      if (!user) throw new Error("Unauthorized");
      return { userId: (user as any).id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url, userId: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
