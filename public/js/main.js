'use strict';

$(document).ready(() => {
  $('body').removeClass('none');
})

var app = angular.module('app', []);

app.controller('ctrl', ['$scope', '$rootScope', '$interval', '$timeout', 'backend', 'animate', 'data', 'task', function($scope, $rootScope, $interval, $timeout, backend, animate, data, task){

  //sign up page
  $scope.submitBtnText = '';
  $scope.signUpButton = (page) => {
    if(page === 'onLandingPage'){
      animate.toSignFormPage('signup');
      $scope.submitBtnText = 'sign up';
    } else {
      $('.signFormMessage').fadeOut();
      $scope.submitBtnText = 'sign up';
      $rootScope.currentSignPage = 'signup';
      $rootScope.signUp = "signOption";
      $rootScope.signIn = "";
    }
  }
  $scope.signInButton = (page) => {
    if(page === 'onLandingPage'){
      animate.toSignFormPage('signin');
      $scope.submitBtnText = 'sign in';
    } else {
      $('.signFormMessage').fadeOut();
      $scope.submitBtnText = 'sign in';
      $rootScope.currentSignPage = "signin";
      $rootScope.signUp = "";
      $rootScope.signIn = "signOption";
    }
  }
  $scope.signUpSubmit = () => {
    const firstname = $('.signUpFirstname').val();
    const lastname = $('.signUpLastname').val();
    const username = $('.signUpUsername').val();
    const password = $('.signUpPassword').val();
    const confirmPassword = $('.signUpConfirmPassword').val();
    const url = "/register";
    const signUpObj = { firstname: firstname, lastname: lastname, username: username, password: password }

    const hasEmptyField = task.hasEmptyFieldCheck(signUpObj);
    const passwordDontMatch = (password != confirmPassword);

    if(passwordDontMatch){
      $(".signFormMessage p").text("Please confirm your passwords match. Thanks!");
      $('.signFormMessage').fadeIn();
    } else if(hasEmptyField){
      $(".signFormMessage p").text("Please fill in all fields. Thanks!");
      $('.signFormMessage').fadeIn();
    } else {
      backend.register(signUpObj, url);
    }
  }
  $scope.signInSubmit = () => {
    const username = $('.signInUsername').val();
    const password = $('.signInPassword').val();
    const url = "/login";
    const signInObj = { username: username, password: password }

    const hasEmptyField = task.hasEmptyFieldCheck(signInObj);

    if(hasEmptyField){
      $(".signFormMessage p").text("Please fill in all fields. Thanks!");
      $('.signFormMessage').fadeIn();
      return null;
    }

    backend.loginRequest(signInObj, url);

    const checkForLogIn = $interval(function () {
      if($rootScope.successfullyLoggedIn != true){ return null }
      $interval.cancel(checkForLogIn);
      $rootScope.successfullyLoggedIn = false;
      $rootScope.pageProducts = data.setPageProducts(1);
      animate.homeNav(1);
      $timeout(() => {
        //navigation highlight
        $(".navOptions").removeClass("navHighlight");
        $(".navOptions[data=" + 1 + "]").addClass("navHighlight");
      }, 1000);
    }, 10);
  }

  $scope.mainPageIndexes = [1, 2, 3, 4, 5, "loading"];
  $scope.productPageIndexes = [1, 2];
  $scope.navOptions = ['HOME', 'SEW & SO', 'LESSONS', 'CHECKOUT'];
  $scope.filters = data.filters;

  $scope.logIn = (pageIndex) => {
    $rootScope.currentCompany = (pageIndex === 1) ? $rootScope.firstCompany : $rootScope.secondCompany;
    $rootScope.pageProducts = data.setPageProducts(pageIndex);
    animate.homeNav(pageIndex);
    $timeout(() => {
      //navigation highlight
      $(".navOptions").removeClass("navHighlight");
      $(".navOptions[data=" + pageIndex + "]").addClass("navHighlight");
    }, 1000);
  }
  $scope.navigate = (e) => {
    const pageIndex = parseInt(e.currentTarget.attributes.data.nodeValue);
    const isOnClickedPage = pageIndex == $rootScope.currentPage;
    if(!isOnClickedPage){
      if($rootScope.loadingPage === true){ return null }
      $rootScope.loadingPage = true;
      $timeout(() => { $rootScope.loadingPage = false; }, 1600)

      if(pageIndex === 0){
        animate.homeNav(pageIndex);
        $('.movingBoxText').text($scope.navOptions[1]);
        $rootScope.isIntervalInProgress = false;
        $rootScope.onHomePage = true;
      } else if (pageIndex === 1) {
        animate.slider(pageIndex);
        $rootScope.currentCompany = $rootScope.firstCompany;
        $timeout(() => {
          $rootScope.pageProducts = data.setPageProducts(pageIndex);
        })
      } else if (pageIndex === 2) {
        animate.slider(pageIndex);
        $rootScope.currentCompany = $rootScope.secondCompany;
        $timeout(() => {
          $rootScope.pageProducts = data.setPageProducts(pageIndex);
        })
      } else if (pageIndex === 5) {
        $rootScope.currentCompany = 'sewAndSewColors';
        animate.slider(pageIndex);
        $('.cartItemsHolder').css('maxHeight', '45em');
      } else {
        animate.slider(pageIndex);
        $('.cartItemsHolder').css('maxHeight', '45em');
      }
    }
  }

  //product animations
  $rootScope.largeView = false;
  $rootScope.itemsOpen = false;
  $scope.toggleView = () => {
    $rootScope.largeView = !$rootScope.largeView;
    task.toggleView();
  }
  $scope.showProductOptions = (data) => {
    task.showProductOptions(data);
  }
  $scope.hideProductOptions = (data) => {
    task.hideProductOptions(data);
  }

  //add to cart
  $rootScope.clickTracker = 0;
  $rootScope.addedTrackers = [];
  $scope.addItemToCart = (data, product) => {
    animate.addItemToCart(data, product);
  }

  //close view options
  $scope.eventObj = {};
  $scope.currentCloseView = '';
  $scope.smallViewImgOne = '';
  $scope.smallViewImgTwo = '';
  $scope.smallViewImgThree = '';
  $scope.changeCloseViewItem = (item) => {
    $scope.currentCloseView = $scope[item];
    $scope.eventObj["currentlySelectedImg"] = $scope[item];
  }

  $scope.closeView = (product, e, index) => {
    $scope.currentCloseView = product.img;
    $scope.smallViewImgOne = product.imgSlideShow[0];
    $scope.smallViewImgTwo = product.imgSlideShow[1];
    $scope.smallViewImgThree = product.imgSlideShow[2];
    const nodeValue = e.currentTarget.attributes[0].nodeValue;
    $scope.eventObj["nodeValue"] = nodeValue;
    $scope.eventObj["indexValue"] = index;
    $scope.eventObj["currentlySelectedImg"] = product.imgSlideShow[0];
    $(".shoppingCartBigView").fadeIn();
  }

  //custome button
  $scope.customMouseOver = () => {
    $('.imgHolder p').css('opacity', 1);
    $('.customizeDirector').css('opacity', 1);
  }
  $scope.customMouseLeave = () => {
    $('.imgHolder p').css('opacity', 0);
  }



  //check out
  $scope.proceedToCheckout = () => {
    const cartFullname = $(".cartFullname").val();
    const cartAddress = $(".cartAddress").val();
    const cartCity = $(".cartCity").val();
    const cartState = $(".cartState").val();
    const cartZipcode = $(".cartZipcode").val();
    const cartEmailAdress = $(".cartEmailAdress").val();

    const checkoutObj = {
      cartFullname: cartFullname,
      cartAddress: cartAddress,
      cartCity: cartCity,
      cartState: cartState,
      cartZipcode: cartZipcode,
      cartEmailAdress: cartEmailAdress,
    }

    const hasEmptyFields = task.hasEmptyFieldCheck(checkoutObj);

    if (data.cartItems.length === 0) {
      $(".checkoutFormMessage p").text("There are no items in your cart");
      $('.checkoutFormMessage').fadeIn();
      $timeout(() => { $('.checkoutFormMessage').fadeOut(); }, 5000);
    } else if(hasEmptyFields){
      $(".checkoutFormMessage p").text("Please fill in all fields. Thanks!");
      $('.checkoutFormMessage').fadeIn();
      $timeout(() => { $('.checkoutFormMessage').fadeOut(); }, 5000);
    } else {
      animate.creditCardSlider("shoppingCart");
    }
  }
  $scope.backFromShoppingCart = () => {
    animate.creditCardSlider(5);
  }

  $rootScope.signUp = "";
  $rootScope.signIn = "";
  $rootScope.loadingPage = false;
  $rootScope.onHomePage = true;

  $rootScope.currentCompany = 'sewAndSewColors';
  $rootScope.colors = {
    sewAndSewColors: {
      themeColor: '#ed7d7d',
      borderThemeColor: '#fce9e9',
      landingPageBtnColor: '#ea6262',
      landingPageBtnHoverColor: '#430909',
      customIcon: './images/sewing.png'
    },
    landingPage: {
      themeColorOne: '#ed7d7d',
      themeColorTwo: '#5b94ef'
    }
  }
  $rootScope.firstCompany = Object.keys($rootScope.colors)[0];

  $rootScope.sew_products;
  $rootScope.pageProducts;
  $rootScope.currentPage = 0;
  $rootScope.currentSignPage = '';
  $rootScope.for1sec = false;
  $rootScope.navOptions = data.navOptions;
  $rootScope.successfullyLoggedIn = false;
  $rootScope.pauseChartAddition = false;
  $rootScope.sew_products;

  //shopping cart items
  $rootScope.individualItemsInShoppingCart = [];
  $rootScope.shoppingCartItems = [];
  $rootScope.cartIndex = 0;
  $scope.incrementCartItem = (item) => {
    task.increment(item);
  }
  $scope.decrementCartItem = (item) => {
    task.decrement(item);
  }
  $scope.removeItemFromShoppingCart = (item) => {
    task.removeItemFromShoppingCart(item);
  }
  $rootScope.checkoutItemsTotal;


  $scope.showOptions = (e) => {
    const id = parseInt(e.currentTarget.id);
    $rootScope.currentItem = id;
    $('.itemPreview[id='+ id + ']').hide();
    $('.options[id='+ id + ']').css('left', 0);
    $('.options .itemDesciption').animate({ top: '60%' }, { duration: 100, complete: function(){
      $rootScope.doneShowingOptions = true;
    }});
  }
  $scope.hideOptions = (e) => {
    const id = parseInt(e.currentTarget.id);
    const complete = () => {
      $('.options[id='+ id + ']').css('left', '100vw');
      $('.itemPreview[id='+ id + ']').show();
    }
    const animation = { top: '100%' };
    const options = { duration: 100, complete };
    $('.options .itemDesciption').animate(animation, options);
  }
  //need to be reviewed


  $scope.checkboxClick = (e, index) => {
    const attributes = e.currentTarget.attributes;
    const values = [];
    for(let i = 0; i < attributes.length; i++){ values.push(attributes[i].nodeName) }
    const isSizeCheckbox = values.includes('data-size');
    const isCategoryCheckbox = values.includes('data-category');
    const isChecked = attributes[1].nodeValue.includes('checkBoxChecked');
    if(isSizeCheckbox){
      if(isChecked){ $('.checkBox[data-size = ' + index + ']').removeClass('checkBoxChecked') }
      else{ $('.checkBox[data-size = ' + index + ']').addClass('checkBoxChecked') }
    }
    else if (isCategoryCheckbox) {
      if(isChecked){ $('.checkBox[data-category = ' + index + ']').removeClass('checkBoxChecked') }
      else{ $('.checkBox[data-category = ' + index + ']').addClass('checkBoxChecked') }
    }
  }
  $scope.colorClick = (e, index) => {
    const attributes = e.currentTarget.attributes;
    const $target = $('.colorCircle[data-color = ' + index + ']');
    const isChecked = $target.hasClass('colorCircleSelected');
    if(isChecked){ $target.removeClass('colorCircleSelected') }
    else{ $target.addClass('colorCircleSelected') }
  }

  $scope.hideBigView = () => {
    $('.shoppingCartBigView').hide();
    $('.customizeDirector').css('opacity', 1);
  }

  $rootScope.isIntervalInProgress = false;

  $rootScope.viewSlideShow = [];
  $rootScope.currentSlideImg;
  $rootScope.currentSlideImgNumber = 0;
  $rootScope.cartQuantity = data.getCartLength();
  $rootScope.clickIt = true;
  $rootScope.trackItems = 0;
  $rootScope.currentItem;

  //add ids to the cart items => brittanys id start with 1000, brandis 2000, so on
  $rootScope.sew_products = task.assignIDs(sew_products);

  task.init();
  animate.customButton();
  task.checkoutItemsTotal();
}]);

app.service("backend", function($http, $rootScope, $interval, $timeout, task, data, animate){
  this.loginRequest = (signInObj, url) => {
    $http({
      method: 'POST',
      url: url,
      data: JSON.stringify(signInObj),
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = (success) => {
      console.log("successfully logged in");
      animate.hideSignIngPage();
      //set profile information
      this.setUserInfo(success)
      $rootScope.successfullyLoggedIn = true;
    }

    const errorCallback = () => {
      console.log("error logging in");
      $(".signFormMessage p").text("Username or Password incorrect");
      $('.signFormMessage').fadeIn();
    }
  };
  this.register = (signUpObj, url) => {
    $http({
      method: 'POST',
      url: url,
      data: JSON.stringify(signUpObj),
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = (success) => {
      console.log("successfully registered");

      $(".signFormMessage p").text("Thanks For Registering! Try Signing in");
      $('.signFormMessage').fadeIn();

      $rootScope.currentSignPage = "signin";
      $rootScope.signUp = "";
      $rootScope.signIn = "signOption";
    }

    const errorCallback = () => {
      console.log("error registering");
      $(".signFormMessage p").text("Username taken. sorry...");
      $('.signFormMessage').fadeIn();
    }
  }
  this.deleteacc = (id, url) => {

    const data = {
      id: id
    }

    $http({
      method: 'DELETE',
      url: url,
      data: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = (success) => {
      console.log('account deleted');
    }

    const errorCallback = () => {
      console.log('error deleting account');
    }
  }
  this.email = (name, email, subject, message, url) => {
    let sendMessage = "";
    sendMessage += '<style> div { color: #eee;background-color: #333;font-family: "Barlow Semi Condensed", sans-serif;padding: 1em;margin: 0 auto;width: 20em; } p { font-size: 1.2em; } </style>';
    sendMessage += "<div>";
    sendMessage += "<p>name: <span>" + name + "</span></p>";
    sendMessage += "<p>contact: <span>" + email + "</span></p>";
    sendMessage += "<p>subject: <span>" + subject + "</span></p>";
    sendMessage += "<p>message: </p>";
    sendMessage += "<p>" + message + " </p>";
    sendMessage += "</div>";

    const data = {
      name: name,
      email: 'letsbuildyourwebsite@outlook.com',
      subject: subject,
      message: sendMessage
    }

    $http({
      method: 'POST',
      url: url,
      data: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = () => {
      console.log('email sent');
    }

    const errorCallback = (err) => {
      console.log(err);
    }
  }
  this.sendtext = (userName, userNumber, userMessage, url) => {
    const sendMessage = 'contact: ' + userNumber + ' message: ' + userMessage;

    const data = {
      userName: userName,
      userNumber: '8147530157',
      userMessage: sendMessage,
    }

    $http({
      method: 'POST',
      url: url,
      data: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = () => {
      console.log('text sent');
    }

    const errorCallback = (err) => {
      console.log(err);
    }
  }
  this.setUserInfo = (userObj) => {
    $rootScope.user_firstname = userObj.data.firstname;
    $rootScope.user_lastname = userObj.data.lastname;
    $rootScope.user_name = userObj.data.username;
    $rootScope._id = userObj.data._id;
  };
});

app.service('animate', function($rootScope, $timeout, $interval, data, task){
  this.homeNav = (pageIndex) => {
    $rootScope.currentPage = pageIndex;
    const notGoingToHomePage = (pageIndex != 0);
    if(notGoingToHomePage){
      task.init();
      this.navigationBar();
      this.customButton();
    } else {
      $rootScope.currentCompany = 'sewAndSewColors';
    }
  }
  this.slider = (pageIndex) => {
    $rootScope.pageProducts = "";
    $rootScope.currentPage = pageIndex;
    this.customButton();
    $timeout(() => {
      task.populateImgsOnPage();
      //navigation highlight
      $(".navOptions").removeClass("navHighlight");
      $(".navOptions[data=" + pageIndex + "]").addClass("navHighlight");
    }, 10)
  }
  this.creditCardSlider = (pageIndex) => {
    $timeout(() => {
      $rootScope.currentPage = pageIndex;
    }, 800).then(() => {
      $timeout(() => {
        const allInputs = $('input');
        const cardInfoSelector = $('input[aria-placeholder="Card number"]');
        const dateSelector = $('input[aria-placeholder="MM / YY"]');
        const cvcSelector = $('input[aria-placeholder="CVC"]');
      }, 1000);
    });
  }
  this.navigationBar = () => {
    $timeout(() => {
      $('.navigationBar').on('mouseover', () => {
        $('.navigationBar p').css('marginBottom', '1em');
      })
      $('.navigationBar').on('mouseleave', () => {
        $('.navigationBar p').css('marginBottom', '0.5em');
      })
    })
  }

  this.toSignFormPage = (page) => {
    $rootScope.currentCompany = 'sewAndSewColors';
    $rootScope.themeColor = 'rgb(237, 125, 125)';
    const signup = () => {
      $rootScope.currentSignPage = 'signup';
      $rootScope.signUp = "signOption";
      $rootScope.signIn = "";
    }
    const signin = () => {
      $rootScope.currentSignPage = 'signin';
      $rootScope.signUp = "";
      $rootScope.signIn = "signOption";
    }
    (page === 'signup') ? signup() : signin();
    $('.signUpPage').css('left', '60%');

    $timeout(() => {
      $rootScope.for1sec = true;
    }, 500);
  }
  this.hideSignIngPage = () => {
    $('.signUpPage').css('left', '100%');
    $rootScope.currentSignPage = 'signin';
    $rootScope.for1sec = false;
  }
  //animate the item to the shopping cart
  this.addItemToCart = (data, product) => {
    $rootScope.clickTracker++;
    const tracker = $rootScope.clickTracker + product.img;
    const $productContainer = $('.productContainer[data="' + data + '"]');

    //find target position
    const cartPostion = $('.cartItemHeading img').position();
    const height = '1.6em';
    const width = '1.2em';

    //add clone img to page
    let movingImg = '';
    movingImg += '<div class="cartImgHolder movingImg">';
    movingImg += '<img src="' + product.img + '">';
    movingImg += '</div>';
    $('html').append(movingImg);

    const selfPosition = $productContainer.offset();
    //position clone img
    const $clone = $('.movingImg');
    $clone.css('position', 'absolute')
          .css('top', selfPosition.top)
          .css('left', selfPosition.left);

    //if the shopping cart drop needs adjustments chang the dx and dy
    const dx = 58;
    const dy = 120;

    const left = cartPostion.left + dx;
    const top = cartPostion.top + dy;
    const inBag = top + 20;

    const animation = { left: left, top: top, height: height, width: width }
    const animation2 = { top: inBag, opacity: 0 }
    const options2  = { complete: function(){
      const item = { name: product.name, img: product.img, price: product.price}
      task.addToShoppingCart(item, tracker);
    }}
    const complete = () => {
      $clone.css('zIndex', -1);
      $clone.animate(animation2, options2)
    }
    const options = { duration: 1000, complete }
    $clone.animate(animation, options);
  }
  this.customButton = () => {
    $('.point').show();
    let count = 0;
    let position = '-4em';
    const pointCustom = $interval(() => {
      if(count === 20){
        $interval.cancel(pointCustom);
        $('.point').fadeOut();
      } else {
        $('.point').css('top', position);
        if(position === '-4em'){ position = '-3em'; }
        else { position = '-4em'; }
        count++;
      }
    }, 500);
    // $timeout(() => {
    //   const animation = { top: '10%', left: '90%', height: '2em' };
    //   const complete = () => {
    //     $('.pageBody').animate({ opacity: 1 });
    //     $('.imgHolder').css('width', '12em');
    //   };
    //   const options = { duration: 1000, complete }
    //   $(".imgHolder").animate(animation, options);
    // }, 1000)
  }
});

app.service('data', function($rootScope, $interval, $timeout){
  this.setPageProducts = (pageIndex) => {
    let pageProducts =  $rootScope.sew_products;
    return pageProducts;
  }

  this.navOptions = ['HOME', 'DESIGNERS', 'CONTACT', 'CHECKOUT'],
  this.cartItems = [],
  this.getCartLength = () => {
    $interval(() => {
      $rootScope.cartQuantity = $rootScope.shoppingCartItems.length;
    })
  }
  this.filters = {
    categories: ['NEW ARRIVALS', 'SHOES', 'PURSES', 'BLANKETS'],
    colors: [
      { name: 'Light Red', hex: '#ed7d7d' },
      { name: 'Light Red', hex: '#ed7d7d' },
      { name: 'Light Red', hex: '#ed7d7d' },
      { name: 'Light Red', hex: '#ed7d7d' },
    ],
    sizes: ['XS', 'S', 'M', 'L']
  }
});

app.service('task', function($rootScope, $interval, $timeout, data){
  this.hasEmptyFieldCheck = (obj) => {
    const values = Object.values(obj);
    const hasEmptyField = values.includes("") || values.includes(undefined);
    return hasEmptyField;
  }
  this.assignIDs = (arr) => {
    const designer = arr[0]["designer"];
    if(designer === 1){
      arr.map((data, index) => { data["id"] = 1000 + index;})
    } else if(designer === 2){
      arr.map((data, index) => { data["id"] = 2000 + index; })
    }
    return arr;
  }
  this.decrement = (item) => {
    let arrayIndex;
    const index = this.findIndexInArrayByIndex(item.index, $rootScope.shoppingCartItems);
    $rootScope.shoppingCartItems[index].quantity--;
    if($rootScope.shoppingCartItems[index].quantity === 0){
      $rootScope.shoppingCartItems.splice(index, 1);
      $rootScope.individualItemsInShoppingCart.map((img, i) => {
        if(img === item.img){
          arrayIndex = i;
        }
      })
      $rootScope.individualItemsInShoppingCart.splice(arrayIndex, 1);
    }
  }
  this.increment = (item) => {
    const index = this.findIndexInArrayByIndex(item.index, $rootScope.shoppingCartItems);
    $rootScope.shoppingCartItems[index].quantity++;
  }
  this.findIndexInArrayByIndex = (index, parentArray) => {
    let foundIndex = 'not found';
    parentArray.map((item, i) => {
      if(item.index == index){
        foundIndex = i;
      }
    })
    return foundIndex;
  }
  this.addToShoppingCart = (item, tracker) => {
    //prevent unrequested multiple carts
    if($rootScope.addedTrackers.includes(tracker)){
      return null;
    }

    $rootScope.addedTrackers.push(tracker);
    const isInShoppingCart = $rootScope.individualItemsInShoppingCart.includes(item.img);
    if(isInShoppingCart){
      $rootScope.shoppingCartItems.map((shoppingCartItem) => {
        if(shoppingCartItem.img === item.img){
          shoppingCartItem.quantity++;
        }
      })
    } else {
      const img = item.img;
      const price = item.price;
      const name = item.name;
      const imgObj = { name: name, img: img, price: price, quantity: 1, index: $rootScope.cartIndex }
      $rootScope.cartIndex++;
      $rootScope.shoppingCartItems.push(imgObj);
      $rootScope.individualItemsInShoppingCart.push(img);
    }
  }
  this.removeItemFromShoppingCart = (item) => {
    let arrayIndex;
    const index = this.findIndexInArrayByIndex(item.index, $rootScope.shoppingCartItems);
    $rootScope.shoppingCartItems.splice(index, 1);
    $rootScope.individualItemsInShoppingCart.map((img, i) => {
      if(img === item.img){
        arrayIndex = i;
      }
    })
    $rootScope.individualItemsInShoppingCart.splice(arrayIndex, 1);
  }
  this.checkoutItemsTotal = () => {
    const calculateTotal = () => {
      let total = 0;
      $rootScope.shoppingCartItems.map((item) => {
        const price = item.price.substring(1, item.price.length);
        total += (parseInt(price) * parseInt(item.quantity));
      })
      $rootScope.checkoutItemsTotal = total;
    }
    $interval(() => {
      calculateTotal();
    })
  }
  this.init = () => {
    //hide the gallery view on load
    $('.shoppingCartBigView').hide();
    //fill the page with current company products
    this.populateImgsOnPage();
    //this animates the custom button when hovering over a product
    this.changeCustomizeOpacityAnimation();
    //hide the sign in message field if it is still showing on the sign in page
    $('.signFormMessage').hide();
  }
  this.changeCustomizeOpacityAnimation = () => {
    let opacity = true;
    $interval(() => {
      if(opacity){
        $('.customizeItems').css('opacity', '0.4');
        opacity = !opacity;
      } else {
        $('.customizeItems').css('opacity', '1');
        opacity = !opacity;
      }
    }, 1000);
  }
  this.populateImgsOnPage = () => {
    if(!$rootScope.pageProducts){ return null }
    const imgLength = $rootScope.pageProducts.length;
    const amountToFadeIn = 8;
    let index = 0;
    const imgFill = $interval(() => {
      if((index === imgLength) || (index === amountToFadeIn)){
        $('.itemImg').css('opacity', 1).hide().show().css('left', 0);
        $interval.cancel(imgFill);
      } else if (index < amountToFadeIn) {
        $('.itemImg[data=' + index + ']').css('opacity', 1).hide().fadeIn().css('left', 0);
        index++
      }
    }, 150);
  }
  this.toggleView = () => {
    const $productContainer = $('.productContainer');
    const firstItemIndex = 0;
    const secondItemIndex = 1;
    if(!$rootScope.itemsOpen){
      //hide all item accept the first two
      $('.itemSection').addClass('fixContent');
      $productContainer.map((index, item) => {
        if(index != firstItemIndex && index!= secondItemIndex){
          $('.productContainer[data="' + index + '"]').addClass('removeItem');
        }
      })
      $rootScope.itemsOpen = !$rootScope.itemsOpen;
      $('.productContainer').css('width', '36em');
      $('.productDescriptionHolder').css('left', 0);
      $timeout(() => {
        $('.productImgHolder').addClass('rotate90');
        $('.hoverDescription').addClass('rotate90');
      }, 300).then(() => {
        $timeout(() => {
          $('.itemSection').removeClass('fixContent');
          $('.productContainer').removeClass('removeItem');
          $('.cartImgHolder').css('zIndex', 1).removeClass('rotate90');
        }, 300);
      });
    } else {
      $('.cartImgHolder').addClass('rotate90');
      $('.itemSection').addClass('fixContent');
      $productContainer.map((index, item) => {
        if(index != firstItemIndex && index!= secondItemIndex){
          $('.productContainer[data="' + index + '"]').addClass('removeItem');
        }
      })
      $timeout(() => {
        $('.hoverButtons').hide();
        $('.cartImgHolder').css('zIndex', -1);
        $('.productImgHolder').removeClass('rotate90');
        $('.hoverDescription').removeClass('rotate90');
        $rootScope.itemsOpen = !$rootScope.itemsOpen;
        $('.productContainer').css('width', '18em');
        $('.productDescriptionHolder').css('left', '18em');
      }, 300).then(() => {
        $timeout(() => {
          $('.hoverButtons').show();
        }, 300).then(() => {
          $timeout(() => {
            $('.itemSection').removeClass('fixContent');
            $('.productContainer').removeClass('removeItem');
          }, 200);
        });
      });
    }
  }
  this.showProductOptions = (data) => {
    if(!$rootScope.itemsOpen){
      $('.hoverDescription[data="' + data + '"]').addClass('showDescripton');
      $('.hoverButtons[data="' + data + '"]').removeClass('behindImg');
      $('.hoverClearBox[data="' + data + '"]').removeClass('behindImg');
    }
  }
  this.hideProductOptions = (data) => {
    if(!$rootScope.itemsOpen){
      $('.hoverDescription[data="' + data + '"]').removeClass('showDescripton');
      $('.hoverButtons[data="' + data + '"]').addClass('behindImg');
      $('.hoverClearBox[data="' + data + '"]').addClass('behindImg');
    }
  }
});
