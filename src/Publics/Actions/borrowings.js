import Axios from 'axios';
const token = window.localStorage.getItem("token")
export const borrow = (data) => {
  return {
    type:'BORROW_BOOK',
    payload: Axios.post(`http://localhost:3030/borrowings/`,data,{
        headers:{
          Authorization : token
        }
      }
    )
  }
}
export const returnBook = (data) => {
  return {
    type:'RETURN_BOOK',
    payload: Axios.patch(`http://localhost:3030/borrowings/`,data,{
        headers:{
          Authorization : token
        }
      }
    )
  }
}

export const getLatestBorrowingByBookId = (id) => {
  return {
    type:'GET_LATEST_BOOK_BORROWING',
    payload: Axios.get(`http://localhost:3030/borrowings/book/${id}`,{
        headers:{
          Authorization : token
        }
      }
    )
  }
}