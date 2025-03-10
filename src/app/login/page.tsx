// "use client";
// import React, { useEffect, useState } from "react";
// import { login } from "../utils/requests";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../lib/store";
// import { setIsAuthenticated } from "../lib/features/user/userSlice";
// import { useRouter } from "next/navigation";

// const LoginForm: React.FC = () => {
//   const router = useRouter();
//   const dispatch = useDispatch<AppDispatch>();
//   const { isAuthenticated } = useSelector((state: RootState) => state.user);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   if (isAuthenticated) {
//     router.push("/home");
//   }

//   // Handle input change
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsLoading(true);
//     const res = await login({
//       email: formData.email,
//       password: formData.password,
//     });
//     if (res?.status === 200) {
//       setIsLoading(false);
//       dispatch(setIsAuthenticated(true));
//       router.push("/home");
//       return null;
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

//         {/* Email Input */}
//         <div className="mb-4">
//           <label
//             htmlFor="email"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Email
//           </label>
//           <input
//             type="text"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>

//         {/* Password Input */}
//         <div className="mb-6">
//           <label
//             htmlFor="password"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Password
//           </label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleInputChange}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           {isLoading ? "loading" : "login"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginForm;

import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;
