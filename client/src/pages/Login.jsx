import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/auth";
import { useAuth } from "../context/AuthContext";
function Login() {

  const navigate = useNavigate();
const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = await loginUser(formData);

login(data.token, data.user);

navigate("/dashboard");

    } catch (error) {

      alert(
        error.response?.data?.message || "Login Failed"
      );

    }

  };

  return (

    <div className="min-h-screen flex justify-center items-center">

      <div className="w-96 bg-white shadow p-6 rounded">

        <h1 className="text-3xl font-bold mb-5">
          Login
        </h1>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border w-full p-3 mb-4 rounded"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border w-full p-3 mb-4 rounded"
            onChange={handleChange}
          />

          <button
            className="bg-blue-600 text-white w-full p-3 rounded"
          >
            Login
          </button>

        </form>

        <p className="mt-5">

          Don't have an account?

          <Link to="/signup">
            Signup
          </Link>

        </p>

      </div>

    </div>

  );

}

export default Login;