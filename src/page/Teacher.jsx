import React, { useState, useEffect } from "react";
import axios from "axios";
import { Alert } from "@mui/material";
import { FaTrash } from "react-icons/fa";

const API_URL = "https://6845c68efc51878754dc3519.mockapi.io";

function Teacher() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const currentUserId = localStorage.getItem("id");
  const [rejectingIdeaId, setRejectingIdeaId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [userList, setUserList] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [teacher, setTeacher] = useState({});
  useEffect(() => {
    const foundTeacher = userList.find((user) => user.id === currentUserId);
    setTeacher(foundTeacher || {});
  }, [userList, currentUserId]);

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

  const handleApproveIdea = (ideaId) => () => {
    axios
      .put(`${API_URL}/project/${ideaId}`, {
        status: "approved",
      })
      .then(() => {
        setSuccess("Idea approved successfully!");
        setTimeout(() => {
          setSuccess("");
        }, 1500);
        fetchIdeas();
        setIdeas((prevIdeas) =>
          prevIdeas.map((idea) =>
            idea.id === ideaId ? { ...idea, status: "approved" } : idea
          )
        );
      })
      .catch((err) => {
        console.error("Error approving idea:", err);
        setError("Failed to approve the idea. Please try again.");
      });
  };
  const handleRejectIdea = (ideaId) => () => {
    axios
      .put(`${API_URL}/project/${ideaId}`, {
        status: "rejected",
        rejectReason: rejectReason,
      })
      .then(() => {
        setSuccess("Idea rejected successfully!");
        setTimeout(() => {
          setSuccess("");
        }, 1500);
        setRejectingIdeaId(null); // stop rejecting mode
        setRejectReason(""); // clear reason
        fetchIdeas();
      })
      .catch((err) => {
        console.error("Error rejecting idea:", err);
        setError("Failed to reject the idea, please try again.");
      });
  };
  const handleUnapproveIdea = (ideaId) => () => {
    axios
      .put(`${API_URL}/project/${ideaId}`, {
        status: "pending",
      })
      .then(() => {
        setSuccess("Idea unapproved successfully!");
        setTimeout(() => {
          setSuccess("");
        }, 1500);
        fetchIdeas();
        setIdeas((prevIdeas) =>
          prevIdeas.map((idea) =>
            idea.id === ideaId ? { ...idea, status: "pending" } : idea
          )
        );
      })
      .catch((err) => {
        console.error("Error unapproving idea:", err);
        setError("Failed to unapprove the idea. Please try again.");
      });
  };
  const handleDeleteIdea = (ideaId) => () => {
    axios
      .delete(`${API_URL}/project/${ideaId}`)
      .then(() => {
        setSuccess("Idea deleted successfully!");
        setTimeout(() => {
          setSuccess("");
        }, 1500);
        fetchIdeas();
      })
      .catch((err) => {
        console.error("Error deleting idea:", err);
        setError("Failed to delete the idea. Please try again.");
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
          Teacher Dashboard
        </h2>
        <div className="flex flex-col items-center gap-5 bg-white p-6 rounded-xl shadow-lg ">
          <h3 className="text-xl font-medium self-start text-neutral-700 mb-2">
            My Student
          </h3>
          {teacher.assignedStudents ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {teacher.assignedStudents.map((student) => (
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
            <p className="text-neutral-600">No students assigned yet.</p>
          )}
        </div>
        <div className="flex flex-col items-center gap-5 bg-white p-6 rounded-xl shadow-lg ">
          <h3 className="text-xl font-medium self-start text-neutral-700 mb-2">
            All ideas by my students
          </h3>
          {ideas.filter((idea) => idea.assignedTeacherId === currentUserId)
            .length > 0 ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {ideas
                .filter((idea) => idea.assignedTeacherId === currentUserId)
                .map((idea) => (
                  <div
                    key={idea.id}
                    className="border flex flex-col gap-1 justify-between bg-neutral-100 border-neutral-300 rounded-xl py-1.5 px-4  shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex flex-col gap-1">
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
                    <div className="flex flex-col gap-1">
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
                      {rejectingIdeaId === idea.id && (
                        <textarea
                          className="border border-neutral-300/50 scrollbar-hide p-2 px-5 rounded-xl w-full focus:outline-2 focus:outline-violet-600/50 hover:shadow-md transition-shadow duration-300 shadow-violet-600/20 hover:border-violet-600/50  focus:bg-neutral-200/50"
                          placeholder="Description"
                          rows="2"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        />
                      )}
                      {idea.status === "pending" && (
                        <div className="flex items-center w-full justify-end gap-3">
                          {rejectingIdeaId !== idea.id ? (
                            <>
                              <button
                                className="bg-green-600 text-neutral-100 text-base h-7 w-fit px-1.5 flex justify-center items-center rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                                onClick={handleApproveIdea(idea.id)}
                              >
                                Approved
                              </button>
                              <button
                                className="bg-red-500 text-neutral-100 text-base h-7 w-fit px-1.5 flex justify-center items-center rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                                onClick={() => setRejectingIdeaId(idea.id)}
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="bg-red-500 text-neutral-100 text-base h-7 w-fit px-1.5 flex justify-center items-center rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                                onClick={handleRejectIdea(idea.id)}
                              >
                                Confirm Reject
                              </button>
                              <button
                                className="bg-neutral-500 text-neutral-100 text-base h-7 w-fit px-1.5 flex justify-center items-center rounded-lg hover:bg-neutral-600 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                                onClick={() => setRejectingIdeaId(null)}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      )}
                      {idea.status === "approved" && (
                        <div className="flex items-center w-full justify-end gap-3">
                          <button
                            className="bg-neutral-500 text-neutral-100 text-base h-7 w-fit px-1.5 flex justify-center items-center rounded-lg hover:bg-neutral-600 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                            onClick={handleUnapproveIdea(idea.id)}
                          >
                            Unapproved
                          </button>
                        </div>
                      )}
                      {idea.status === "rejected" && (
                        <div className="flex items-center w-full justify-end gap-3">
                          <button
                            className="bg-red-600 text-neutral-100 h-7 w-7 flex justify-center items-center rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                            onClick={handleDeleteIdea(idea.id)}
                          >
                            <FaTrash className=" text-md" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-neutral-600">
              No ideas submitted by students yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Teacher;
