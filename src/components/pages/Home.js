import React, { Component } from 'react'
import TweenMax from 'gsap'
import Container from '../general/Container'
import { Redirect } from 'react-router'

class Home extends Component {

  state = {
    redirection:false
  }

  componentDidMount() {
    const boxesWidth = window.innerWidth / 4
    TweenMax.to('.item-left, .item-right', 1, { width:`${boxesWidth}px` })
    setTimeout( () => { document.querySelectorAll('.item-left, .item-right').forEach( (b) => { b.style.padding = '20px' } ) }, 1000)
    TweenMax.to('.item-left *, .item-right *', 1, { opacity:1 }).delay(1.5)
  }

  redirection = (page, fromNavbar = false) => {

    document.querySelectorAll('.item-left, .item-right').forEach( (b) => { b.style.padding = 0 } )
    TweenMax.to('.item-left *, .item-right *, .bottom-links', 1, { opacity:0 })
    TweenMax.to('.item-left, .item-right', 1, { width:0 }).delay(0.5)

    if (fromNavbar === false) {
      setTimeout( () => {
        this.setState({ redirection:page })
      }, 2500);
    }else {
      this.setState({ redirection:page })
    }

  }

  render() {

    if (this.state.redirection !== false) {
      return (<Redirect to={`${this.state.redirection}`} />)
    }else {
      return (
        <Container redirection={this.redirection}>
          <div className="bottom-links">
            <button onClick={() => this.redirection('/histoire')}>Notre histoire</button>
            <button onClick={() => this.redirection('/panier')}>Panier</button>
            <button onClick={() => this.redirection('/contact')}>Contact</button>
          </div>
          <div onClick={() => this.redirection('/produit/0')} className="item-left">
            <div className="title-container">
              <div>
                <h1>TOUTE <br />UNE IMPRIMERIE</h1>
              </div>
            </div>
            <button onClick={() => this.redirection('/produit/0')}>Nos produits</button>
          </div>
          <div onClick={() => this.redirection('/commandes')} className="item-right">
            <div className="title-container">
              <div>
                <h1>A VOTRE <br />SERVICE</h1>
              </div>
            </div>
            <button onClick={() => this.redirection('/commandes')}>Mes commandes</button>
          </div>
        </Container>
      )
    }
  }
}

export default Home;
