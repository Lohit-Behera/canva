import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PasswordInput from "@/components/PasswordInput";
import { toast } from "sonner";
import {
  fetchGoogleAuth,
  fetchRegister,
  fetchUserDetails,
} from "@/features/UserSlice";
import { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";

const signUpFormSchema = z
  .object({
    name: z
      .string()
      .min(3, {
        message: "Name must be at least 3 characters",
      })
      .max(30, {
        message: "Name must be less than 30 characters",
      }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .max(50, {
        message: "Password must be less than 50 characters.",
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
      }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    avatar: z
      .any()
      .refine((file) => file instanceof File, {
        message: "Avatar is required.",
      })
      .refine((file) => file?.size <= 3 * 1024 * 1024, {
        message: "Avatar size must be less than 3MB.",
      })
      .refine((file) => ["image/jpeg", "image/png"].includes(file?.type), {
        message: "Only .jpg and .png formats are supported.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function SignUpPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const userDetails = useSelector(
    (state: RootState) => state.user.userDetails.data
  );

  useEffect(() => {
    if (userInfo) {
      if (!userDetails?.name || userDetails?._id !== userInfo._id) {
        dispatch(fetchUserDetails());
        navigate("/");
      }
      navigate("/");
    }
  }, [userInfo, navigate]);

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: undefined,
    },
  });
  function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    const createUserPromise = dispatch(fetchRegister(values)).unwrap();
    toast.promise(createUserPromise, {
      loading: "Creating user...",
      success: (data: any) => {
        form.reset();
        navigate("/login");
        return data.message || "User created successfully.";
      },
      error: (error) => {
        return error || error.message || "Error creating user.";
      },
    });
  }
  const responseGoogle = (authResponse: any) => {
    try {
      if (authResponse.code === undefined) {
        toast.error("Failed to Sign Up with Google. Please try again later.");
        return;
      }
      const googlePromise = dispatch(fetchGoogleAuth(authResponse.code));
      toast.promise(googlePromise, {
        loading: "Creating user...",
        success: (data: any) => {
          form.reset();
          navigate("/");
          return data.message || "User created successfully.";
        },
        error: (error) => {
          return error || error.message || "Error creating user.";
        },
      });
    } catch (error) {
      toast.error("Failed to Sign Up with Google. Please try again later.");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  return (
    <Card className="mx-auto max-w-[350px] min-w-[350px]">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your credentials to create an account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] || null)
                      }
                      placeholder="Avatar"
                    />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Confirm Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" size="sm" type="submit">
              Submit
            </Button>
          </form>
        </Form>
        <Button
          variant="outline"
          className="w-full"
          size="sm"
          onClick={googleLogin}
        >
          Sign Up with Google
        </Button>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default SignUpPage;
