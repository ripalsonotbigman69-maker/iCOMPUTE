import { AppProvider, useApp } from "@/state/AppState";
import { PhoneFrame } from "@/components/app/PhoneFrame";
import { BottomNav } from "@/components/app/BottomNav";
import { Toaster } from "@/components/ui/toaster";
import Onboarding from "@/screens/Onboarding";
import GetStarted from "@/screens/GetStarted";
import Login from "@/screens/Login";
import SignUp from "@/screens/SignUp";
import PinScreen from "@/screens/PinScreen";
import LoginSuccess from "@/screens/LoginSuccess";
import Home from "@/screens/Home";
import Expenses from "@/screens/Expenses";
import Insight from "@/screens/Insight";
import Profile from "@/screens/Profile";

const Router = () => {
  const { stage, tab } = useApp();

  if (stage === "onboarding") return <Onboarding />;
  if (stage === "getStarted") return <GetStarted />;
  if (stage === "login") return <Login />;
  if (stage === "signup") return <SignUp />;
  if (stage === "createPin") return <PinScreen mode="create" />;
  if (stage === "enterPin") return <PinScreen mode="enter" />;
  if (stage === "loginSuccess") return <LoginSuccess />;

  return (
    <div className="h-full w-full">
      {tab === "home" && <Home />}
      {tab === "expenses" && <Expenses />}
      {tab === "insight" && <Insight />}
      {tab === "profile" && <Profile />}
      <BottomNav />
    </div>
  );
};

const Index = () => (
  <AppProvider>
    <PhoneFrame>
      <Toaster />
      <Router />
    </PhoneFrame>
  </AppProvider>
);

export default Index;
