import React, { Component } from 'react'
import TweenMax from 'gsap'
import Container from '../general/Container'
import { Redirect } from 'react-router'
import axios from 'axios'
import Tilt from 'react-tilt'
import renderHTML from 'react-render-html'

class Products extends Component {

  state = {
    redirection:false,
    currentProduct:0,
    numberOfProducts:null,
    products:[],
    navbar:false,
    toBag:false,
    inBag:false
  }

  componentWillMount() {
    axios.get(`https://thomasdubois.fr/wp-json/wc/v2/products?consumer_key=ck_ba78c163da1ebcf239b62c6f243e25ee489379d3&consumer_secret=cs_b21c28aa1f27bc0183fbc3fd9c0398faf75aeef0&per_page=50`)
    .then((response) => {
      if (parseInt(this.props.match.params.id) > parseInt(Object.keys(response.data).length)) {
        this.setState({ currentProduct:0, products:response.data, numberOfProducts:parseInt(Object.keys(response.data).length) })
      }
      else {
        this.setState({ currentProduct:parseInt(this.props.match.params.id), products:response.data, numberOfProducts:parseInt(Object.keys(response.data).length) })
      }
      setTimeout( () => {
        this.newProduct()
      }, 10);
    })
    .catch((error) => {
      alert(JSON.stringify(error))
    })
    // localStorage.removeItem('saved')
  }

  newProduct = () => {
    window.addEventListener('keydown', this.handleKeyPress);
    this.props.history.push(`/produit/${this.state.currentProduct}`)
    TweenMax.to('.product-description', 1.5, { opacity:1 })
    TweenMax.to('.line', 0.2, { width:'100%' }).delay(0.7)
    TweenMax.to('.product-picture', 1, { opacity:1 }).delay(1)
    TweenMax.to('.slider-points', 1, { opacity:1 }).delay(1.4)
  }

  handleKeyPress = (event) => {
    if(event.key === 'ArrowUp' || event.key === 'ArrowLeft'){
      if(this.state.currentProduct > 0) {
        this.changeSlide('previous')
      }
    }else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      if(this.state.currentProduct < this.state.numberOfProducts) {
        this.changeSlide('next')
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress)
  }

  removeProduct = () => {
    window.removeEventListener('keydown', this.handleKeyPress)
    TweenMax.to('.line', 0.2, { width:0 })
    TweenMax.to('.product-description, .product-picture, .slider-points, .product-in-bag, .product-full-description, .product-bag', 1, { opacity:0 }).delay(0.3)
  }

  removeBag = () => {
    TweenMax.to('.line', 0.2, { width:0 })
    TweenMax.to('.product-full-description img', 1, { opacity:0 }).delay(0.3)
    TweenMax.to('.product-bag, .product-full-description', 1, { opacity:0 }).delay(1)
    setTimeout( () => {
      this.setState({ toBag:false })
    }, 2000);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentProduct !== this.state.currentProduct || prevState.toBag === true && this.state.toBag === false && this.state.inBag === false) {
      this.newProduct()
    }else if (prevState.toBag === false && this.state.toBag === true) {
      this.bagAnimation()
    }else if (prevState.inBag === false && this.state.inBag === true) {
      this.inBagAnimation()
    }
  }

  bagAnimation = () => {
    window.removeEventListener('keydown', this.handleKeyPress)
    TweenMax.to('.product-bag, .product-full-description', 1.5, { opacity:1 })
    TweenMax.to('.line', 0.2, { width:'100%' }).delay(1.3)
    TweenMax.to('.product-full-description img', 1, { opacity:1 }).delay(0.7)
  }

  toggleNavbar = state => {
    this.setState({ navbar:state })
  }

  changeSlide = (action) => {
    this.removeProduct()
    setTimeout( () => {
      if (action === 'next') {
        this.setState({ currentProduct:parseInt(this.state.currentProduct)+1 })
      }else if(action === 'previous') {
        this.setState({ currentProduct:parseInt(this.state.currentProduct)-1 })
      }else {
        this.setState({ currentProduct:action })
      }
    }, 1300);
  }

  redirection = (page, fromNavbar = false) => {

    if (fromNavbar === false) {
      this.removeProduct()
      setTimeout( () => {
        this.setState({ redirection:page })
      }, 2000);
    }else {
      this.setState({ redirection:page })
    }

  }

  addToBag = () => {
    this.removeProduct()
    setTimeout( () => {
      this.setState({ toBag:true })
    }, 1300);
  }

  endOfPersonalization = e => {
    e.preventDefault()

    const productID = this.state.products[Object.keys(this.state.products)[this.state.currentProduct]].id
    const newProduct = [productID]

    const savedProducts = JSON.parse(localStorage.getItem('saved'))

    if (savedProducts === null) {
      localStorage.setItem('saved', JSON.stringify(newProduct))
    }else {
      savedProducts.push(productID)
      localStorage.setItem('saved', JSON.stringify(savedProducts))
    }


    TweenMax.to('.product-bag', 1, { opacity:0 })
    setTimeout( () => {
      this.setState({ inBag:true })
    }, 1000)

  }

  inBagAnimation = () => {
    TweenMax.to('.product-in-bag', 1.5, { opacity:1 })
    TweenMax.to('.line', 0.2, { width:'100%' }).delay(1.3)
  }

  outOfBagAnimation = () => {
    TweenMax.to('.line', 0.2, { width:0 })
    TweenMax.to('.product-full-description img', 1, { opacity:0 }).delay(0.3)
    TweenMax.to('.product-in-bag, .product-full-description', 1, { opacity:0 }).delay(1)
  }

  continueShopping = () => {
    this.outOfBagAnimation()
    setTimeout( () => {
      this.setState({ toBag:false, inBag:false })
    }, 2000)
  }

  render() {

    if (this.state.redirection !== false) {
      return ( <Redirect to={`${this.state.redirection}`} /> )
    }else {

      let products = null

        products = Object
        .keys(this.state.products)
        .map(key => (parseInt(key) === parseInt(this.props.match.params.id)) ?
            <button className="active" onClick={() => this.changeSlide(key)} key={key}><span className="tooltip">{this.state.products[key].name}</span></button>
          :
            <button onClick={() => this.changeSlide(key)} key={key}><span className="tooltip">{this.state.products[key].name}</span></button>
        )

      return (
        <Container redirection={this.redirection} toggleNavbar={this.toggleNavbar}>

          <div className="bottom-links">
            <button onClick={() => this.redirection('/panier')}>Panier</button>
            <button onClick={() => this.redirection('/commandes')}>Mes commandes</button>
          </div>

          {(this.state.numberOfProducts === null) && (
            <div className="book">
              <div className="book__page"></div>
              <div className="book__page"></div>
              <div className="book__page"></div>
            </div>
          )}

          {(this.state.numberOfProducts !== null && this.state.currentProduct > 0 && this.state.navbar === false && this.state.toBag === false && this.state.inBag === false) && (
            <button onClick={() => this.changeSlide('previous')} className="link-left">
              <i className="ion-arrow-left-c"></i>
            </button>
          )}

          {(this.state.numberOfProducts !== null && this.state.toBag === false && this.state.inBag === false) && (
            <div className="slider-points">
              {products}
            </div>
          )}

          {(this.state.inBag === true) && (
            <div className="product-in-bag">
              <div className="title">
                <h1>Produit ajouté au panier !</h1>
                <div className="line"></div>
              </div>
              <div className="actions">
                <button className="success" onClick={() => this.redirection('/panier')}>
                  Voir mon panier
                </button>
                <button className="error" onClick={() => this.continueShopping()}>
                  Continuer mes achats
                </button>
              </div>
            </div>
          )}

          {(this.state.toBag === true && this.state.inBag === false) && (
            <div className="product-bag">
              <div className="title">
                <h1>Personnalisation du produit</h1>
                <div className="line"></div>
              </div>
              <div className="informations">
                <div className="text">
                  <p>Les visuels que vous sélectionnerez seront reproduits aux dimensions du produit, soit : {this.state.products[Object.keys(this.state.products)[this.state.currentProduct]].dimensions.width} cm de largeur sur {this.state.products[Object.keys(this.state.products)[this.state.currentProduct]].dimensions.height} cm de hauteur.</p>
                  <form
                    onSubmit={(e) => this.endOfPersonalization(e)}
                  >
                    <button type="submit" className="success">
                      <i className="ion-checkmark-round"></i>
                    </button>
                    <button type="button" className="error" onClick={() => this.removeBag()}>
                      <i className="ion-close-round"></i>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {(this.state.toBag === true || this.state.inBag === true) && (
            <div className="product-full-description">
              <img src={this.state.products[Object.keys(this.state.products)[this.state.currentProduct]].images[0].src} alt=""/>
              <div className="title">
                <h2>{this.state.products[Object.keys(this.state.products)[this.state.currentProduct]].name}</h2>
                <div className="line"></div>
              </div>
              <div className="presentation">
                <h3>Imprimé en France</h3>
              </div>
              <div className="informations">
                <div className="text">
                  <p>Prix : {this.state.products[Object.keys(this.state.products)[this.state.currentProduct]].price} €</p>
                  <p>Dimensions : {this.state.products[Object.keys(this.state.products)[this.state.currentProduct]].dimensions.width} x {this.state.products[Object.keys(this.state.products)[this.state.currentProduct]].dimensions.height} cm</p>
                </div>
              </div>
            </div>
          )}

          {(this.state.numberOfProducts !== null && this.state.toBag === false && this.state.inBag === false) && (
            <div className="product-description">
              <div className="title">
                <h1>{this.state.products[Object.keys(this.state.products)[this.state.currentProduct]].name}</h1>
                <div className="line"></div>
              </div>
              <div className="presentation">
                <h3>{this.state.products[Object.keys(this.state.products)[this.state.currentProduct]].dimensions.width} x {this.state.products[Object.keys(this.state.products)[this.state.currentProduct]].dimensions.height} cm</h3>
              </div>
              <div className="informations">
                <div className="text">
                  <p>{renderHTML(this.state.products[Object.keys(this.state.products)[this.state.currentProduct]].description)}</p>
                  <p>{this.state.products[Object.keys(this.state.products)[this.state.currentProduct]].price} €</p>
                  <button onClick={() => this.addToBag()}>
                    <i className="ion-bag"></i>
                  </button>
                </div>
              </div>
            </div>
          )}


          {(this.state.numberOfProducts !== null && this.state.toBag === false && this.state.inBag === false) && (
            <Tilt options={{ max : 10, perspective:1000 }} className="product-picture">
                <img src={this.state.products[Object.keys(this.state.products)[this.state.currentProduct]].images[0].src} alt=""/>
              </Tilt>
          )}

          {(this.state.numberOfProducts !== null && this.state.currentProduct < this.state.numberOfProducts-1 && this.state.navbar === false && this.state.toBag === false && this.state.inBag === false) && (
            <button onClick={() => this.changeSlide('next')} className="link-right">
              <i className="ion-arrow-right-c"></i>
            </button>
          )}

        </Container>
      )
    }
  }
}

export default Products;
