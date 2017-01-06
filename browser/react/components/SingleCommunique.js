import React from 'react';
import { Link } from 'react-router';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import Textarea from 'react-textarea-autosize';

class SingleCommunique extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      title: '',
      date: '',
    };
  }

  componentDidMount () {
    const selectCommunique = this.props.selectCommunique;
    const communiqueId = this.props.routeParams.communiqueId;

    selectCommunique(communiqueId);
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(e.target.default);
    this.props.updateCommunique(e);
  }

  render() {
	  const communique = this.props.selectedCommunique;

    console.log(communique);
	  return (
      <div>
        <a href={communique.url}>View original on MOFA website </a>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input type="text" name="title" id="title" value={communique.title} />
          </FormGroup>        
          <FormGroup>
            <Label for="date">Date</Label>
            <Input type="text" name="date" id="date" value={communique.date} />
          </FormGroup>
          <FormGroup>
            <Label for="content">Content</Label>
            <Textarea id="content" value={communique.content} style={{width: '100%'}} onChange={e => this.setState({content: e.target.value})} />
          </FormGroup>
          <Button>Submit</Button>
        </Form>
      </div>
    );
  }  
}

export default SingleCommunique;