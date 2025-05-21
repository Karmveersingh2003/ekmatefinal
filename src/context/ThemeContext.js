import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Check if user has a theme preference in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    // Return true if saved theme is 'dark', false if 'light' or not set
    return savedTheme === 'dark';
  });

  // Apply theme class to body when theme changes
  useEffect(() => {
    // Update body class based on theme
    if (darkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Apply theme class on initial render
  useEffect(() => {
    // Set initial theme class
    const initialTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(initialTheme === 'dark' ? 'dark-theme' : 'light-theme');
  }, []);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const value = {
    darkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
