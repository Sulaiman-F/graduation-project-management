import Home from "../page/Home";
import Student from "../page/Student";
import Teacher from "../page/Teacher";
import Admin from "../page/Admin";

function Dashboard() {
  return (
    <div>
      {localStorage.getItem("type") === "student" && <Student />}
      {localStorage.getItem("type") === "teacher" && <Teacher />}
      {localStorage.getItem("type") === "admin" && <Admin />}
    </div>
  );
}

export default Dashboard;
