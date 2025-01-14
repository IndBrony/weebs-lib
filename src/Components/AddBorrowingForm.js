import React,{Fragment} from 'react';
import {Row, Col, Form, Button, Modal} from 'react-bootstrap';
import {connect} from 'react-redux';

import {borrow, getBorrowingHistory} from '../Publics/Actions/borrowings';
import {setAvailability} from '../Publics/Actions/books';

class AddBorrowingForm extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      formData:{
        user_id: undefined,
        book_id: props.bookId
      },
      showModal:false,
      modalTitle:"",
      modalMessage:"",
      history:props.history,
    }
  }

  handleClose = ()=>{
    this.props.closeModal()
    this.setState({showModal: false})
    if(this.state.modalTitle !== "Failed")
      this.props.dispatch(setAvailability(this.state.formData.book_id, 0))
  }

  handleChange = (event) => {
    let newFormData = {...this.state.formData}
    const target = event.target
    const name = target.name
    const value = target.value
    newFormData[name] = value
    this.setState({
      formData: newFormData
    })
    console.log(this.state.formData)
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let {formData} = this.state
    if(this.props.user.userProfile.level === 'admin') formData.is_confirmed = 1
    this.props.dispatch(borrow(formData))
      .then((res)=>{
        console.log(res)
        const borrowed_at = res.value.data.data.borrowed_at
        const borrowingDate = new Date(borrowed_at)
        let expirationDate = new Date()
        expirationDate.setTime(borrowingDate.getTime() + (1000*60*60*24*7))
        this.props.dispatch(getBorrowingHistory())
        this.setState({
          showModal: true,
          modalTitle:"Success",
          modalMessage:`Success Borrowing Book! Please return it before ${expirationDate.toDateString()}`,
        })
      })
      .catch(() => {
        this.setState({
          showModal:true,
          modalTitle:"Failed",
          modalMessage:this.props.borrowing.errMessage
        })
      })
  }
  render(){
    return (
      <Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group as={Row} controlId="formPlaintextUserId">
            <Form.Label column sm="2">
              User ID
            </Form.Label>
            <Col sm="10">
              <Form.Control onChange={this.handleChange} type="text" name="user_id" placeholder="User ID..." />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPlaintextBookId">
            <Form.Label column sm="2">
            Book ID
            </Form.Label>
            <Col sm="10">
              <Form.Control onChange={this.handleChange} value={this.props.bookId} type="text" name="book_id" placeholder="Book ID..." />
            </Col>
          </Form.Group>

          <Button style={{float:"right"}} variant="warning" type="submit" className="btn-black">
            Save
          </Button>
        </Form>
        <Modal show={this.state.showModal} onHide={this.handleClose}>
          <Modal.Header>
            <Modal.Title>{this.state.modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.modalMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}
const mapStateToProps = state => {
  return{
    book: state.book,
    genre: state.genre,
    user: state.user,
    borrowing: state.borrowing
  }
}
export default connect(mapStateToProps)(AddBorrowingForm)