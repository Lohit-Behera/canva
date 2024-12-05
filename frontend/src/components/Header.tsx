import { Link, NavLink } from "react-router-dom";
import { fetchLogout } from "@/features/UserSlice";
import { ModeToggle } from "./mode-toggle";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "../assets/Logo.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { LogOut, Settings, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const userDetails = useSelector((state: RootState) => state.user.userDetails);
  const userData = userDetails?.data || {};

  const handleLogout = () => {
    const logoutUserPromise = dispatch(fetchLogout()).unwrap();
    toast.promise(logoutUserPromise, {
      loading: "Logging out...",
      success: (data: any) => {
        navigate("/login");
        return data.message || "Logout successful";
      },
      error: (error: any) => {
        return error || error.message || "Logout failed";
      },
    });
  };
  return (
    <header className="z-20 w-full sticky top-0 p-2 backdrop-blur bg-background/50">
      <nav className="flex justify-between space-x-2">
        <Link to="/">
          <img src={Logo} alt="logo" className="w-10 h-10" />
        </Link>
        <div className="flex items-center space-x-4">
          {userInfo ? (
            <>
              <NavLink to="/create">
                {({ isActive }) => (
                  <Button variant={isActive ? "default" : "ghost"} size="sm">
                    Create
                  </Button>
                )}
              </NavLink>
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full outline-none">
                  <Avatar>
                    <AvatarImage src={userData.avatar} />
                    <AvatarFallback>
                      {userData.name ? userData.name[0] : "A"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate(`/profile/${userData._id}`)}
                    className="cursor-pointer"
                  >
                    <User2 />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate(`/profile/update`)}
                    className="cursor-pointer"
                  >
                    <Settings />
                    Update
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <NavLink to="/login">
              {({ isActive }) => (
                <Button variant={isActive ? "default" : "ghost"} size="sm">
                  Login
                </Button>
              )}
            </NavLink>
          )}
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}

export default Header;
