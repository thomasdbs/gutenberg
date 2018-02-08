import React, { Component } from 'react'
import TweenMax from 'gsap'

class Container extends Component {

  state = {
    navbar:false,
    endOfAnimation:true
  }

  toggleNavbar = () => {
    document.querySelector('.navbar-logo').classList.toggle('open')
    if (this.props.toggleNavbar) {
      this.props.toggleNavbar(!this.state.navbar)
    }
    this.setState({ navbar:!this.state.navbar, endOfAnimation:false })
  }

  componentDidUpdate() {
    if (this.state.endOfAnimation === false) {
      if (this.state.navbar === true) {
        const navbarWidth = window.innerWidth - 60
        TweenMax.to('.navbar', 1, { width: `${navbarWidth}px`})
        document.querySelectorAll('.navbar-link').forEach( (l) => {
          TweenMax.to(l, 0.5, { opacity: 1 }).delay(Number(l.dataset.delay))
        })
        document.querySelectorAll('.navbar-geometry').forEach( (g) => {
          TweenMax.to(g, 0.5, { width: `${g.dataset.width}px` }).delay(Number(g.dataset.delay))
        })
      }else {
        this.hideNav(false)
      }
      setTimeout( () => {
        this.setState({ endOfAnimation: true })
      }, 2500)
    }
  }

  hideNav = redirect => {
    document.querySelectorAll('.navbar-geometry').forEach( (g) => {
      TweenMax.to(g, 0.5, { width: 0 })
    })
    TweenMax.to('.navbar-link', 1, { opacity: 0 }).delay(0.5)
    TweenMax.to('.navbar', 1, { width: 0 }).delay(1.5)
    if (redirect !== false) {
      setTimeout( () => {
        this.props.redirection(redirect,true)
      }, 1500);
    }
  }

  render() {
    return (
      <div className="container-out">
        <div className="container-in">

          <button className="company-name" onClick={() => this.props.redirection('/')}>Gutenberg</button>

          <div className="navbar-logo" onClick={() => this.toggleNavbar()}>
            <div className="icon"></div>
          </div>

          { (this.state.endOfAnimation === false || this.state.navbar === true) && (
            <div className="navbar">

              <div className="navbar-item" data-margin="100" onClick={() => this.hideNav('/')}>
                <div className="navbar-geometry" data-width="80" data-delay="1"></div>
                <span className="navbar-link" data-delay="1">Accueil</span>
              </div>

              <div className="navbar-item" data-margin="-80" onClick={() => this.hideNav('/produit/0')}>
                <div className="navbar-geometry" data-width="50" data-delay="1.5"></div>
                <span className="navbar-link" data-delay="1.5">Nos produits</span>
              </div>

              <div className="navbar-item" data-margin="100" onClick={() => this.hideNav('/compte')}>
                <div className="navbar-geometry" data-width="60" data-delay="2"></div>
                <span className="navbar-link" data-delay="2">Mes commandes</span>
              </div>

              <div className="navbar-item" data-margin="60" onClick={() => this.hideNav('/histoire')}>
                <div className="navbar-geometry" data-width="80" data-delay="2.5"></div>
                <span className="navbar-link" data-delay="2.5">Notre histoire</span>
              </div>

              <div className="navbar-item" data-margin="140" onClick={() => this.hideNav('/contact')}>
                <div className="navbar-geometry" data-width="60" data-delay="3"></div>
                <span className="navbar-link" data-delay="3">Nous contacter</span>
              </div>

              <div className="navbar-item" data-margin="60" onClick={() => this.hideNav('/mentions-legales')}>
                <div className="navbar-geometry" data-width="50" data-delay="3.5"></div>
                <span className="navbar-link" data-delay="3.5">Mentions légales</span>
              </div>

            </div>
          )}


          {this.props.children}

        </div>
      </div>
    )
  }
}

export default Container;
