import React, {Fragment} from 'react';
import {Modal, Row, Col, Form, Button} from 'react-bootstrap';
import {connect} from 'react-redux'
import {editBook} from '../Publics/Actions/books';
import {getGenres} from '../Publics/Actions/genres';

class EditBookForm extends React.Component{
  constructor(props){
    super(props)
    const bookData = props.book.booksList.find((book) => Number(book.id) === Number(props.bookId)) 
    this.state = {
      genreList:[],
      idBook: props.bookId,
      image: undefined,
      formData:{
        title: bookData.title,
        genre_id: bookData.genre_id,
        image: bookData.image,
        description: bookData.description,
        date_released: bookData.date_released.split('T')[0],
      },
      showModal:false,
      modalTitle:"",
      modalMessage:"",
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleClose = ()=>{
    this.setState({showModal: false})
    this.props.closeModal()
  }

  handleFile = (e) => {
    const files = Array.from(e.target.files)
    this.setState({image:files[0]})
  }


  handleChange= (event) => {
    let newFormData = {...this.state.formData}
    const target = event.target
    const name = target.name
    const value = target.value
    newFormData[name] = value
    this.setState({
      formData: newFormData
    },()=>{console.log(this.state.formData)})
  }

  handleSubmit = (event)=>{
    event.preventDefault();
    let formData = new FormData() 
    formData.append('title', this.state.formData.title)
    formData.append('description', this.state.formData.description)
    formData.append('date_released', this.state.formData.date_released)
    formData.append('genre_id', this.state.formData.genre_id)
    
    if (this.state.image !== undefined) {formData.append('image', this.state.image)}
    else {formData.append('image', this.state.formData.image)}
    
    this.props.dispatch(editBook(this.state.idBook,formData))
      .then(()=>{
        this.setState({
          showModal:true,
          modalTitle:"Success",
          modalMessage:"Success edit book",
        })
      })
      .catch(() => {
        this.setState({
          showModal:true,
          modalTitle:"Failed",
          modalMessage:this.props.book.errMessage
        })
      })
  }

  componentDidMount = async () => {
    await this.props.dispatch(getGenres())
    this.setState ({genreList: this.props.genre.genresList})
  };
  render(){
    const {genreList} = this.state
    const rawDate = new Date(this.state.formData.date_released)
    let year = rawDate.getFullYear()
    let month = rawDate.getMonth() < 9 ? `0`+(rawDate.getMonth() + 1) : rawDate.getMonth() + 1
    let date = rawDate.getDate() < 10 ? `0`+rawDate.getDate() : rawDate.getDate()

    let date_released = `${year}-${month}-${date}`

    return (
      <Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group as={Row} controlId="formPlaintextTitle">
            <Form.Label column sm="2">
              Title
            </Form.Label>
            <Col sm="10">
              <Form.Control value={this.state.formData.title} onChange={this.handleChange} type="text" name="title" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPlaintextDescription">
            <Form.Label column sm="2">
            Description
            </Form.Label>
            <Col sm="10">
              <Form.Control value={this.state.formData.description} onChange={this.handleChange} type="text" name="description" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPlaintextImageURL">
            <Form.Label column sm="2">
            Image
            </Form.Label>
            <Col sm="10">
              <Form.Control onChange={this.handleFile} type="file" name="image" placeholder="Image URL..."/>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPlaintextDateReleased">
            <Form.Label column sm="2">
            Date Released
            </Form.Label>
            <Col sm="10">
              <Form.Control value={date_released} onChange={this.handleChange} name="date_released" type="date" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPlaintextGenre">
            <Form.Label column sm="2">Genre</Form.Label>
            <Col sm="10">
              <Form.Control 
                onChange={this.handleChange} 
                as="select" 
                name="genre_id" 
                defaultValue={this.props.bookData.genre_id} 
                value={this.props.bookData.genre_id}
                >
                {genreList.length !== 0 ? genreList.map((genre) => {
                  return <option value={genre.id} key={genre.id}> {genre.name} </option>
                })
                :<option>Loading...</option>
              }
              </Form.Control>
            </Col>
          </Form.Group>

          <Button  style={{float:"right"}} variant="warning" type="submit" className="btn-black">
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
const mapStateToProps = (state) => {
  return{
    book: state.book,
    genre: state.genre,
  }
}
export default connect(mapStateToProps)(EditBookForm)