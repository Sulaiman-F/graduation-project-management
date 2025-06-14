import React, { useState, useEffect } from "react";
import axios from "axios";
import { Alert } from "@mui/material";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
function Admin() {
  const API_URL = "https://6845c68efc51878754dc3519.mockapi.io";
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "",
  });
  const [userList, setUserList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [assignedTeacherId, setAssignedTeacherId] = useState("");
  const [assignedTeacherName, setAssignedTeacherName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTeacher, setSearchTeacher] = useState("");
  const [searchStudent, setSearchStudent] = useState("");

  const fetchUsers = () => {
    axios
      .get(`${API_URL}/users`)
      .then((response) => {
        setUserList(response.data);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredTeachers = userList
    .filter((u) => u.type === "teacher")
    .filter((u) =>
      u.username.toLowerCase().includes(searchTeacher.toLowerCase())
    );

  const filteredStudents = userList
    .filter((u) => u.type === "student")
    .filter((u) =>
      u.username.toLowerCase().includes(searchStudent.toLowerCase())
    );

  const handleCreateUser = async () => {
    if (!newUser.username) {
      setError("Please fill in Username field");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    if (!newUser.email) {
      setError("Please fill in Email field");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    if (!newUser.password) {
      setError("Please fill in Password field");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }

    if (newUser.username.length < 3) {
      setError("Username must be at least 3 characters long");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    if (newUser.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    if (!/^[A-Za-z0-9._%+-]+@tuwaiq\.com$/.test(newUser.email)) {
      setError("Email must end with tuwaiq.com");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    if (newUser.type === "") {
      setError("Please select a user type");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    const existingUsers = await axios.get(`${API_URL}/users`);
    const userExists = existingUsers.data.some(
      (existingUser) => existingUser.username === newUser.username
    );
    const emailExists = existingUsers.data.some(
      (existingUser) => existingUser.email === newUser.email
    );
    if (userExists) {
      setError("Username already exists");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    if (emailExists) {
      setError("Email already exists");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    axios
      .post(`${API_URL}/users`, {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        type: newUser.type,
        assignedTeacherId: "",
        assignedTeacherName: "",
      })
      .then(() => {
        fetchUsers();
        setNewUser({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          type: "",
        });
        setSuccess("Registration successful!");
        setTimeout(() => {
          setSuccess("");
        }, 1000);
      })
      .catch((error) => {
        setError(`Catch Error: ${error.message}`);
        setTimeout(() => {
          setError("");
        }, 1000);
      });
  };
  const handleAssignTeacher = async () => {
    if (studentId === "") {
      setError("Please select a student to assign a teacher");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    if (assignedTeacherId === "") {
      setError("Please select a teacher to assign");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }
    axios
      .put(`${API_URL}/users/${studentId}`, {
        assignedTeacherId,
        assignedTeacherName,
      })
      .then(() => {
        // 2) Build new teacher.assignedStudents array
        const teacher = userList.find((u) => u.id === assignedTeacherId);
        const student = userList.find((u) => u.id === studentId);
        const updatedStudents = [
          ...(teacher.assignedStudents || []),
          { id: student.id, username: student.username, email: student.email },
        ];
        // 3) Update teacher record
        return axios.put(`${API_URL}/users/${assignedTeacherId}`, {
          assignedStudents: updatedStudents,
        });
      })
      .then(() => {
        // 4) Now reload everything and reset UI
        fetchUsers();
        setStudentId("");
        setAssignedTeacherId("");
        setAssignedTeacherName("");
        setSuccess("Teacher assigned successfully!");
        setTimeout(() => setSuccess(""), 1500);
      })
      .catch((err) => {
        setError("Error assigning teacher: " + err.message);
        setTimeout(() => setError(""), 1500);
      });
  };
  const handleStudentDelete = async (studentId, assignedTeacherId) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    axios
      .delete(`${API_URL}/users/${studentId}`)
      .then(() => {
        setUserList((prev) => prev.filter((user) => user.id !== studentId));
        setSuccess("Student deleted successfully!");
        setTimeout(() => setSuccess(""), 1500);
        return axios
          .put(`${API_URL}/users/${assignedTeacherId}`, {
            assignedStudents: userList
              .find((user) => user.id === assignedTeacherId)
              .assignedStudents.filter((s) => s.id !== studentId),
          })
          .then(() => {
            fetchUsers();
          })
          .catch((error) => {
            console.error("Error updating teacher's assigned students:", error);
          });
      })
      .catch((error) => {
        setError("Error deleting student: " + error.message);
        setTimeout(() => setError(""), 1500);
      });
  };
  const handleUnassignTeacher = (studentId, assignedTeacherId) => () => {
    if (!window.confirm("Are you sure you want to unassign this teacher?"))
      return;

    axios
      .put(`${API_URL}/users/${studentId}`, {
        assignedTeacherId: "",
        assignedTeacherName: "",
      })
      .then(() => {
        const teacher = userList.find((u) => u.id === assignedTeacherId);
        const updatedStudents = teacher.assignedStudents.filter(
          (s) => s.id !== studentId
        );
        return axios.put(`${API_URL}/users/${assignedTeacherId}`, {
          assignedStudents: updatedStudents,
        });
      })
      .then(() => {
        fetchUsers();
        setSuccess("Teacher unassigned successfully!");
        setTimeout(() => setSuccess(""), 1500);
      })
      .catch((error) => {
        setError("Error unassigning teacher: " + error.message);
        setTimeout(() => setError(""), 1500);
      });
  };
  const handleTeacherDelete = (teacherId, assignedStudents) => () => {
    if (!window.confirm("Are you sure you want to delete this teacher?"))
      return;

    axios
      .delete(`${API_URL}/users/${teacherId}`)
      .then(() => {
        setUserList((prev) => prev.filter((user) => user.id !== teacherId));

        // Remove this teacher from all assigned students
        assignedStudents.forEach((studentId) => {
          axios
            .put(`${API_URL}/users/${studentId}`, {
              assignedTeacherId: "",
              assignedTeacherName: "",
            })
            .then(() => {
              fetchUsers();
            })
            .catch((error) => {
              console.error(
                `Error unassigning teacher from student ${studentId}:`,
                error
              );
            });
        });
        fetchUsers();

        setSuccess("Teacher deleted successfully!");
        setTimeout(() => setSuccess(""), 1500);
      })
      .catch((error) => {
        setError("Error deleting teacher: " + error.message);
        setTimeout(() => setError(""), 1500);
      });
  };
  const justTeacherDelete = (teacherId) => () => {
    if (!window.confirm("Are you sure you want to delete this teacher?"))
      return;

    axios
      .delete(`${API_URL}/users/${teacherId}`)
      .then(() => {
        setUserList((prev) => prev.filter((user) => user.id !== teacherId));
        setSuccess("Teacher deleted successfully!");
        setTimeout(() => setSuccess(""), 1500);
      })
      .catch((error) => {
        setError("Error deleting teacher: " + error.message);
        setTimeout(() => setError(""), 1500);
      });
  };
  return (
    <>
      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 w-auto max-w-md z-50"
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          onClose={() => setSuccess("")}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 w-auto max-w-md z-50"
        >
          {success}
        </Alert>
      )}
      <div className=" w-full flex flex-col justify-center gap-5 px-5 md:px-10 lg:px-25 py-1.5">
        <h2 className="text-2xl font-semibold mb-6 text-violet-700 border-b-2 border-neutral-400 pb-2">
          Admin Dashboard
        </h2>
        {/* Create User Form */}
        <div className="flex flex-col items-center gap-5 bg-white p-6 rounded-xl shadow-lg ">
          <h3 className="text-xl font-medium self-start text-neutral-700 mb-2">
            Create New User
          </h3>
          <input
            type="text"
            className="border border-neutral-300/50 p-2 px-5 rounded-xl w-full focus:outline-2 focus:outline-violet-600/50 hover:shadow-md transition-shadow duration-300 shadow-violet-600/20 hover:border-violet-600/50  focus:bg-neutral-200/50"
            placeholder="Enter Username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
          />
          <input
            type="email"
            className="border border-neutral-300/50 p-2 px-5 rounded-xl w-full focus:outline-2 focus:outline-violet-600/50 hover:shadow-md transition-shadow duration-300 shadow-violet-600/20 hover:border-violet-600/50  focus:bg-neutral-200/50"
            placeholder="Enter Email (must end with @tuwaiq.com)"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <div className="relative w-full">
            <input
              className="border border-neutral-300/50 p-2 px-5 rounded-xl w-full focus:outline-2 focus:outline-violet-600/50 hover:shadow-md transition-shadow duration-300 shadow-violet-600/20 hover:border-violet-600/50  focus:bg-neutral-200/50"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-neutral-500 cursor-pointer hover:scale-110 transition-transform duration-200"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </button>
          </div>
          <select
            name="userType"
            id="userType"
            className="border border-neutral-300/50 p-2 px-5 rounded-xl w-full focus:outline-2 focus:outline-violet-600/50 hover:shadow-md transition-shadow duration-300 shadow-violet-600/20 hover:border-violet-600/50  focus:bg-neutral-200/50"
            value={newUser.type}
            onChange={(e) => setNewUser({ ...newUser, type: e.target.value })}
          >
            <option value="" className="" disabled>
              Select User Type
            </option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
          <button
            type="button"
            className="bg-violet-600 text-white p-2 rounded-xl w-40 hover:bg-violet-700 transition-colors duration-300 shadow-md hover:shadow-lg cursor-pointer"
            onClick={handleCreateUser}
          >
            Create User
          </button>
        </div>

        {/* Assign Teacher Form */}
        <div className="flex flex-col items-center gap-5 bg-white p-6 rounded-xl shadow-lg ">
          <h3 className="text-xl font-medium self-start text-neutral-700 mb-2">
            Assign Teacher to Student
          </h3>
          <select
            name="studentToAssign"
            id="studentToAssign"
            className="border border-neutral-300/50 p-2 px-5 rounded-xl w-full focus:outline-2 focus:outline-violet-600/50 hover:shadow-md transition-shadow duration-300 shadow-violet-600/20 hover:border-violet-600/50  focus:bg-neutral-200/50"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          >
            <option value="" className="" disabled>
              Select Student to Assign Teacher
            </option>
            {userList
              .filter(
                (user) =>
                  user.type === "student" &&
                  (!user.assignedTeacherId || user.assignedTeacherId === "")
              )
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
          </select>
          <p className="text-neutral-600">Assign to Teacher:</p>
          <select
            name="teacherToAssign"
            id="teacherToAssign"
            className="border border-neutral-300/50 p-2 px-5 rounded-xl w-full focus:outline-2 focus:outline-violet-600/50 hover:shadow-md transition-shadow duration-300 shadow-violet-600/20 hover:border-violet-600/50  focus:bg-neutral-200/50"
            value={assignedTeacherId}
            onChange={(e) => {
              const selectedTeacher = userList.find(
                (user) => user.id === e.target.value
              );
              setAssignedTeacherId(selectedTeacher.id);
              setAssignedTeacherName(selectedTeacher.username);
            }}
          >
            <option value="" className="" disabled>
              Select Teacher
            </option>
            {userList
              .filter((user) => user.type === "teacher")
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
          </select>
          <button
            type="button"
            className="bg-violet-600 text-white p-2 rounded-xl w-40 hover:bg-violet-600 transition-colors duration-300 shadow-md hover:shadow-lg cursor-pointer"
            onClick={handleAssignTeacher}
          >
            Assign Teacher
          </button>
        </div>
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 justify-items-center">
          <div className="flex flex-col items-center gap-5 bg-white p-6 rounded-xl shadow-lg w-full">
            <h3 className="text-xl w-full font-medium self-start text-neutral-700">
              Student List
            </h3>

            {/* search students */}
            <div className="w-full flex items-center justify-between bg-neutral-100 rounded-xl px-3">
              <input
                type="text"
                placeholder="Search Students..."
                className="border-neutral-300/50 h-10 w-full rounded-l-xl focus:outline-none"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
              />
              <IoIosSearch className="text-neutral-500 text-2xl" />
            </div>

            <div className="w-full flex flex-col gap-4 h-96 overflow-y-auto scrollbar-hide">
              {filteredStudents.map((user) => (
                <div
                  key={user.id}
                  className="py-3 px-4 flex gap-1 flex-col border border-neutral-200 rounded-lg bg-neutral-50"
                >
                  <p className="font-medium text-violet-600 text-lg">
                    {user.username}
                  </p>
                  <p className="text-sm text-neutral-600 ">
                    Email: {user.email}
                  </p>
                  {user.assignedTeacherName ? (
                    <p className="text-xs text-neutral-500">
                      Assigned Teacher: {user.assignedTeacherName}
                    </p>
                  ) : (
                    <p className="text-xs text-neutral-500">Unassigned</p>
                  )}
                  <div className="flex items-center w-full justify-end gap-5">
                    {!user.assignedTeacherId ? null : (
                      <button
                        className="bg-neutral-700 text-neutral-100 text-base h-7 w-fit px-1.5 flex justify-center items-center rounded-lg hover:bg-neutral-600 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                        onClick={handleUnassignTeacher(
                          user.id,
                          user.assignedTeacherId
                        )}
                      >
                        Unassigned
                      </button>
                    )}

                    <button
                      className="bg-red-600 text-neutral-100 h-7 w-7 flex justify-center items-center rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                      onClick={() => {
                        handleStudentDelete(user.id, user.assignedTeacherId);
                      }}
                    >
                      <FaTrash className=" text-md" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 bg-white p-6 rounded-xl shadow-lg w-full">
            <h3 className="text-xl w-full font-medium self-start text-neutral-700 ">
              Teacher List
            </h3>
            <div className="w-full flex items-center justify-between bg-neutral-100 rounded-xl px-3  ">
              <input
                type="text"
                placeholder="Search Teachers..."
                className=" border-neutral-300/50 h-10 w-full rounded-l-xl focus:outline-none "
                value={searchTeacher}
                onChange={(e) => setSearchTeacher(e.target.value)}
              />
              <IoIosSearch className="text-neutral-500 text-2xl " />
            </div>
            <div className="w-full flex flex-col gap-4 h-96 overflow-y-auto scrollbar-hide">
              {filteredTeachers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border border-neutral-200 rounded-lg bg-neutral-50"
                >
                  <p className="font-medium text-violet-600 text-lg">
                    {user.username}
                  </p>
                  <p className="text-sm text-neutral-600">
                    Email: {user.email}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-neutral-500 text-sm">
                      Assigned Students:
                    </span>
                    {user.assignedStudents &&
                    user.assignedStudents.length > 0 ? (
                      user.assignedStudents.map((student) => (
                        <span
                          key={student.id}
                          className="bg-violet-100 text-violet-800 px-2 py-1 rounded-xl text-xs"
                        >
                          {student.username}
                        </span>
                      ))
                    ) : (
                      <span className="text-neutral-500 text-xs">
                        No students assigned
                      </span>
                    )}
                  </div>
                  <div className="flex items-center w-full justify-end gap-5">
                    {"assignedStudents" in user ? (
                      <button
                        className="bg-red-600 text-neutral-100 h-7 w-7 flex justify-center items-center rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                        onClick={handleTeacherDelete(
                          user.id,
                          user.assignedStudents.map((s) => s.id)
                        )}
                      >
                        <FaTrash className=" text-md" />
                      </button>
                    ) : (
                      <button
                        className="bg-red-600 text-neutral-100 h-7 w-7 flex justify-center items-center rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                        onClick={justTeacherDelete(user.id)}
                      >
                        <FaTrash className=" text-md" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;
