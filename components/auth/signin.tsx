import React, { useState } from "react";
import { Cardd } from "../card";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { loginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiCall, formatError } from "@/utils/helper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { routes } from "@/constants";

const Signin = () => {
  const [loading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    const result = await apiCall("/api/user/login", "POST", {
      email: values.email,
      password: values.password,
    });

    if (result.name === "AxiosError"){
      const err = formatError(result)
      toast.error(err)
      setIsLoading(false)
      return
    }
    router.push(routes.HOME);
  };

  return (
    <Cardd
      title="Welcome Back!"
      description={`Login to access Soleluxury Dashboard`}
    >
      <div>
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email:</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-6 space-x-2 flex items-center justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  variant={"destructive"}
                  className="font-bold"
                >
                  {loading ? "please wait..." : "Login"}
                  <ClipLoader loading={loading} color="fff" />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Cardd>
  );
};

export default Signin;
