import React from "react";
import { AlertCircle } from "lucide-react";

const AuthError = ({ error }) => {
  return (
    <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <p>{error}</p>
      </div>
    </div>
  );
};

export default AuthError;
