import axios from "axios";
import { atom, selector } from "recoil";

const infoState = atom({
  key: "CourseInfoState",
  default: {
    myCources: [], // this is for admin
    purchases: [], // this is for nomal users
    //explore is not needed here
    //TODO: for now leave the content of the cources, just load it on every detailed view click
  },
});

export const adminCoursesState = atom<any[]>({
  key: "adminCoursesState",
  default: [],
});

const adminCourcesSelector = selector({
  key: "AdminCourceSelector",
  get: async ({ get }): Promise<any[]> => {
    const cachedData = get(adminCoursesState);
    if (cachedData?.length > 0) {
      return cachedData;
    }
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/user/cources`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data?.data || [];
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  },
});

const purchasesSelector = selector({
  key: "UserPurchasesSelector",
  get: ({ get }) => {
    const state = get(infoState);
    return state.purchases;
  },
});

export { infoState, adminCourcesSelector, purchasesSelector };

export type {};

// when first user, goes on that route, it will load from db
