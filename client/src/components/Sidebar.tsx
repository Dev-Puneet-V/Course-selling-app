import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useRecoilValue } from "recoil";
import authState from "../utils/atoms/auth";

const ADMIM_ITEMS = [
  { name: "Cources", icon: HomeIcon, path: "/course/explore" },
  //   { name: "", icon: UserIcon, path: "/profile" },
  //   { name: "Settings", icon: Cog6ToothIcon, path: "/settings" },
];

const USER_ITEMS = [
  { name: "Explore", icon: HomeIcon, path: "/course/explore" },
  { name: "Purchases", icon: UserIcon, path: "/course/me" },
];

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const authenticationData = useRecoilValue(authState);
  let data =
    authenticationData?.user?.role === "admin" ? ADMIM_ITEMS : USER_ITEMS;
  return (
    <div className="flex">
      <button
        className="md:hidden p-2 m-2 rounded bg-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      <div
        className={`fixed md:relative bg-gray-900 text-white h-full w-64 p-4 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300`}
      >
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <ul>
          {data?.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded transition"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
