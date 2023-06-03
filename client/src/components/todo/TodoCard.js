import React from 'react';
import './TodoCard.css';
import { MdEdit } from 'react-icons/md';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const TodoCard = ({ data, handleDeleteTodo }) => {
  return (
    <div className='todo__card d-flex align-items-center justify-content-between border-bottom py-2'>
      <h4 className=' h6 todo__title m-0'>{data.title}</h4>
      <div className='toto__action__btns d-flex'>
        <Link
          to={`/update/${data._id}`}
          className='icon__btn btn__small btn__text'
          title='Create Todo'
        >
          <MdEdit fontSize={20} />
        </Link>

        <button
          className='icon__btn btn__small btn__text'
          title='Create Todo'
          onClick={() => handleDeleteTodo(data._id)}
        >
          <RiDeleteBin5Line fontSize={20} color='#b94a48' />
        </button>
      </div>
    </div>
  );
};

export default TodoCard;
