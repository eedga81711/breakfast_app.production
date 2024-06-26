/* eslint-disable no-unused-vars */
import { React, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

//icons imports
import { FaUser, FaUsers } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { GiCash } from "react-icons/gi";
import { IoFastFood, IoCartOutline } from "react-icons/io5";

//Other imports
import Notification from "./Notification";

import { menu, close } from "../../assets";
import PropTypes from "prop-types";

import { ModalContext } from "../../contexts/ModalContext";
import axios from "axios";
import { baseUrl } from "../../constants";

const Navbar = ({ fetchProductData, fetchData }) => {
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  Navbar.propTypes = {
    fetchData: PropTypes.func,
    fetchProductData: PropTypes.func,
  };

  const name = "eedga";

  const { data, setData, pdtData, setPdtData } = useContext(ModalContext);

  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    const storedUserRole = localStorage.getItem("role");
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
    const storedUserName = localStorage.getItem("name");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    // console.log(userId);
    // console.log(token);
    // console.log(userRole);
    // console.log(userName);
  }, [token, userName, userRole, userId]);

  return (
    <div className="surface-ground px-0 py-2 md:px-4 lg:px-6">
      <div className="grid">
        <div className="flex justify-between col-12">
          <div className="flex flex-col text-black">
            <h5 className="">Hello, {userName}</h5>
            <span>{userRole}</span>
            <p className="font-semibold text-[12px]">{formattedDate}</p>
          </div>

          {/* <div className="flex gap-4 items-center">
            <Link to="/Admin/Dashboard/user_account/">
              <FaUser className="w-[20px] h-[20px] text-black" />
            </Link>

            <Notification className="w-[20px] h-[20px] text-black" />

            <Link to="/Admin/Dashboard/user_settings/">
              <IoSettings className="w-[20px] h-[20px] text-black" />
            </Link>
          </div> */}
        </div>
      </div>

      <div className="grid nav.cards rounded">
        <div className="py-2 px-2 nav_card card-1 col-12 md:col-6 lg:col-3">
          <div className="flex justify-between mb-3">
            <div>
              <span className="block text-primary font-medium mb-3">
                Orders
              </span>
              <div className="text-black font-medium text-xl">152</div>
            </div>
            <div
              className="flex items-center justify-center bg-cyan rounded"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <IoCartOutline className="text-xl" />
            </div>
          </div>
          <span className="text-black font-medium">24 new </span>
          <span className="text-primary">since yesterday</span>
        </div>

        <div className="py-2 px-2 nav_card col-12 md:col-6 lg:col-3">
          <div className="flex justify-between mb-3">
            <div>
              <span className="block text-primary font-medium mb-3">
                Budget
              </span>
              <div className="text-black font-medium text-xl">$20,000</div>
            </div>
            <div
              className="flex items-center justify-center bg-cyan rounded"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <GiCash className="text-xl" />
            </div>
          </div>
          <span className="text-black font-medium">-$6000 </span>
          <span className="text-primary">since last week</span>
        </div>

        <div className="py-2 px-2 nav_card col-12 md:col-6 lg:col-3">
          <div className="flex justify-between mb-3">
            <div>
              <span className="block text-primary font-medium mb-3">Users</span>
              <div className="text-black font-medium text-xl">
                {data.length}
              </div>
            </div>
            <div
              className="flex items-center justify-center bg-cyan rounded"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <FaUsers className="text-xl" />
            </div>
          </div>
          <span className="text-black font-medium">12 </span>
          <span className="text-primary">newly registered</span>
        </div>

        <div className="py-2 px-2 nav_card card-4 col-12 md:col-6 lg:col-3">
          <div className="flex justify-between mb-3">
            <div>
              <span className="block text-primary font-medium mb-3">
                Products
              </span>
              <div className="text-black font-medium text-xl">
                {pdtData.length}
              </div>
            </div>
            <div
              className="flex items-center justify-center bg-cyan rounded"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <IoFastFood className="text-xl" />
            </div>
          </div>
          <span className="text-black font-medium">06 </span>
          <span className="text-primary">newly added</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
