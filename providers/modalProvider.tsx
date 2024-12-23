"use client";
import { useState, useEffect } from "react";
import { StoreModal } from "@/components/modals/storeModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted){
    return null;
  }

  return (
    <>
    <StoreModal />
    </>
  )
};
