import React from 'react';
import { Link } from 'react-router';

class SingleCommunique extends React.Component {

  componentDidMount () {
  	// console.log(this.props);
    const selectCommunique = this.props.selectCommunique;
    const communiqueId = this.props.routeParams.communiqueId;

    selectCommunique(communiqueId);
  }

  render() {
	  const communique = this.props.selectedCommunique;
	  return (
	    <div>
	    </div>
	  );
  }  
}

export default SingleCommunique;