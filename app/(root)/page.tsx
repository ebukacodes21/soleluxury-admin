"use client";
import { useEffect } from "react";
import { useStoreModal } from "@/hooks/useStoreModal";

export default function Home() {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    <p>root</p>
  );
}
