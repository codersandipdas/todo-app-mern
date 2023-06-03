import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import TodoCard from '../components/todo/TodoCard';
import TodoHeader from '../components/header/TodoHeader';

const Home = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [serach, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_AUTH}/api/v1/todo?search=${serach}&page=${page}`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );
        setTodos(response.data.todos);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [token, serach, page]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_AUTH}/api/v1/todo/${id}`,
        { headers: { authorization: `Bearer ${token}` } }
      );

      const response = await axios.get(
        `${process.env.REACT_APP_API_AUTH}/api/v1/todo?search=${serach}&page=${page}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      setTodos(response.data.todos);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <TodoHeader />

      <main className='main-container py-4'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6 col-xl-5 mx-auto'>
              <div className='mb-3 input-items'>
                <input
                  placeholder='Search...'
                  value={serach}
                  onChange={(e) => setSearch(e.target.value)}
                  className='w-100 input'
                />
              </div>

              {todos.map((item) => {
                return (
                  <TodoCard
                    key={item._id}
                    data={item}
                    handleDeleteTodo={handleDeleteTodo}
                  />
                );
              })}

              {totalPages > 1 && (
                <div className='mt-5'>
                  <nav aria-label='navigation'>
                    <ul className='pagination justify-content-center'>
                      {currentPage > 1 && (
                        <li className='page-item'>
                          <button
                            className='page-link'
                            onClick={() => setPage(currentPage - 1)}
                          >
                            <span>&laquo;</span>
                          </button>
                        </li>
                      )}

                      {[...Array(totalPages)].map((e, i) => {
                        return (
                          <li className='page-item' key={i}>
                            <button
                              className={`page-link ${
                                currentPage === i + 1 && 'active'
                              }`}
                              onClick={() => setPage(i + 1)}
                            >
                              {i + 1}
                            </button>
                          </li>
                        );
                      })}

                      {currentPage < totalPages && (
                        <li className='page-item'>
                          <button
                            className='page-link'
                            onClick={() => setPage(currentPage + 1)}
                          >
                            <span>&raquo;</span>
                          </button>
                        </li>
                      )}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
