require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parses JSON data
app.use(bodyParser.urlencoded({ extended: true })); // Parses form data
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
  

app.post("/send-message", async (req, res) => {
    try {
        console.log("Received request body:", req.body); // Debugging

        const { fullname, email, message } = req.body;

        if (!fullname || !email || !message) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let mailOptions = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `New Contact Form Message from ${fullname}`,
            text: `Name: ${fullname}\nEmail: ${email}\nMessage: ${message}`
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);

        res.json({ message: "Message sent successfully!" });

    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.toString() });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
