import { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';

/**
 * Custom hook to use the Todo context
 * @throws {Error} If used outside of TodoProvider
 * @returns {Object} Todo context value with all todo-related state and functions
 */
export const useTodos = () => {
  const context = useContext(TodoContext);
  
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  
  return context;
};

export default useTodos;