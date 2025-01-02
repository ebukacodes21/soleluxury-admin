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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { categorySchema } from "@/schema";
import { apiCall } from "@/utils/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import * as z from "zod";

type CategoryProp = {
  initialData: {
    name: string;
    billboard_label: string;
    id: number;
    store_id: string;
  } | null;
  billboards: {
    image_url: string;
    label: string;
    id: number;
  }[]
};

type categoryValue = z.infer<typeof categorySchema>;

const CategoryForm: FC<CategoryProp> = ({ initialData, billboards }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const params = useParams();

  const title = initialData?.name ? "Edit category" : "Create category";
  const description = initialData?.name
    ? "Edit a category"
    : "Create a new category";
  const message = initialData?.name ? "Category updated" : "Category created";
  const action = initialData?.name ? "Save changes" : "Create";

  const form = useForm<categoryValue>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || {
      name: "",
      billboard_id: "",
    },
  });

  const onSubmit = async (data: categoryValue) => {
    setLoading(true);
    let result;
    if (initialData?.name) {
      result = await apiCall("/api/category/update", "PATCH", {
        id: Number(initialData.id),
        store_id: Number(params.storeId),
        name: data.name,
        billboard_label: initialData.billboard_label
      });
    } else {
      result = await apiCall("/api/category/create", "POST", {
        store_id: Number(params.storeId),
        billboard_id: Number(data.billboard_id),
        name: data.name,
      });
    }

    if (result.name === "AxiosError") {
      setLoading(false);
      return;
    }

    router.refresh();
    router.push(`/${params.storeId}/categories`);
    toast.success(message);
    setLoading(false);
  };

  const onConfirm = async () => {
    setLoading(true);
    const result = await apiCall("/api/category/delete", "POST", {
      id: Number(initialData?.id),
    });

    if (result.name === "AxiosError") {
      setLoading(false);
      toast.error(
        "remove all products and categories using this category first"
      );
      return;
    }

    toast.success(result.message);
    router.refresh();
    router.push(`/${params.storeId}/categories`);
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
                    <Input
                      disabled={loading}
                      placeholder="category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billboard_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard:</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue defaultValue={field.value} placeholder="Select a billboard" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      {billboards && billboards.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.label}
                        </SelectItem>
                      ))}
                      </SelectContent>

                  </Select>
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

export default CategoryForm;
