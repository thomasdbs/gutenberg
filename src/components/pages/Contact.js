import React, { Component } from 'react'
import { TweenMax, TweenLite } from 'gsap'
import Container from '../general/Container'
import { Redirect } from 'react-router'
import Tilt from 'react-tilt'

class Contact extends Component {

  state = {
    redirection:false,
    email:'',
    subject:'',
    content:'',
    loading:false,
    ok:false,
    error:false
  }

  componentDidMount() {
    TweenMax.to('.contact-box', 1.5, { opacity:1 }).delay(.5)
    TweenMax.to('.title .line', 0.5, { width:'100%' }).delay(1)
    TweenMax.to('.picture', 0.5, { boxShadow:'-10px 10px #5bbacf' }).delay(1.3)
    TweenMax.to('input, textarea', 0.2, { borderBottomWidth:'20px' }).delay(1.7)
    TweenMax.to('input, textarea', 0.2, { borderBottomWidth:'3px' }).delay(2)
  }

  redirection = (page, fromNavbar = false) => {

    TweenMax.to('input, textarea', 0.2, { borderBottomWidth:'0' })
    TweenMax.to('.picture', 0.8, { boxShadow:'0 0 #5bbacf' }).delay(.2)
    TweenMax.to('.line', 0.8, { width:0 }).delay(0.8)
    TweenMax.to('.contact-box', 1, { opacity:0 }).delay(1.7)

    if (fromNavbar === false) {
      setTimeout( () => {
        this.setState({ redirection:page })
      }, 3000);
    }else {
      this.setState({ redirection:page })
    }

  }

  sendMail = e => {
    e.preventDefault();
    const iconAnimation = new TweenMax.to('#sending', 1, { rotation:360, transformOrigin:"right bottom", repeat:-1 }).timeScale(0)

    this.setState({ loading: true })
    TweenLite.to(iconAnimation, 1, { timeScale:1 })

    setTimeout( () => {
      TweenLite.to(iconAnimation, 2, { timeScale:0 })
      TweenMax.to('form input, form textarea', 1, { opacity:0 })
    }, 4000);

    setTimeout( () => {
      this.setState({ loading:false, ok:true })
      TweenMax.to('.message .line', 0.5, { width:'100%' }).delay(.1)
    }, 6000);

  }

  render() {

    if (this.state.redirection !== false) {
      return (<Redirect to={`${this.state.redirection}`} />)
    }else {

      let opacity = 0
      if (this.state.ok === true) {
        opacity = 1
      }

      return (
        <Container redirection={this.redirection}>

          <div className="contact-box">
            <div className="title">
              <h1>Gutenberg</h1>
              <div className="line"></div>
            </div>
            <div className="presentation">
              <h3>Service d'impression en ligne français</h3>
            </div>
            <div className="informations">
              <div className="text">
                <p>Tel : 06 60 26 90 50</p>
                <p>SAV : sav@gutenberg.fr</p>
                <p>Partenariat : partenariat@gutenberg.fr</p>
              </div>
              <Tilt options={{ max : 10, perspective:1000 }} className="picture" />
            </div>
          </div>
          <div className="contact-box">
            <div className="title">
              <h1>Contact</h1>
              <div className="line"></div>
            </div>
            <div className="informations">
                <form
                  onSubmit={(e) => this.sendMail(e)}
                >

                  <input
                    type="email"
                    placeholder="Adresse mail"
                    name="email"
                    ref={input => this.email = input}
                    value={this.state.email}
                    onChange={() => this.setState({email:this.email.value})}
                  />

                  <input
                    type="text"
                    placeholder="Sujet"
                    name="subject"
                    ref={input => this.subject = input}
                    value={this.state.subject}
                    onChange={() => this.setState({subject:this.subject.value})}
                  />

                  <textarea
                    placeholder="Message"
                    rows="2"
                    name="content"
                    ref={input => this.content = input}
                    value={this.state.content}
                    onChange={() => this.setState({content:this.content.value})}
                  />

                  <button type="submit">
                    <img id="sending" src={require('../../pic/send.png')} style={{ width:'30px' }} alt=""/>
                  </button>

                  <div className="message" style={{ opacity:opacity, marginTop:'40px' }} >
                    <h3>Votre message est en route !</h3>
                    <div className="line"></div>
                  </div>

                </form>
            </div>
          </div>

        </Container>
      )
    }
  }
}

export default Contact;
