"use client";
import { useEffect, useRef } from "react";
import { Provider, useDispatch } from "react-redux";
import { AppDispatch, store } from "./lib/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const storeRef = useRef<AppStore | null>(null);
  // if (!storeRef.current) {
  //   storeRef.current = makeStore();
  // }

  return <Provider store={store}>{children}</Provider>;
}
