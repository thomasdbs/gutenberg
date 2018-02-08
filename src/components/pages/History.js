import React, { Component } from 'react'
import TweenMax from 'gsap'
import Container from '../general/Container'
import { Redirect } from 'react-router'

class History extends Component {

  state = {
    redirection:false,
    currentLine:0,
    lineOne:{
      one:"Un savoir faire légendaire",
      two:"Le respect de l'environnement comme crédo",
      three:"Du papier de qualité imprimé en France"
    },
    lineTwo:{
      one:"Du papier de qualité imprimé en France",
      two:"Un savoir faire légendaire",
      three:"Le respect de l'environnement comme crédo"
    },
    lineThree:{
      one:"Le respect de l'environnement comme crédo",
      two:"Du papier de qualité imprimé en France",
      thre:"Un savoir faire légendaire"
    }
  }

  componentDidMount() {
    this.linesAppearance()
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress)
  }

  linesAppearance = () => {
    window.addEventListener('keydown', this.handleKeyPress);
    document.querySelectorAll('.fullscreen-history h1').forEach( (t) => {
      TweenMax.to(t, 0.8, { opacity:1, marginTop:0 }).delay(Number(t.dataset.delay))
    })

    document.querySelectorAll('.fullscreen-history button').forEach( (b) => {
      TweenMax.to(b, 0.5, { opacity:1 }).delay(3)
    })
  }

  removeLine = () => {
    window.removeEventListener('keydown', this.handleKeyPress)

    document.querySelectorAll('.fullscreen-history button').forEach( (b) => {
      TweenMax.to(b, 0.5, { opacity:0 })
    })

    document.querySelectorAll('.fullscreen-history h1').forEach( (t) => {
      TweenMax.to(t, 0.5, { opacity:0, marginTop:'-30px' }).delay(Number(1+t.dataset.delay/2))
    })
  }

  changeLine = (action) => {

    this.removeLine()

    setTimeout( () => {

      document.querySelectorAll('.fullscreen-history h1').forEach( (t) => {
        t.style.marginTop='30px'
      })

      if (action === 'next') {
        this.setState({ currentLine:this.state.currentLine+1 })
      }else {
        this.setState({ currentLine:this.state.currentLine-1 })
      }

    }, 2500)

  }

  redirection = (page, fromNavbar = false) => {

    this.removeLine()
    if (fromNavbar === false) {
      setTimeout( () => {
        this.setState({ redirection:page })
      }, 2500);
    }else {
      this.setState({ redirection:page })
    }

  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentLine !== this.state.currentLine) {
      this.linesAppearance()
    }
  }

  handleKeyPress = (event) => {
    if(event.key === 'ArrowUp' || event.key === 'ArrowLeft'){
      if(this.state.currentLine > 0) {
        this.changeLine('previous')
      }
    }else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      if(this.state.currentLine < 2) {
        this.changeLine('next')
      }
    }
  }

  render() {

    if (this.state.redirection !== false) {
      return (<Redirect to={`${this.state.redirection}`} />)
    }else {

      const textOne = this.state.lineOne[Object.keys(this.state.lineOne)[this.state.currentLine]]
      const textTwo = this.state.lineTwo[Object.keys(this.state.lineTwo)[this.state.currentLine]]
      const textThree = this.state.lineThree[Object.keys(this.state.lineThree)[this.state.currentLine]]

      return (
        <Container redirection={this.redirection}>

          <div className="fullscreen-history">

            {(this.state.currentLine > 0) && (
              <button onClick={() => this.changeLine('previous')}>
                <img src={require('../../pic/arrow-up.png')} alt=""/>
              </button>
            )}

            <h1 data-delay="0.4">{textOne}</h1>
            <h1 data-delay="1.2">{textTwo}</h1>
            <h1 data-delay="2">{textThree}</h1>

            {(this.state.currentLine < 2) && (
            <button onClick={() => this.changeLine('next')}>
              <img src={require('../../pic/arrow-down.png')} alt=""/>
            </button>
            )}

          </div>

        </Container>
      )
    }
  }
}

export default History;
