import React, { useState } from "react";
import { useLoginMutation } from "../services/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../slices/userSlice";
import Cookies from "js-cookie";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting login with:", { username, password });
      const response = await login({ username, password }).unwrap();
      console.log("Login successful, received response:", response);
      const { token, user } = response;
      console.log("Received token:", token);
      console.log("Received user:", user);

      // Store token and user information in cookies
      Cookies.set("token", token, { expires: 7 }); // expires in 7 days
      Cookies.set("username", user.username, { expires: 7 });
      Cookies.set("email", user.email, { expires: 7 });
      Cookies.set("role", user.role, { expires: 7 });

      // Dispatch user information to the Redux store
      dispatch(setUser(user));

      window.location.href = "/"; // Redirect to home page
    } catch (err) {
      console.error("Failed to login:", err);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex h-16 shrink-0 items-center justify-center">
          <div className="flex h-16 shrink-0 items-end">
            <h1 className=" text-4xl font-bold">SIMPLE</h1>
            <span className=" text-xs ml-2"> Powered by MIO</span>
          </div>
        </div>
        <h2 className="mt-10 text-center text-xl font-bold leading-9 tracking-tight text-gray-900">
          Connectez vous à votre restaurant
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm"></div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block px-5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        {isError && (
          <div className="mt-2 text-center text-sm text-red-600">
            Failed to login: {error?.data?.message || error?.error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
