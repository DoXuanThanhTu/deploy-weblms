import { createContext, useContext, useState } from "react";
export const AppContext = createContext();
export const AppContextProvider = (props) => {
  const [currCourse, setCurrCourse] = useState(null);
  const [courseChapters, setCourseChapters] = useState(null);
  const [courseLessons, setCourseLessons] = useState(null);
  const value = {
    currCourse,
    setCurrCourse,
    courseChapters,
    setCourseChapters,
    courseLessons,
    setCourseLessons,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
export const useAppContext = () => useContext(AppContext);
