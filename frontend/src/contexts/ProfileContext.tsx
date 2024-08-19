import React, { createContext, useState, useContext, ReactNode } from "react";

export type ProfileType = {
  role: string;
  nickname: string;
};

interface ProfileContextProps {
  profile: ProfileType;
  setProfile: (question: ProfileType) => void;
}

const ProfileContext = createContext<ProfileContextProps | undefined>(
  undefined,
);

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [profile, setProfile] = useState<ProfileType>({
    role: "",
    nickname: "",
  });

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
