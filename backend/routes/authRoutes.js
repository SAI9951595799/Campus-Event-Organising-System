import express from "express";
import Student from "../models/student.js";
import Faculty from "../models/faculty.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { identifier, password, role } = req.body; 

    if (!password || !role || !identifier) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    let user = null;
    if (role === "faculty") {
      user = await Faculty.findOne({ employeeId: identifier });
    } else if (role === "student") {
      user = await Student.findOne({ rollNumber: identifier });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.status(200).json({
      message: `${role} login successful`,
      user: {
        id: user._id,
        role,
        fullname: user.fullname,
        identifier: role === "faculty" ? user.employeeId : user.rollNumber
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
