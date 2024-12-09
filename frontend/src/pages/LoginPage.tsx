import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  fetchLogin,
  fetchUserDetails,
} from "@/features/UserSlice";
import { useEffect } from "react";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});
function LoginPage() {
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

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    const loginUserPromise = dispatch(fetchLogin(values)).unwrap();
    toast.promise(loginUserPromise, {
      loading: "Logging in...",
      success: (data: any) => {
        form.reset();
        return data.message || "Login successful";
      },
      error: (error) => {
        return error || error.message || "Error logging in.";
      },
    });
  }
  const responseGoogle = (authResponse: any) => {
    try {
      if (authResponse.code === undefined) {
        toast.error("Failed to Sign Up with Google. Please try again later.");
        return;
      }
      const googlePromise = dispatch(
        fetchGoogleAuth(authResponse.code)
      ).unwrap();
      toast.promise(googlePromise, {
        loading: "Logging in...",
        success: (data: any) => {
          form.reset();
          navigate("/");
          return data.message || "Login successful";
        },
        error: (error) => {
          return error || error.message || "Error logging in.";
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
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <Button className="w-full" size="sm" type="submit">
              Login
            </Button>
          </form>
        </Form>
        <Button
          variant="outline"
          className="w-full"
          size="sm"
          onClick={googleLogin}
        >
          Login with Google
        </Button>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoginPage;
