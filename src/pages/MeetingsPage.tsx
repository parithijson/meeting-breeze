
import React from "react";
import MeetingsList from "@/components/MeetingsList";

const MeetingsPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full py-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <MeetingsList />
    </div>
  );
};

export default MeetingsPage;
