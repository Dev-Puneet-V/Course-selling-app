import mongoose from "mongoose";

interface Icourse {
  name: string;
  price: number;
  subscribers: mongoose.Types.ObjectId[];
  description: string;
  image: {
    url: string;
    publicId: string;
  };
  contents: mongoose.Types.ObjectId[];
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type { Icourse };
