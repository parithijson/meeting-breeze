
import React from "react";
import LoginForm from "@/components/LoginForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="text-center mb-8 animate-slide-down">
        <h1 className="text-4xl font-bold mb-2">Meeting Breeze</h1>
        <p className="text-xl text-muted-foreground">Simplify your online meetings</p>
      </div>
      
      <LoginForm />

      <div className="mt-12 text-center max-w-md animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <p className="text-sm text-muted-foreground">
          Sign in to access your dashboard, upload PDF documents, and start meetings with ease.
          <br />
          <span className="mt-2 block opacity-70">For demo purposes, you can enter any email and password.</span>
        </p>
      </div>
    </div>
  );
};

export default Index;
