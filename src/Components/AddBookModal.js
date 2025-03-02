import React, {Fragment} from 'react'
import {Modal, Button} from 'react-bootstrap'
import AddBookForm from './AddBookForm';

class AddBookModal extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      showModal: false,
    }
  }
  render(){
    return(
      <Fragment>
        <Button 
          variant={this.props.variant || "light"} 
          size="lg"
          onClick={() => {this.setState({showModal:true})}}>
          {
            this.props.user.userProfile.level === 'admin'?'Add Book': 'Donate Book'
          }
        </Button>
        <Modal
          show={this.state.showModal}
          onHide={() => {this.setState({showModal:false})}}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add Book
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddBookForm closeModal={()=>{this.setState({showModal:false})}} history={this.props.history}/>
          </Modal.Body>
        </Modal>
      </Fragment>
    )
  }
}
export default AddBookModal