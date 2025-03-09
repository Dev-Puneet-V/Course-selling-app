import React, { useState } from "react";
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

const ADMIN_ITEMS = [
  { name: "Courses", icon: HomeIcon, path: "/course/explore" },
  // { name: "Profile", icon: UserIcon, path: "/profile" },
  // { name: "Settings", icon: Cog6ToothIcon, path: "/settings" },
];

const USER_ITEMS = [
  { name: "Explore", icon: HomeIcon, path: "/course/explore" },
  { name: "Purchases", icon: UserIcon, path: "/course/me" },
];

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const authenticationData = useRecoilValue(authState);
  const data =
    authenticationData?.user?.role === "admin" ? ADMIN_ITEMS : USER_ITEMS;

  return (
    <div className="flex">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden p-2 m-2 rounded bg-[#1E1E1E] text-[#00FFAA] hover:bg-[#00FFAA] hover:text-black transition-colors duration-300 fixed z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
        <></>
          // <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative bg-[#1E1E1E] text-white h-full w-64 p-4 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 border-r border-[#242424] z-40`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#FFD700]">Dashboard</h2>
          {/* Close Button (Visible only on mobile) */}
          <button
            className="md:hidden text-[#00FFAA] hover:text-[#FFD700] transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Items */}
        <ul className="space-y-2">
          {data?.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="flex items-center gap-3 p-3 text-[#00FFAA] hover:bg-[#242424] hover:text-[#FFD700] rounded-lg transition-colors duration-300"
                onClick={() => setIsOpen(false)} // Close sidebar on mobile after clicking a link
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)} // Close sidebar when clicking outside
        />
      )}
    </div>
  );
};

export default Sidebar;
