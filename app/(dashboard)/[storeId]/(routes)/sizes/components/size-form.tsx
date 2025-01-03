"use client";
import AlertModal from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { sizeSchema } from "@/schema";
import { apiCall } from "@/utils/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import * as z from "zod";

type SizeFormProp = {
  initialData: {
    name: string;
    value: string;
    id: number;
    store_id: number;
    store_name: string;
  } | null;
};

type sizeFormValue = z.infer<typeof sizeSchema>;

const SizeForm: FC<SizeFormProp> = ({ initialData }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const params = useParams();

  const title = initialData?.name ? "Edit size" : "Create size";
  const description = initialData?.name
    ? "Edit a size"
    : "Create a new size";
  const message = initialData?.name
    ? "Size updated"
    : "Size created";
  const action = initialData?.name ? "Save changes" : "Create";

  const form = useForm<sizeFormValue>({
    resolver: zodResolver(sizeSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: sizeFormValue) => {
    setLoading(true);
    let result;
    if (initialData?.name) {
      result = await apiCall("/api/size/update", "PATCH", {
        id: Number(params.sizeId),
        store_id: Number(params.storeId),
        name: data.name,
        value: data.value,
      });
    } else {
      result = await apiCall("/api/size/create", "POST", {
        store_id: Number(params.storeId),
        name: data.name,
        value: data.value,
      });
    }

    if (result.name === "AxiosError") {
      setLoading(false);
      return;
    }

    router.refresh();
    router.push(`/${params.storeId}/sizes`)
    toast.success(message);
    setLoading(false);
  };

  const onConfirm = async () => {
    setLoading(true);
    const result = await apiCall("/api/size/delete", "POST", {
      id: Number(initialData?.id),
    });

    if (result.name === "AxiosError") {
      setLoading(false);
      toast.error(
        "remove all products and categories using this size first"
      );
      return;
    }

    toast.success(result.message);
    router.refresh();
    router.push(`/${params.storeId}/sizes`);
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData?.name && (
          <Button
            variant={"destructive"}
            size={"sm"}
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name:</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="size name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>value:</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="size value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {loading ? "please wait..." : action}
            <ClipLoader loading={loading} color="fff" />
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SizeForm;
