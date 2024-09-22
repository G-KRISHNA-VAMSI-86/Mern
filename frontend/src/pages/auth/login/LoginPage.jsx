import { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineMail, MdPassword, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleReset = () => {
    setFormData({
      username: "",
      password: "",
    });
  };

  return (
    <div className='flex h-screen'>
      <video
        className='absolute top-0 left-0 w-full h-full object-cover'
        autoPlay
        loop
        muted
        src='https://firebasestorage.googleapis.com/v0/b/mern-cfe0f.appspot.com/o/batman-rain.3840x2160.mp4?alt=media&token=69875b4c-a82c-4d42-8f43-7b7487207c44'
        type='video/mp4'
      />
      <div className='flex-1 flex flex-col justify-center items-center px-8 bg-transparent z-10'>
        <form className='flex gap-4 flex-col w-full max-w-md bg-white bg-opacity-60 p-8 rounded-lg shadow-lg' onSubmit={handleSubmit}> {/* Adjusted opacity */}
          <h1 className='text-3xl font-bold text-center text-gray-800 mb-8'>Welcome Back!</h1>

          <label className='input input-bordered rounded flex items-center gap-2 border-gray-300 focus-within:border-blue-500'>
            <MdOutlineMail className='text-gray-400' />
            <input
              type='text'
              className='grow p-2 outline-none'
              placeholder='Username'
              name='username'
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

          <label className='input input-bordered rounded flex items-center gap-2 relative border-gray-300 focus-within:border-blue-500'>
            <MdPassword className='text-gray-400' />
            <input
              type={showPassword ? 'text' : 'password'}
              className='grow p-2 outline-none'
              placeholder='Password'
              name='password'
              onChange={handleInputChange}
              value={formData.password}
            />
            <span className="absolute right-2 cursor-pointer text-gray-400" onClick={togglePasswordVisibility}>
              {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
            </span>
          </label>

          <div className="flex gap-2">
            <button className='btn rounded-full btn-primary text-white grow'>
              {isPending ? "Loading..." : "Login"}
            </button>
            <button type="button" className='btn rounded-full btn-secondary text-white' onClick={handleReset}>
              Reset
            </button>
          </div>

          {isError && <p className='text-red-500 text-center mt-2'>{error.message}</p>}
        </form>
        <div className='flex flex-col gap-2 mt-4 text-center'>
  			<p className='text-blue-600 font-semibold'>{"Don't"} have an account?</p>
  				<Link to='/signup'>
    			<button className='btn rounded-full btn-primary text-white btn-outline w-full py-3'>
      			Sign up
    			</button>
  				</Link>
		</div>
      </div>
    </div>
  );
};

export default LoginPage;
