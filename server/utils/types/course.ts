import mongoose from "mongoose";

interface ISubscriber {
  user: mongoose.Types.ObjectId;
  joinedAt: Date;
}

interface Icourse {
  name: string;
  price: number;
  subscribers: ISubscriber[];
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

export type { Icourse, ISubscriber };
