interface Icontent {
  contentType: "video" | "pdf";
  topic: string;
  content: {
    url: string;
    publicId: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type { Icontent };
