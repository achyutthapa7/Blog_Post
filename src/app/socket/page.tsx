// "use client";
// import React, { useState } from "react";
// import { io } from "socket.io-client";
// const page = () => {
//   const [text, setText] = useState("");
//   const [showMessages, setShowMessages] = useState<string[]>([]);
//   const socket = io("http://localhost:3000");

//   socket.on("send-message", (message) => {
//     setShowMessages([...showMessages, message]);
//     setText("");
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!text) alert("field is required");
//     socket.emit("send-message", text);
//     console.log(text);
//   };
//   socket.on("send-message", () => {});
//   return (
//     <div className="p-2">
//       <form action="" onSubmit={handleSubmit}>
//         <input
//           className="border-black border-2 pl-4"
//           type="text"
//           onChange={(e) => setText(e.target.value)}
//           value={text}
//         />
//         <button className="cursor-pointer px-4 py-3 bg-blue-500 text-white ml-2 rounded-2xl">
//           send
//         </button>
//       </form>

//       <div>
//         {showMessages.map((message, i) => (
//           <p key={i}>{message}</p>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default page;
import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;
