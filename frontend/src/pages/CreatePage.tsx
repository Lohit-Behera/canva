import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { fetchCreateForm } from "@/features/FormSlice";
import { toast } from "sonner";

const createFormSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: "First name must be at least 2 characters",
    })
    .max(20, {
      message: "First name must be less than 20 characters",
    }),
  lastName: z
    .string()
    .min(2, {
      message: "Last name must be at least 2 characters",
    })
    .max(20, {
      message: "Last name must be less than 20 characters",
    }),
  thumbnail: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Thumbnail is required.",
    })
    .refine((file) => file?.size <= 3 * 1024 * 1024, {
      message: "Thumbnail size must be less than 3MB.",
    })
    .refine((file) => ["image/jpeg", "image/png"].includes(file?.type), {
      message: "Only .jpg and .png formats are supported.",
    }),
});

function CreatePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      thumbnail: undefined,
    },
  });
  const onSubmit = (values: z.infer<typeof createFormSchema>) => {
    const createFormPromise = dispatch(fetchCreateForm(values)).unwrap();
    toast.promise(createFormPromise, {
      loading: "Creating form...",
      success: (data: any) => {
        form.reset();
        navigate(`/form/${data.data}`);
        return data.message || "Form created successfully.";
      },
      error: (error) => {
        return error || error.message || "Error creating form.";
      },
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
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
            <Button type="submit" className="w-full" size="sm">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default CreatePage;
