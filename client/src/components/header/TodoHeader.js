import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoIosLogOut } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const TodoHeader = () => {
  const { handleLogout } = useAuth();

  return (
    <header className='header py-3 shadow-sm'>
      <div className='container'>
        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <h2 className='h4 mb-0'>Todos</h2>
            <Link
              to='/create'
              className='icon__btn btn__small btn__filled'
              title='Create Todo'
            >
              <AiOutlinePlus fontSize={20} />
            </Link>
          </div>

          <div className=''>
            <button
              className='icon__btn btn__small btn__filled'
              title='Create Todo'
              onClick={handleLogout}
            >
              <IoIosLogOut fontSize={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TodoHeader;
