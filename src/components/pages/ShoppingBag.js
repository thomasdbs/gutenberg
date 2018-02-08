import React, { Component } from 'react'
import TweenMax from 'gsap'
import Container from '../general/Container'
import { Redirect } from 'react-router'
import axios from 'axios'
import Tilt from 'react-tilt'

class ShoppingBag extends Component {

  state = {
    redirection:false,
    products:[],
    navbar:false,
    loading:true,
    savedProducts:[],
    paying:false,
    paied:false,
    firstName:'Thomas',
    lastName:'Dubois',
    email:'thomas.dubois@agenceseize.fr',
    addr:"17 rue Deshoulières",
    pc:'44000',
    city:'Nantes',
    password:'ecv',
    cardNumber:'0123 0123 0123 0123 0123',
    cardExpiration:'01/20',
    cardCrypto:'012',
    token:null
  }

  componentWillMount() {

    const savedProducts = JSON.parse(localStorage.getItem('saved'))

    if (savedProducts === null) {
      this.setState({ loading: false })
    }else {
      console.log(savedProducts);
      axios.get(`https://thomasdubois.fr/wp-json/wc/v2/products?consumer_key=ck_ba78c163da1ebcf239b62c6f243e25ee489379d3&consumer_secret=cs_b21c28aa1f27bc0183fbc3fd9c0398faf75aeef0&per_page=50`)
      .then((response) => {
        this.setState({ products:response.data, savedProducts:savedProducts, loading: false })
        this.animateBag()
      })
      .catch((error) => {
        alert(JSON.stringify(error))
      })
    }
  }

  animateBag = () => {
    let i = 0
    TweenMax.to('.bag-pay', 1, { opacity:1 }).delay(i+=0.5)
    document.querySelectorAll('.product').forEach( (p) => {
      TweenMax.to(p, 1, { opacity:1 }).delay(i+=0.5)
    })
    TweenMax.to('.line', 0.3, { width:'100%' }).delay(i)
  }

  goodbyeBag = () => {
    TweenMax.to('.line', 0.3, { width:0 })
    TweenMax.to('.product, .paying-form', 1, { opacity:0 }).delay(0.3)
    TweenMax.to('.bag-pay', 1, { opacity:0 }).delay(1)
  }

  roundPrice = (number, precision) => {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  removeFromBag = id => {
    let savedProducts = JSON.parse(localStorage.getItem('saved'))
    const index = savedProducts.indexOf(id)
    if (index > -1) {
      TweenMax.to(`#product-${id}`, 1, { opacity:0 })
      setTimeout( () => {
        savedProducts.splice(index, 1)
        localStorage.setItem('saved', JSON.stringify(savedProducts))
        this.setState({ savedProducts:savedProducts })
      }, 1000)
    }
  }

  goToPay = () => {
    TweenMax.to('.bag-products, .actions', 1, { opacity:0 })
    setTimeout( () => {
      this.setState({ paying:true })
    }, 1000);
  }

  componentDidUpdate(prevProps,prevState) {
    if (prevState.savedProducts.length !== 0 && prevState.savedProducts !== this.state.savedProducts) {
      document.querySelectorAll('.product').forEach( (p) => {
        p.style.opacity=1
      })
    }else if (prevState.paying === false && this.state.paying === true) {
      this.animatePayingForm()
    }else if (prevState.paied === false && this.state.paied === true) {
      this.animateMessage()
    }
  }

  animatePayingForm = () => {
    TweenMax.to('.paying-form', 1.5, { opacity:1 }).delay(.5)
    TweenMax.to('.title .line', 0.5, { width:'100%' }).delay(1)
    TweenMax.to('input', 0.2, { borderBottomWidth:'10px' }).delay(1.3)
    TweenMax.to('input', 0.2, { borderBottomWidth:'3px' }).delay(1.6)
  }

  animateMessage = () => {
    TweenMax.to('.bag-pay', 1, { opacity:1 })
    TweenMax.to('.line', 0.3, { width:'100%' }).delay(0.8)
  }


  redirection = (page, fromNavbar = false) => {

    if (fromNavbar === false) {
      this.goodbyeBag()
      setTimeout( () => {
        this.setState({ redirection:page })
      }, 2000);
    }else {
      this.setState({ redirection:page })
    }

  }

  pay = (e) => {
    e.preventDefault();
    this.goodbyeBag()
    const token = Math.floor((Math.random() * 100000) + 1)
    localStorage.setItem('token', token)
    localStorage.setItem('password', this.state.password)
    setTimeout( () => {
      this.setState({ loading:true, token:token })
    }, 2000);
    setTimeout( () => {
      this.setState({ paied:true, loading:false, paying:false })
    }, 5000);
  }


  render() {

    if (this.state.redirection !== false) {
      return (<Redirect to={`${this.state.redirection}`} />)
    }else {

      let products = null
      let savedProducts = null
      let totalPrice = 0

      products = Object
      .keys(this.state.products)
      .map(key => savedProducts = Object
      .keys(this.state.savedProducts)
      .map(item => (this.state.savedProducts[item] == this.state.products[key].id) && (
        <div id={`product-${this.state.products[key].id}`} className="product" key={totalPrice+=Number(this.state.products[key].price)}>
          <div className="picture">
            <img src={this.state.products[key].images[0].src} alt=""/>
          </div>
          <div className="details">
            <h4>{this.state.products[key].name}</h4>
            <p>{this.state.products[key].price} €</p>
            <p>{this.state.products[key].dimensions.width} x {this.state.products[key].dimensions.height} cm</p>
            <button onClick={() => this.removeFromBag(this.state.products[key].id)} >
              <i className="ion-close-round"></i> Supprimer
            </button>
          </div>
        </div>
      )))

      return (
        <Container redirection={this.redirection} >

          {(this.state.loading === true) && (
            <div className="book">
              <div className="book__page"></div>
              <div className="book__page"></div>
              <div className="book__page"></div>
            </div>
          )}

          {(this.state.loading === false && this.state.savedProducts.length > 0 && this.state.paying === false && this.state.paied === false) && (
            <div className="bag-products">
              {products}
            </div>
          )}

          {(this.state.savedProducts.length === 0 && this.state.loading === false) && (
            <div className="bag-pay" style={{ width:'100%' }}>
              <div className="title">
                <h1>Oups... votre panier est vide, il faut remédier à cela ;)</h1>
                <div className="line"></div>
              </div>
              <div className="actions">
                <button className="error" onClick={() => this.redirection('/produit/0')}>
                  Nos produits
                </button>
              </div>
            </div>
          )}

          {(this.state.paied === true && this.state.loading === false) && (
            <div className="bag-pay" style={{ width:'100%' }}>
              <div className="title">
                <h1>Votre commande a bien été effectuée !</h1>
                <div className="line"></div>
              </div>
              <div className="presentation">
                <h3>Vous pouvez consulter l'état de votre commande en vous rendant dans la rubrique "Mes commandes", et en utilisant le code <u>{this.state.token}</u> ainsi que du mot de passe saisi précédemment.</h3>
              </div>
              <div className="actions">
                <button onClick={() => this.redirection('/commandes')}>
                  Suivre ma commande
                </button>
              </div>
            </div>
          )}

          {(this.state.loading === false && this.state.paying === true) && (
            <div className="paying-form">
              <div className="informations">
                  <form
                    onSubmit={(e) => this.pay(e)}
                  >

                    <div className="title">
                      <h3>Coordonnées</h3>
                      <div className="line"></div>
                    </div>

                    <input
                      required
                      type="text"
                      placeholder="Nom"
                      name="lastName"
                      ref={input => this.lastName = input}
                      value={this.state.lastName}
                      onChange={() => this.setState({lastName:this.lastName.value})}
                    />

                    <input
                      required
                      type="text"
                      placeholder="Prénom"
                      name="firstName"
                      ref={input => this.firstName = input}
                      value={this.state.firstName}
                      onChange={() => this.setState({firstName:this.firstName.value})}
                    />

                    <input
                      required
                      type="email"
                      placeholder="Adresse mail"
                      name="email"
                      ref={input => this.email = input}
                      value={this.state.email}
                      onChange={() => this.setState({email:this.email.value})}
                    />

                    <input
                      required
                      type="text"
                      placeholder="Adresse"
                      name="addr"
                      ref={input => this.addr = input}
                      value={this.state.addr}
                      onChange={() => this.setState({addr:this.addr.value})}
                    />

                    <input
                      required
                      type="text"
                      placeholder="Code postal"
                      name="pc"
                      maxLength={5}
                      ref={input => this.pc = input}
                      value={this.state.pc}
                      onChange={() => this.setState({pc:this.pc.value})}
                    />

                    <input
                      required
                      type="text"
                      placeholder="Ville"
                      name="city"
                      ref={input => this.city = input}
                      value={this.state.city}
                      onChange={() => this.setState({city:this.city.value})}
                    />

                    <input
                      required
                      type="password"
                      placeholder="Mot de passe (pour suivre votre commande)"
                      name="password"
                      ref={input => this.password = input}
                      value={this.state.password}
                      onChange={() => this.setState({password:this.password.value})}
                    />

                    <div className="title">
                      <h3>Paiement</h3>
                      <div className="line"></div>
                    </div>

                    <input
                      required
                      type="text"
                      placeholder="Numéro de carte"
                      name="cardNumber"
                      ref={input => this.cardNumber = input}
                      value={this.state.cardNumber}
                      onChange={() => this.setState({cardNumber:this.cardNumber.value})}
                    />

                    <input
                      required
                      type="text"
                      placeholder="Date d'éxpiration ( 00/00 )"
                      name="cardExpiration"
                      ref={input => this.cardExpiration = input}
                      value={this.state.cardExpiration}
                      onChange={() => this.setState({cardExpiration:this.cardExpiration.value})}
                    />

                    <input
                      required
                      type="text"
                      placeholder="Numéro secret"
                      name="cardCrypto"
                      maxLength={3}
                      ref={input => this.cardCrypto = input}
                      value={this.state.cardCrypto}
                      onChange={() => this.setState({cardCrypto:this.cardCrypto.value})}
                    />

                    <button type="submit">
                      Payer
                    </button>

                  </form>
              </div>
            </div>
          )}

          {(this.state.loading === false && this.state.savedProducts.length > 0 && this.state.paied === false) && (
            <div className="bag-pay">
              <div className="title">
                <h1>Total : {this.roundPrice(totalPrice,1)}0 €</h1>
                <div className="line"></div>
              </div>
              <div className="presentation">
                {(this.state.savedProducts.length > 1) ?
                  <h3>{this.state.savedProducts.length} articles</h3>
                :
                <h3>{this.state.savedProducts.length} article</h3>
                }
              </div>
              {(this.state.paying === false)  &&(
                <div className="actions">
                  <button className="success" onClick={() => this.goToPay()}>
                    Payer
                  </button>
                  <button className="error" onClick={() => this.redirection('/produit/0')}>
                    Continuer mes achats
                  </button>
                </div>
              )}

            </div>
          )}


        </Container>
      )
    }
  }
}

export default ShoppingBag;
