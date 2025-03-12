"use client";
import React from "react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles
const TextEditor = () => {
  const [value, setValue] = useState("");
  return (
    <div>
      <ReactQuill value={value} onChange={setValue} />
      <div style={{ marginTop: "20px" }}>
        <strong>Output:</strong>
        <div dangerouslySetInnerHTML={{ __html: value }} />
      </div>
    </div>
  );
};

export default TextEditor;
