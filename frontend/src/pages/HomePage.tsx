import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchGetAllForms, From } from "@/features/FormSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function HomePage() {
  const dispatch = useDispatch<AppDispatch>();

  const forms = useSelector((state: RootState) => state.form.getAllForms.data);
  const getAllFormsStatus = useSelector(
    (state: RootState) => state.form.getAllFormsStatus
  );

  useEffect(() => {
    if (forms.length === 0) {
      dispatch(fetchGetAllForms());
    }
  }, []);
  return (
    <>
      {getAllFormsStatus === "loading" ? (
        <p>Loading</p>
      ) : getAllFormsStatus === "failed" ? (
        <p>Error</p>
      ) : getAllFormsStatus === "succeeded" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-[98%] md:[95%]">
          {forms.map((form: From) => (
            <Card>
              <CardHeader>
                <CardTitle className="flex space-x-2">
                  <Avatar>
                    <AvatarImage src={form?.userAvatar} />
                    <AvatarFallback>
                      {form.userName ? form.userName[0] : "A"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm md:text-base">{form?.userName}</p>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid">
                <Link
                  className="text-sm md:text-base hover:underline"
                  to={`/form/${form?._id}`}
                >
                  First Name: {form?.firstName}
                </Link>
                <Link
                  className="text-sm md:text-base hover:underline"
                  to={`/form/${form?._id}`}
                >
                  Last Name: {form?.lastName}
                </Link>
              </CardContent>
              <CardFooter>
                <Link to={`/form/${form?._id}`}>
                  <img
                    className="h-20 rounded-lg"
                    src={form?.thumbnail}
                    alt={form?.firstName}
                  />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : null}
    </>
  );
}

export default HomePage;
