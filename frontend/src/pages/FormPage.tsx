import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchDeleteForm, fetchGetForm } from "@/features/FormSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

function FormPage() {
  const { formId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const getForm = useSelector((state: RootState) => state.form.getForm.data);
  const getFormStatus = useSelector(
    (state: RootState) => state.form.getFormStatus
  );

  useEffect(() => {
    dispatch(fetchGetForm(formId as string));
  }, []);

  const handleDelete = () => {
    const deletePromise = dispatch(fetchDeleteForm(formId as string));
    toast.promise(deletePromise, {
      loading: "Deleting...",
      success: (data: any) => {
        navigate("/");
        return data.message || "Form deleted successfully.";
      },
      error: (error) => {
        return error || error.message || "Error deleting form.";
      },
    });
  };
  return (
    <>
      {getFormStatus === "loading" ? (
        <p>Loading...</p>
      ) : getFormStatus === "failed" ? (
        <p>Error</p>
      ) : getFormStatus === "succeeded" ? (
        <Card className="w-[98%] md:w-[90%]">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <div className="flex space-x-2">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={getForm?.userAvatar} />
                  <AvatarFallback>
                    {getForm.userName ? getForm.userName[0] : "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col ">
                  <p className="text-sm md:text-base">{getForm?.userName}</p>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {getForm?.userEmail}
                  </p>
                </div>
              </div>
              <Button variant="destructive" size="icon" onClick={handleDelete}>
                <Trash2 />
              </Button>
            </CardTitle>
            <CardDescription>
              Created at:{" "}
              {getForm.createdAt ? format(getForm.createdAt, "PPP") : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>First Name</Label>
              <p>{getForm?.firstName}</p>
            </div>
            <div className="grid gap-2">
              <Label>Last Name</Label>
              <p>{getForm?.lastName}</p>
            </div>
            <div className="grid gap-2">
              <Label>Thumbnail</Label>
              <img src={getForm?.thumbnail} alt="" />
            </div>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      ) : null}
    </>
  );
}

export default FormPage;
