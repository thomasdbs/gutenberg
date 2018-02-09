import React, { Component } from 'react'
import TweenMax from 'gsap'
import Container from '../general/Container'
import { Redirect } from 'react-router'

class LegalNotice extends Component {

  state = {
    redirection:false
  }

  redirection = (page, fromNavbar = false) => {
    this.setState({ redirection:page })
  }

  render() {

    if (this.state.redirection !== false) {
      return (<Redirect to={`${this.state.redirection}`} />)
    }else {
      return (
        <Container redirection={this.redirection}>
            <p style={{ textAlign:'justify' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget vestibulum turpis. Nulla et ipsum urna. Curabitur convallis bibendum mi, at placerat ligula molestie eu. Vestibulum tellus enim, egestas at malesuada sit amet, fringilla a enim. Donec ullamcorper posuere velit, non elementum urna elementum a. Suspendisse tristique efficitur ante, vitae hendrerit tellus ultrices sed. Aliquam vehicula tincidunt consectetur. Sed vehicula ut nulla a finibus. Maecenas tincidunt massa purus, mollis ornare dolor mollis nec. Integer rhoncus eleifend libero, ut lobortis quam condimentum at. Nunc faucibus erat dolor, sed bibendum elit fermentum eget.
              <br/><br/>
              Donec quis malesuada arcu. Donec lobortis, nunc vitae sollicitudin suscipit, nunc massa accumsan tellus, ac iaculis elit erat ut eros. Sed id consequat orci, sit amet pretium quam. Nam eu auctor elit, eu maximus dolor. Sed vitae pretium odio, at ultricies turpis. Morbi urna arcu, scelerisque a justo at, interdum iaculis sem. Vestibulum suscipit rutrum nisi, aliquam auctor arcu porttitor ut. Vestibulum tempus, nisi sit amet bibendum laoreet, tellus orci iaculis erat, vel accumsan ante libero vel magna. Praesent sagittis blandit quam, ut auctor elit gravida a. Aenean laoreet felis mi, non commodo magna euismod nec.
              <br/><br/>
              Sed nec ipsum lectus. Praesent sagittis tincidunt enim. Ut at porttitor metus. Aenean ut maximus dolor. Aliquam erat volutpat. In eget neque sed nibh elementum elementum sed sed neque. Aliquam erat volutpat. Ut ac ante rhoncus, dapibus turpis vel, placerat est. Pellentesque tincidunt varius purus eget tempor. Nunc iaculis ante ac luctus aliquam. Vestibulum mattis lorem sem, nec rutrum ligula placerat id. Nunc quis nisl elit. In sit amet orci sit amet dui elementum feugiat ut eu magna. Nunc libero libero, convallis ut nibh sed, placerat gravida odio.
              <br/><br/>
              Phasellus cursus, dolor vel faucibus semper, felis eros congue ligula, eget pellentesque mauris mauris eu ligula. Fusce dapibus congue leo, a pellentesque leo fringilla non. Duis sit amet felis metus. Fusce lacus felis, varius blandit fermentum at, ultrices eget magna. Vivamus ullamcorper eros ut velit euismod sollicitudin. Nam placerat fermentum rutrum. Vestibulum suscipit ex ut tincidunt vehicula. Fusce porta imperdiet lorem ut finibus. Aliquam sollicitudin lacus vitae eros faucibus, at placerat arcu finibus. Morbi posuere ipsum vitae est congue cursus. Cras maximus metus ac sapien ultrices, nec rutrum dui vestibulum. Aenean massa turpis, tincidunt vel turpis et, condimentum facilisis dolor. Suspendisse potenti.
            </p>
        </Container>
      )
    }
  }
}

export default LegalNotice;
