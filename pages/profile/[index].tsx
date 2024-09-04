import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  FaUser,
  FaEnvelope,
  FaBirthdayCake,
  FaHome,
  FaPhone,
} from "react-icons/fa";
import { MdLock } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";

import { useRouter } from "next/router";

type User = {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: number;
    coordinates: {
      latitude: string;
      longitude: string;
    };
    timezone: {
      offset: string;
      description: string;
    };
  };
  email: string;
  login: {
    uuid: string;
    username: string;
    password: string;
    salt: string;
    md5: string;
    sha1: string;
    sha256: string;
  };
  dob: {
    date: string;
    age: number;
  };
  registered: {
    date: string;
    age: number;
  };
  phone: string;
  cell: string;
  id: {
    name: string;
    value: string;
  };
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
};

type ProfilePageProps = {
  user: User;
};



const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

type HoveredItem =
  | "name"
  | "email"
  | "birthday"
  | "address"
  | "phone"
  | "password"
  | "";

const Profile: React.FC<ProfilePageProps> = () => {
  const [selectedItem, setSelectedItem] = useState<HoveredItem>("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("selectedUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      window.location.href = "/";
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  const router = useRouter();

  const handleGoBack = () => {
    router.push("/");
  };

  const handleMouseEnter = (label: HoveredItem) => {
    setSelectedItem(label);
  };

  const handleClick = (label: HoveredItem) => {
    console.log(`Selected item: ${label}`); // Debug log
    setSelectedItem(label);
  };

  const getIconColor = (label: HoveredItem) => {
    return selectedItem === label ? "text-[#BE9F56]" : "text-gray-500";
  };

  return (
    <div className="bg-[#f9f9f9] transition-all duration-200 mb-20">
      <header className="w-full h-[500px] bg-[#2c2e31] text-white text-center overflow-hidden">
        <div className="relative max-w-6xl mx-auto pt-24">
          <button
            onClick={handleGoBack}
            className="p-2 bg-[#BE9F56] text-white rounded"
          >
            Go Back
          </button>
        </div>
      </header>

      <div className="relative -mt-[200px] max-w-4xl mx-auto p-6 text-center bg-white shadow-md rounded-lg">
        <div className="user_photo relative mx-auto mb-6 w-[150px] h-[150px] bg-white border border-gray-300 rounded-full overflow-hidden">
          <img
            src={user.picture.large}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex space-x-3 justify-center">
          <p className="text-gray-600 text-lg">Nationality: </p>
          {user.nat && (
            <img
              src={`https://flagcdn.com/${user.nat.toLowerCase()}.svg`}
              width="30"
              alt={`Flag of ${user.nat}`}
            />
          )}
        </div>

        <p id="user_title" className="text-gray-600 text-lg mb-2">
          {selectedItem === "phone"
            ? "My phone number is"
            : selectedItem === "name"
            ? "Hi, My name is"
            : selectedItem === "email"
            ? "My email address is"
            : selectedItem === "birthday"
            ? "My birthday is"
            : selectedItem === "address"
            ? "My address is"
            : selectedItem === "password"
            ? "My password is"
            : "My phone number is"}
        </p>
        <p id="user_value" className="text-[#2c2e31] text-3xl mb-2 capitalize">
          {selectedItem === "phone"
            ? user.phone
            : selectedItem === "name"
            ? `${user.name.title} ${user.name.first} ${user.name.last}`
            : selectedItem === "email"
            ? user.email
            : selectedItem === "birthday"
            ? new Date(user.dob.date).toLocaleDateString()
            : selectedItem === "address"
            ? `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country}, ${user.location.postcode}`
            : selectedItem === "password"
            ? user.login.password
            : user.phone}
        </p>

        <ul className="values_list list-none p-0 m-0 overflow-hidden flex flex-wrap justify-center">
          <li
            className="cursor-pointer relative p-4 w-32 h-12 bg-white border-b border-gray-200 transition-colors flex items-center justify-center"
            onMouseEnter={() => handleMouseEnter("name")}
            onClick={() => handleClick("name")}
          >
            <FaUser
              size={30}
              className={`transition-colors duration-300 ${getIconColor(
                "name"
              )}`}
            />
          </li>
          <li
            className="cursor-pointer relative p-4 w-32 h-12 bg-white border-b border-gray-200 transition-colors flex items-center justify-center"
            onMouseEnter={() => handleMouseEnter("email")}
            onClick={() => handleClick("email")}
          >
            <FaEnvelope
              size={30}
              className={`transition-colors duration-300 ${getIconColor(
                "email"
              )}`}
            />
          </li>
          <li
            className="cursor-pointer relative p-4 w-32 h-12 bg-white border-b border-gray-200 transition-colors flex items-center justify-center"
            onMouseEnter={() => handleMouseEnter("birthday")}
            onClick={() => handleClick("birthday")}
          >
            <FaCalendarAlt
              size={30}
              className={`transition-colors duration-300 ${getIconColor(
                "birthday"
              )}`}
            />
          </li>
          <li
            className="cursor-pointer relative p-4 w-32 h-12 bg-white border-b border-gray-200 transition-colors flex items-center justify-center"
            onMouseEnter={() => handleMouseEnter("address")}
            onClick={() => handleClick("address")}
          >
            <FaHome
              size={30}
              className={`transition-colors duration-300 ${getIconColor(
                "address"
              )}`}
            />
          </li>
          <li
            className="cursor-pointer relative p-4 w-32 h-12 bg-white border-b border-gray-200 transition-colors flex items-center justify-center"
            onMouseEnter={() => handleMouseEnter("phone")}
            onClick={() => handleClick("phone")}
          >
            <FaPhone
              size={30}
              className={`transition-colors duration-300 ${getIconColor(
                "phone"
              )}`}
            />
          </li>
          <li
            className="cursor-pointer relative p-4 w-32 h-12 bg-white border-b border-gray-200 transition-colors flex items-center justify-center"
            onMouseEnter={() => handleMouseEnter("password")}
            onClick={() => handleClick("password")}
          >
            <MdLock
              size={30}
              className={`transition-colors duration-300 ${getIconColor(
                "password"
              )}`}
            />
          </li>
        </ul>

        <div className="map-container mt-8">
          <MapComponent
            center={[
              parseFloat(user.location.coordinates.latitude),
              parseFloat(user.location.coordinates.longitude),
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
