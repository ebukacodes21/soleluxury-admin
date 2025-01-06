"use client";
import React, { useState } from "react";
import { Popover, PopoverTrigger } from "./ui/popover";
import { useStoreModal } from "@/hooks/useStoreModal";
import { useParams, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, PlusCircle, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { PopoverContent } from "@radix-ui/react-popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import Image from "next/image";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface SwitcherProps extends PopoverTriggerProps {
  items: { store_name: string; store_id: number }[];
}

const Switcher = ({ className, items = [] }: SwitcherProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const fmtItems = items.map((item) => ({
    store_name: item.store_name,
    store_id: item.store_id,
  }));

  const currentStore = fmtItems.find((item) => {
    return String(item.store_id) === params.storeId;
  });

  const onSelectStore = (store: { store_name: string; store_id: number }) => {
    setOpen(false);
    router.push(`/${store.store_id}`);
  };

  return (
    <div className="flex items-center justify-between">
      <Image src={"/logo2.png"} height={150} width={150} alt="logo"/>
      <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"sm"}
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn("w-[200px] justify-between", className)}
        >
          <Store className="mr-2 h-4 w-4" />
          {currentStore?.store_name}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {fmtItems.map((store) => (
                <CommandItem
                  key={store.store_id}
                  onSelect={() => onSelectStore(store)}
                  className="text-sm"
                >
                  <Store className="mr-2 h-4 w-4" />
                  {store.store_name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.store_id === store.store_id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                <p className="cursor-pointer">Create Store</p>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    </div>
  );
};

export default Switcher;
