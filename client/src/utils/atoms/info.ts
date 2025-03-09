import axios from "axios";
import { atom, selector, selectorFamily, DefaultValue } from "recoil";
import { Course, CourseState, ApiResponse } from "../../types/course";

interface InfoState {
  myCourses: Course[];
  purchases: Course[];
}

// Main state atoms
export const coursesState = atom<Course[]>({
  key: "coursesState",
  default: [],
});

export const purchasedCoursesState = atom<Course[]>({
  key: "purchasedCoursesState",
  default: [],
});

export const adminCoursesState = atom<CourseState>({
  key: "adminCoursesState",
  default: {
    data: [],
    loading: true,
    error: null,
  },
});

// Course operations
export const courseOperations = {
  addCourse: (courses: Course[], newCourse: Course): Course[] => {
    return [newCourse, ...courses];
  },
  removeCourse: (courses: Course[], courseId: string): Course[] => {
    return courses.filter((course) => course._id !== courseId);
  },
  updateCourse: (courses: Course[], updatedCourse: Course): Course[] => {
    return courses.map((course) =>
      course._id === updatedCourse._id ? updatedCourse : course
    );
  },
  purchaseCourse: (
    courses: Course[],
    courseId: string,
    userId: string
  ): Course[] => {
    return courses.map((course) =>
      course._id === courseId
        ? { ...course, subscribers: [...course.subscribers, userId] }
        : course
    );
  },
};

// Selectors
export const adminCoursesSelector = selector<Course[]>({
  key: "AdminCourseSelector",
  get: async () => {
    try {
      const response = await axios.get<ApiResponse<Course[]>>(
        `http://localhost:3000/api/v1/user/cources`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.data?.data) {
        throw new Error("No data received from server");
      }

      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching courses:", error.message);
        throw new Error(`Failed to fetch courses: ${error.message}`);
      }
      throw new Error("An unknown error occurred while fetching courses");
    }
  },
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) return;
    set(coursesState, newValue);
  },
});

export const courseByIdSelector = selectorFamily<Course | undefined, string>({
  key: "CourseById",
  get:
    (courseId: string) =>
    ({ get }) => {
      const courses = get(coursesState);
      return courses.find((course) => course._id === courseId);
    },
});

export const purchasedCoursesSelector = selector<Course[]>({
  key: "PurchasedCoursesSelector",
  get: async () => {
    try {
      const response = await axios.get<ApiResponse<Course[]>>(
        `http://localhost:3000/api/v1/course/all?type=me`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.data?.data) {
        throw new Error("No data received from server");
      }

      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching purchased courses:", error.message);
        throw new Error(`Failed to fetch purchased courses: ${error.message}`);
      }
      throw new Error(
        "An unknown error occurred while fetching purchased courses"
      );
    }
  },
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) return;
    set(purchasedCoursesState, newValue);
  },
});


export type {};

// when first user, goes on that route, it will load from db
