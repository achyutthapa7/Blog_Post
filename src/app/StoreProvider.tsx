"use client";
import { useEffect, useRef } from "react";
import { Provider, useDispatch } from "react-redux";
import { AppDispatch, store } from "./lib/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
