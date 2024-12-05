import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchGetForm } from "@/features/FormSlice";
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

function FormPage() {
  const { formId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const getForm = useSelector((state: RootState) => state.form.getForm.data);

  useEffect(() => {
    dispatch(fetchGetForm(formId as string));
  }, []);
  return (
    <Card className="w-[98%] md:w-[90%]">
      <CardHeader>
        <CardTitle className="flex space-x-2">
          <Avatar className="w-14 h-14">
            <AvatarImage src={getForm?.userAvatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col ">
            <p className="text-sm md:text-base">{getForm?.userName}</p>
            <p className="text-sm md:text-base text-muted-foreground">
              {getForm?.userEmail}
            </p>
          </div>
        </CardTitle>
        <CardDescription>Card Description</CardDescription>
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
  );
}

export default FormPage;
