import React, { useState, useEffect } from "react";
import axios from "axios";
import { Alert } from "@mui/material";

const API_URL = "https://6845c68efc51878754dc3519.mockapi.io";
function Student() {
  const [myIdeas, setMyIdeas] = useState([]);
  const [newIdea, setNewIdea] = useState({ title: "", description: "" });

  const currentUserId = localStorage.getItem("id");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userList, setUserList] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [teacher, setTeacher] = useState({});
  const [group, setGroup] = useState([]);

  const currentUser = userList.find((user) => user.id === currentUserId);
  useEffect(() => {
    if (currentUser) {
      const assignedTeacher = userList.find(
        (user) => user.id === currentUser.assignedTeacherId
      );
      setTeacher(assignedTeacher || {});
      setGroup(assignedTeacher.assignedStudents || []);
    }
  }, [currentUser, userList]);

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

  const fetchIdeas = () => {
    axios
      .get(`${API_URL}/project`)
      .then((response) => {
        setIdeas(response.data);
      })
      .catch((err) => {
        console.error("Error fetching ideas:", err);
      });
  };

  useEffect(() => {
    fetchIdeas();
    fetchUsers();
  }, []);

  const handleNewIdea = () => {
    if (!newIdea.title || !newIdea.description) {
      setError("Please fill in all fields.");
      setTimeout(() => setError(""), 1500);
      return;
    }
    const student = userList.find((user) => user.id === currentUserId);

    if (student.assignedTeacherId == "") {
      setError("You must be assigned to a teacher before adding an idea.");
      setTimeout(() => setError(""), 1500);
      return;
    }

    const ideaData = {
      title: newIdea.title,
      description: newIdea.description,
      studentId: currentUserId,
      studentName: student.username,
      assignedTeacherId: student.assignedTeacherId,
      assignedTeacherName: student.assignedTeacherName,
      status: "pending",
      group: group.map((member) => ({
        id: member.id,
        username: member.username,
      })),
    };

    axios
      .post(`${API_URL}/project`, ideaData)
      .then((response) => {
        setMyIdeas([...myIdeas, response.data]);
        setSuccess("Idea added successfully!");
        setTimeout(() => setSuccess(""), 1500);
        setNewIdea({ title: "", description: "" });
        fetchIdeas(); // Refresh ideas list
      })
      .catch((err) => {
        console.error("Error adding idea:", err);
        setError("Failed to add idea. Please try again.");
      });
  };
  return (
    <>
      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 w-72 md:w-96 z-55"
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          onClose={() => setSuccess("")}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 w-72 md:w-96 z-55"
        >
          {success}
        </Alert>
      )}
      <div className=" w-full flex flex-col justify-center gap-5 px-5 md:px-10 lg:px-25 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-neutral-400 pb-2">
          <h2 className="text-2xl font-semibold text-violet-700">
            Student Dashboard
          </h2>
          {userList.find((user) => user.id === currentUserId) ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-lg text-gray-700">
                Teacher: {teacher.username}
              </p>
            </div>
          ) : (
            <p className="text-lg text-gray-500">No teacher assigned yet.</p>
          )}
        </div>
        <div className="flex flex-col items-center gap-5 bg-white p-6 rounded-xl shadow-lg ">
          <h3 className="text-xl font-medium self-start text-neutral-700 mb-2">
            Add New Idea
          </h3>
          <input
            type="text"
            className="border border-neutral-300/50 p-2 px-5 rounded-xl w-full focus:outline-2 focus:outline-violet-600/50 hover:shadow-md transition-shadow duration-300 shadow-violet-600/20 hover:border-violet-600/50  focus:bg-neutral-200/50"
            placeholder="Title"
            value={newIdea.title}
            onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
          />
          <textarea
            className="border border-neutral-300/50 scrollbar-hide p-2 px-5 rounded-xl w-full focus:outline-2 focus:outline-violet-600/50 hover:shadow-md transition-shadow duration-300 shadow-violet-600/20 hover:border-violet-600/50  focus:bg-neutral-200/50"
            placeholder="Description"
            rows="4"
            value={newIdea.description}
            onChange={(e) =>
              setNewIdea({ ...newIdea, description: e.target.value })
            }
          />
          <button
            className="bg-violet-600 text-white p-2 rounded-xl w-40 hover:bg-violet-700 transition-colors duration-300 shadow-md hover:shadow-lg cursor-pointer"
            onClick={handleNewIdea}
          >
            Add Idea
          </button>
        </div>
        <div className="flex flex-col items-center gap-5 bg-white p-6 rounded-xl shadow-lg ">
          <h3 className="text-xl font-medium self-start text-neutral-700 mb-2">
            Groups
          </h3>
          {group.length > 0 ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {group.map((student) => (
                <div
                  key={student.id}
                  className="rounded-xl py-1.5 px-4  shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <h4 className="font-semibold text-lg text-neutral-800">
                    {student.username}
                  </h4>
                  <p className="text-sm text-neutral-600">
                    Email: {student.email}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-600">No group members assigned yet.</p>
          )}
        </div>
        <div className="flex flex-col items-center gap-5 bg-white p-6 rounded-xl shadow-lg ">
          <h3 className="text-xl font-medium self-start text-neutral-700 mb-2">
            My Ideas
          </h3>
          {ideas.filter((idea) => idea.studentId === currentUserId).length >
          0 ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {ideas
                .filter((idea) => idea.studentId === currentUserId)
                .map((idea) => (
                  <div
                    key={idea.id}
                    className="border flex flex-col justify-between bg-neutral-100 border-neutral-300 rounded-xl py-1.5 px-4  shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex flex-col">
                      <h4 className="font-semibold text-lg text-neutral-800">
                        {idea.title}
                      </h4>
                      <p className="text-sm text-neutral-600 break-all whitespace-pre-wrap">
                        {idea.description}
                      </p>
                      {idea.rejectReason && (
                        <p className="text-sm text-neutral-600">
                          <span className="font-semibold">Reject Reason:</span>{" "}
                          {idea.rejectReason}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm text-neutral-700">
                        <span className="font-semibold">Assigned Teacher:</span>{" "}
                        {idea.assignedTeacherName}
                      </p>
                      <p className="text-sm text-neutral-700">
                        <span className="font-semibold">Submitted:</span>{" "}
                        {idea.studentName}
                      </p>
                      <p className="text-sm text-neutral-700">
                        <span className="font-semibold">Status:</span>{" "}
                        {idea.status === "pending" ? (
                          <span className="bg-amber-400 px-2 py-0.5 rounded-lg text-neutral-100 text-xs font-semibold">
                            Pending
                          </span>
                        ) : idea.status === "approved" ? (
                          <span className="bg-green-600 px-2 py-0.5 text-neutral-200 rounded-lg text-xs font-semibold">
                            Approved
                          </span>
                        ) : (
                          <span className="bg-red-500 px-2 py-0.5 text-neutral-200 rounded-lg text-xs font-semibold">
                            Rejected
                          </span>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <p className="text-sm text-neutral-700 font-semibold">
                          Group:
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          {idea.group.map((student) => (
                            <p
                              key={student.id}
                              className="text-sm text-neutral-700"
                            >
                              {student.username}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-neutral-600">No ideas added yet.</p>
          )}
        </div>
        <div className="flex flex-col items-center gap-5 bg-white p-6 rounded-xl shadow-lg ">
          <h3 className="text-xl font-medium self-start text-neutral-700 mb-2">
            All Approved ideas
          </h3>
          {ideas.filter((idea) => idea.status === "approved").length > 0 ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {ideas
                .filter((idea) => idea.status === "approved")
                .map((idea) => (
                  <div
                    key={idea.id}
                    className="border flex flex-col justify-between bg-neutral-100 border-neutral-300 rounded-xl py-1.5 px-4  shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex flex-col">
                      <h4 className="font-semibold text-lg text-neutral-800">
                        {idea.title}
                      </h4>
                      <p className="text-sm text-neutral-600 break-all whitespace-pre-wrap">
                        {idea.description}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm text-neutral-700">
                        <span className="font-semibold">Assigned Teacher:</span>{" "}
                        {idea.assignedTeacherName}
                      </p>
                      <p className="text-sm text-neutral-700">
                        <span className="font-semibold">Submitted:</span>{" "}
                        {idea.studentName}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <p className="text-sm text-neutral-700 font-semibold">
                          Group:
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          {idea.group.map((student) => (
                            <p
                              key={student.id}
                              className="text-sm text-neutral-700"
                            >
                              {student.username}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-neutral-600">No approved ideas yet.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Student;
