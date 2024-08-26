import React from 'react';

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-center text-2xl font-bold mb-4">Sign in to continue</h2>
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
        </div>
        <form>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            Sign in
          </button>
          <div className="flex justify-between mt-3 text-sm">
            <label>
              <input type="checkbox" className="mr-1" />
              Stay signed in
            </label>
            <a href="#" className="text-blue-500 hover:underline">Need help?</a>
          </div>
        </form>
        <div className="mt-4">
          <button
            className="w-full flex items-center justify-center border border-gray-300 rounded p-3 hover:bg-gray-100"
            onClick={() => window.location.href='/google-auth-url'}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5 mr-3"
            />
            Sign up using Google
          </button>
        </div>
        <p className="text-center text-sm mt-4">
          <a href="#" className="text-blue-500 hover:underline">Create an account</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
