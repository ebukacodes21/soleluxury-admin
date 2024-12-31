"use client";
import React, { FC, useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";

type AlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
};

const AlertModal: FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Modal 
        title="Are you sure?" 
        description="Action cannot be undone o"
        isOpen={isOpen}
        onClose={onClose}>
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
            <Button variant={"outline"} disabled={loading} onClick={onClose}>
                Cancel
            </Button>

            <Button variant={"destructive"} disabled={loading} onClick={onConfirm}>
                Continue
            </Button>
            </div>
    </Modal>
  );
};

export default AlertModal;
