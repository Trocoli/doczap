import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Dashboard = () => {
  const {getUser} = getKindeServerSession();
  const user = getUser()

if (!user || !user.id) redirect('/auth-callback?origin=dashboard')



  console.log("hello mate from the server \n\n\n");
  return <div>{user.email} </div>;
};

export default Dashboard;
