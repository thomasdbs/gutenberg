import React, { Component } from 'react'
import TweenMax from 'gsap'
import Container from '../general/Container'
import { Redirect } from 'react-router'
import axios from 'axios'
import Tilt from 'react-tilt'

class Orders extends Component {

  state = {
    connected:false,
    connectionError:false,
    redirection:false,
    products:[],
    navbar:false,
    loading:false,
    savedProducts:[],
    password:'ecv',
    token:''
  }

  componentDidMount() {
    TweenMax.to('.order-connexion', 1.5, { opacity:1 }).delay(.5)
    TweenMax.to('.title .line', 0.5, { width:'100%' }).delay(1)
    TweenMax.to('input', 0.2, { borderBottomWidth:'10px' }).delay(1.3)
    TweenMax.to('input', 0.2, { borderBottomWidth:'3px' }).delay(1.6)
  }

  connect = (e) => {
    e.preventDefault()
    const savedPassword = localStorage.getItem('password')
    const savedToken = localStorage.getItem('token')
    if (savedPassword !== null && savedToken !== null && this.state.password === savedPassword && this.state.token === savedToken) {
      this.goodbyeOrders()
      setTimeout( () => {
        this.setState({ connected:true, loading:true, connectionError:false })
      }, 1500);
    }else {
      this.setState({ connectionError:true })
    }
  }

  goodbyeOrders = () => {
    TweenMax.to('.line', 0.3, { width:0 })
    TweenMax.to('.order-connexion, .bag-products, .bag-pay', 1, { opacity:0 }).delay(.5)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.connected === false && this.state.connected === true) {
      this.loadOrders()
    }
  }

  loadOrders = () => {
    const savedProducts = JSON.parse(localStorage.getItem('saved'))

    axios.get(`https://thomasdubois.fr/back/wp-json/wc/v2/products?consumer_key=ck_051df3b7774a3d3dc4c40ecf9536bc20d2af3050&consumer_secret=cs_68c3b9d2d09bf4c9085146ed80740f0ac41800a7&per_page=50`)
    .then((response) => {
      this.setState({ products:response.data, savedProducts:savedProducts, loading: false })
      this.animateOrders()
    })
    .catch((error) => {
      alert(JSON.stringify(error))
    })

  }

  animateOrders = () => {
    let i = 0
    TweenMax.to('.bag-pay', 1, { opacity:1 }).delay(i+=0.5)
    document.querySelectorAll('.product').forEach( (p) => {
      TweenMax.to(p, 1, { opacity:1 }).delay(i+=0.5)
    })
    TweenMax.to('.line', 0.3, { width:'100%' }).delay(i)
  }

  roundPrice = (number, precision) => {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  redirection = (page, fromNavbar = false) => {

    if (fromNavbar === false) {
      this.goodbyeOrders()
      setTimeout( () => {
        this.setState({ redirection:page })
      }, 2000);
    }else {
      this.setState({ redirection:page })
    }

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

          {(this.state.loading === false && this.state.connected === true) && (
            <div className="bag-products">
              {products}
            </div>
          )}

          {(this.state.connected === false) && (
            <div className="order-connexion">
              <div className="title">
                <h1>Connexion</h1>
                <div className="line"></div>
              </div>
              {(this.state.connectionError === true) && (
                <div className="presentation">
                  <h3>Erreur de connexion</h3>
                </div>
              )}
              <div className="informations">
                  <form
                    onSubmit={(e) => this.connect(e)}
                  >

                    <input
                      required
                      type="text"
                      placeholder="Numéro de carte"
                      name="token"
                      ref={input => this.token = input}
                      value={this.state.token}
                      onChange={() => this.setState({token:this.token.value})}
                    />

                    <input
                      required
                      type="password"
                      placeholder="Mot de passe"
                      name="password"
                      ref={input => this.password = input}
                      value={this.state.password}
                      onChange={() => this.setState({password:this.password.value})}
                    />

                    <button type="submit">
                      Connexion
                    </button>

                  </form>
              </div>
            </div>
          )}

          {(this.state.loading === false && this.state.connected === true) && (
            <div className="bag-pay">
              <div className="title">
                <h1>Total : {this.roundPrice(totalPrice,1)}0 €</h1>
                <div className="line"></div>
              </div>
              <div className="presentation">
                <h3>Etat : en cours de validation</h3>
                <h3>Livraison prévue le : 13 février 2018</h3>
              </div>
            </div>
          )}


        </Container>
      )
    }
  }
}

export default Orders;
