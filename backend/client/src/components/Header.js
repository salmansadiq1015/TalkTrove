import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useChat } from "../context/authContext";
import { FcSearch } from "react-icons/fc";
import { IoClose } from "react-icons/io5";
import Profile from "./Profile";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header({ show, setShow, setLeft }) {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(false);
  const { notification, setNotification, setSelectedChat } = useChat();
  const [shows, setShows] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuth({ ...auth, token: "", user: null });
    navigate("/");
  };
  return (
    <>
      <Disclosure as="nav" className="bg-gray-800 z-[999]">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button
                    className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setLeft(true)}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      alt="Your Company"
                    />
                  </div>
                  <div
                    className="  flex sm:hidden items-center gap-2 mt-1 ml-5 py-2 px-3 rounded-md border shadow-lg cursor-pointer hover:bg-gray-950"
                    onClick={() => setShow(!show)}
                  >
                    <FcSearch className="h-6 w-6 cursor-pointer" />{" "}
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div
                      className="flex items-center gap-2 mt-1 ml-5 py-2 px-3 rounded-md border shadow-lg cursor-pointer hover:bg-gray-950"
                      onClick={() => setShow(!show)}
                    >
                      <FcSearch className="h-6 w-6 cursor-pointer" />{" "}
                      <span className="text-[16] font-[500] text-white">
                        Search User
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <button
                    type="button"
                    onClick={() => setShows(!shows)}
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only"></span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                    {notification.length > 0 && (
                      <span className="absolute top-0 right-0 w-[1.2rem] h-[1.2rem] text-[12px] rounded-full bg-red-600 text-white cursor-pointer">
                        {notification.length}
                      </span>
                    )}
                  </button>
                  {shows && (
                    <div className="absolute z-[9999] top-[3rem] right-[5rem] w-[10rem] py-2 px-1  rounded-md shadow-md border border-gray-300 bg-gray-200 cursor-pointer ">
                      <span>{!notification.length && "No new messages"}</span>
                      {notification?.map((noti, i) => (
                        <div
                          className="w-full cursor-pointer rounded-md shadow-md shadow-gray-300 hover:shadow-lg hover:bg-gray-300 p-1 my-1 "
                          key={i}
                          onClick={() => {
                            setSelectedChat(noti?.chat);
                            setNotification(
                              notification.filter((n) => n !== noti)
                            );
                          }}
                        >
                          {noti?.chat?.isGroupChat
                            ? `New Message in ${noti?.chat?.chatName}`
                            : `New Message from ${
                                noti?.users[0]._id === auth.user.id
                                  ? noti?.users[1]?.name
                                  : noti?.users[0]?.name
                              }`}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-10 w-10 rounded-full"
                          src={auth?.user?.avatar}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <span
                              onClick={() => setProfile(true)}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                              )}
                            >
                              Your Profile
                            </span>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                              )}
                            >
                              Settings
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <span
                              onClick={handleLogout}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                              )}
                            >
                              Sign out
                            </span>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            {/* <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                <div
                  className="flex items-center gap-2 mt-1  py-2 px-3 rounded-md border shadow-lg cursor-pointer hover:bg-gray-950"
                  onClick={() => setShow(!show)}
                >
                  <FcSearch className="h-6 w-6 cursor-pointer" />{" "}
                  <span className="text-[16] font-[500] text-white">
                    Search User
                  </span>
                </div>
              </div>
            </Disclosure.Panel> */}
          </>
        )}
      </Disclosure>
      {profile && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[19rem] sm:w-[25rem] rounded-md shadow-lg py-5 px-3 flex flex-col gap-4 bg-black/50 z-50">
          <div className="flex items-center justify-end">
            <span
              className="p-[2px] border border-zinc-300 rounded-md cursor-pointer shadow-lg text-white hover:text-sky-500"
              onClick={() => setProfile(false)}
            >
              <IoClose className="h-5 w-5" />
            </span>
          </div>
          <Profile auth={auth} />
        </div>
      )}
    </>
  );
}
