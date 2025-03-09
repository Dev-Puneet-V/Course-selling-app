export interface Image {
  url: string;
  publicId: string;
}

export interface Course {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: Image;
  owner: string;
  subscribers: string[];
  contents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseFormData {
  name: string;
  price: number;
  description: string;
  course: File | null;
}

export interface CourseState {
  data: Course[];
  loading: boolean;
  error: string | null;
}

export interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
  success: boolean;
}
