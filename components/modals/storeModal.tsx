"use client";
import * as z from "zod";
import { useStoreModal } from "@/hooks/useStoreModal";
import { Modal } from "@/components/ui/modal";
import { useForm } from "react-hook-form";
import { createStoreSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { apiCall } from "@/utils/helper";

export const StoreModal = () => {
  const storeModal = useStoreModal();
  const [loading, setIsLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof createStoreSchema>>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createStoreSchema>) => {
    try {
      setIsLoading(true)
      const result = await apiCall("/api/createStore", "POST", { name: values.name })
      console.log(result)
    } catch (error) {
      
    } finally{
      setIsLoading(false)
    }
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name:</FormLabel>
                    <FormControl>
                      <Input placeholder="E-Commerce" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-6 space-x-2 flex items-center justify-end">
                <Button variant={'outline'} onClick={storeModal.onClose} disabled={loading}>Cancel</Button>
                <Button type="submit" disabled={loading}>Create</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};