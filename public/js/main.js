'use strict';

var app = angular.module('app', []);

app.controller('ctrl', ['$scope', '$rootScope', '$interval', '$timeout', 'backend', 'animate', 'data', 'task', 'navigate', function($scope, $rootScope, $interval, $timeout, backend, animate, data, task, navigate){

// optimized processes


  $scope.themeColor;
  $scope.borderThemeColor;
  $scope.customIcon;
  $scope.pageProducts;
  $scope.mainPageIndexes = [1, 2, 3, 4, 5, "loading"];
  $scope.productPageIndexes = [1, 2];
  $scope.navOptions = ['HOME', 'BRITTANY', 'BRANDI', 'DESIGNERS', 'CONTACT', 'CHECKOUT'];
  $scope.filters = data.filters;
  $rootScope.signUp = "";
  $rootScope.signIn = "";
  $rootScope.landingPageBtnHoverColor = '#430909';
  $rootScope.landingPageBtnColor = '#ea6262';
  $rootScope.landingPageBtnBorderColor = '#e74b4b';
  $rootScope.themeColorOne = '#ed7d7d';
  $rootScope.themeColorTwo = '#5b94ef';
  $rootScope.loadingPage = false;

  $scope.logIn = (pageIndex) => {
    const themeColorObj = task.setThemeColor(pageIndex);
    $scope.customIcon = task.setCostIcon(pageIndex);
    $scope.themeColor = themeColorObj.themeColor;
    $scope.borderThemeColor = themeColorObj.borderThemeColor;
    $scope.pageProducts = data.setPageProducts(pageIndex);
    animate.homeSlider(pageIndex);
    $timeout(() => {
      //navigation highlight
      $(".navOptions").removeClass("navHighlight");
      $(".navOptions[data=" + pageIndex + "]").addClass("navHighlight");
    }, 1000);
  }
  $scope.navigate = (e) => {
    debugger
    if($rootScope.loadingPage === true){ return null }
    $rootScope.loadingPage = true;
    $timeout(() => { $rootScope.loadingPage = false; }, 2000)

    const pageIndex = parseInt(e.currentTarget.attributes.data.nodeValue);
    if(pageIndex != $rootScope.currentPage){
      if(pageIndex === 0){
        animate.homeSlider(pageIndex);
      } else if (pageIndex === 1) {
        animate.slider(pageIndex);
        //variables that change after the slider covers the screen
        $scope.themeColor =  $rootScope.redThemeColor;
        $scope.borderThemeColor = $rootScope.redBorderThemeColor;
        $scope.customIcon = "./images/sewing.png";
        $timeout(() => {
          $scope.pageProducts = data.setPageProducts(pageIndex);
        }, 600)
      } else if (pageIndex === 2) {
        animate.slider(pageIndex);
        //variables that change after the slider covers the screen
        $scope.themeColor = $rootScope.blueThemeColor;
        $scope.borderThemeColor = $rootScope.blueBorderThemeColor;
        $scope.customIcon = "./images/crochet.png";
        $timeout(() => {
          $scope.pageProducts = data.setPageProducts(pageIndex);
        }, 600)
      } else {
        animate.slider(pageIndex);
        $('.cartItemsHolder').css('maxHeight', '45em');
      }
    }
  }

  $scope.moveToCart = (e, index) => {
    $scope.inLargeView = false;
    $('.customizeDirector').css('opacity', 1);
    $rootScope.trackItems++;
    $rootScope.clickIt = false;
    const nodeValue = e.currentTarget.attributes[0].nodeValue;
    const selector = '.itemImage[data=' + nodeValue + ']';
    animate.itemToShoppingCart(selector, nodeValue, index);
  }
  $scope.removeFromCart = (index) => {
    $scope.cartItems.splice(index, 1);
    $scope.checkoutItems.splice(index, 1);
    $rootScope.trackItems--;
  }

  $scope.galleryLeftClick = () => {
    navigate.galleryLeftClick();
  }
  $scope.galleryRightClick = () => {
    navigate.galleryRightClick();
  }

  $scope.customMouseOver = () => {
    $('.imgHolder p').css('opacity', 1);
    $('.customizeDirector').css('opacity', 1);
  }
  $scope.customMouseLeave = () => {
    $('.imgHolder p').css('opacity', 0);
    if($scope.inLargeView){
        $('.customizeDirector').css('opacity', 0.4);
    }
  }




  $rootScope.blueThemeColor = "rgb(91, 148, 239)";
  $rootScope.blueBorderThemeColor = "rgb(232, 240, 253)";
  $rootScope.redThemeColor = "rgb(237, 125, 125)";
  $rootScope.redBorderThemeColor = "rgb(252, 233, 233)";
  $rootScope.customSewingIcon = "./images/sewing.png";
  $rootScope.customCrochetIcon = "./images/crochet.png";
  $rootScope.currentPage = 0;
  $rootScope.navOptions = data.navOptions;
  $rootScope.successfullyLoggedIn = false;













  $scope.inLargeView = false;
  $scope.cartItems = data.cartItems;
  $scope.checkoutItems = data.checkoutItems;
  $scope.checkoutItemsTotal;


  $scope.showOptions = (e) => {
    const id = parseInt(e.currentTarget.id);
    $rootScope.currentItem = id;
    $('.itemPreview[id='+ id + ']').hide();
    $('.options[id='+ id + ']').css('left', 0);
    $('.options .itemDesciption').animate({ top: '60%' }, 100);
  }
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
  $scope.hideOptions = (e) => {
    const id = parseInt(e.currentTarget.id);
    const complete = () => {
      $('.options[id='+ id + ']').css('left', '100vw');
      $('.itemPreview[id='+ id + ']').show();
    }
    const animation = { top: '100%' };
    const options = { duration: 0, complete };
    $('.options .itemDesciption').animate(animation, options);
  }
  $scope.showBigView = (e, index) => {
    $scope.inLargeView = true;
    $('.customizeDirector').css('opacity', 0.4);
    $rootScope.nodeValue = e.currentTarget.attributes[0].nodeValue;
    $rootScope.currentIndex = index;
    $rootScope.currentImgEvent = e;
    navigate.showBigView(true);
  }
  $scope.hideBigView = () => {
    $scope.inLargeView = false;
    $('.shoppingCartBigView').hide();
    $('.customizeDirector').css('opacity', 1);
  }



  $scope.signUpLandingPageBtn = () => {
    animate.toSignFormPage('signup');
  }
  $scope.signInLandingPageBtn = () => {
    animate.toSignFormPage('signin');
  }
  $scope.signUpButtonOption = () => {
    $rootScope.currentPage = "signup";
    $rootScope.signUp = "signOption";
    $rootScope.signIn = "";
  }
  $scope.signInButtonOption = () => {
    $rootScope.currentPage = "signin";
    $rootScope.signUp = "";
    $rootScope.signIn = "signOption";
  }
  $scope.signUpButton = () => {
    const firstname = $('.signUpFirstname').val();
    const lastname = $('.signUpLastname').val();
    const username = $('.signUpUsername').val();
    const password = $('.signUpPassword').val();
    const url = "/register";
    const signUpObj = { firstname: firstname, lastname: lastname, username: username, password: password }
    backend.register(signUpObj, url);
  }
  $scope.signInButton = () => {
    const username = $('.signInUsername').val();
    const password = $('.signInPassword').val();
    const url = "/login";
    const signInObj = { username: username, password: password }
    backend.loginRequest(signInObj, url);
    const checkForLogIn = $interval(function () {
      if($rootScope.successfullyLoggedIn != true){ return null }
      $interval.cancel(checkForLogIn);
      $rootScope.successfullyLoggedIn = false;
      const themeColorObj = task.setThemeColor(1);
      $scope.customIcon = task.setCostIcon(1);
      $scope.themeColor = themeColorObj.themeColor;
      $scope.borderThemeColor = themeColorObj.borderThemeColor;
      $scope.pageProducts = data.setPageProducts(1);
      animate.homeSlider(1);
      $timeout(() => {
        //navigation highlight
        $(".navOptions").removeClass("navHighlight");
        $(".navOptions[data=" + 1 + "]").addClass("navHighlight");
      }, 1000);
    }, 10);
  }
  $scope.backFromSignFormPage = () => {
    animate.backFromSignFormPage();
  }


  $rootScope.isIntervalInProgress = false;

  $rootScope.viewSlideShow = [];
  $rootScope.currentSlideImg;
  $rootScope.currentSlideImgNumber = 0;
  $rootScope.cartQuantity = data.getCartLength();
  $rootScope.clickIt = true;
  $rootScope.trackItems = 0;
  $rootScope.currentImgEvent;
  $rootScope.currentItem;
  $rootScope.landingPageAnimationInterval;

  task.init($scope.themeColor);
  animate.landingPage();
  animate.customButton();
  $interval(() => { $scope.checkoutItemsTotal = data.calculateTotal() });

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
      //set profile information
      this.setUserInfo(success)
      $rootScope.successfullyLoggedIn = true;
    }

    const errorCallback = () => {
      console.log("error logging in");
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

      $('.signFormMessage').fadeIn();

      $rootScope.currentPage = "signin";
      $rootScope.signUp = "";
      $rootScope.signIn = "signOption";
    }

    const errorCallback = () => {
      console.log("error registering");
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
  this.homeSlider = (pageIndex) => {
    //animate slide transition
    $('.homeNavSlider').addClass('transitionLeft').css('left', '0%');
    $timeout(() => {
      //after slide has covered the page..
      $rootScope.currentPage = pageIndex;
      if(pageIndex != 0){
        task.init();
        this.customButton();
      }
      //finish sliding transition
      $('.homeNavSlider').css('left', '-100%');
      $timeout(() => { $('.homeNavSlider').removeClass('transitionLeft').css('left', '100%'); }, 800);
    }, 800);
  }
  this.slider = (pageIndex) => {
    let animationNumber = 1;
    const $navSlider = $(".navSlider");
    const animation1 = { left: '0%' };
    const animation2 = { left: '-100%' };

    const start = () => {
      if(animationNumber === 1){
        $rootScope.currentPage = "loading";
        //reset navigation highlight
        $(".navOptions").removeClass("navHighlight");
      } else if (animationNumber === 2) {
        $rootScope.currentPage = pageIndex;
        //navigation highlight
        $(".navOptions[data=" + pageIndex + "]").addClass("navHighlight");
        this.customButton();
      }
    };
    const complete = () => {
      if(animationNumber === 1){
        $navSlider.animate(animation2, options2);
        animationNumber = 2;
      } else if (animationNumber === 2) {
        task.populateImgsOnPage();
        $navSlider.css('left', '100%');
      }
    };

    const options = { duration: 500, start, complete }
    const options2 = { duration: 500, start, complete };

    $navSlider.animate(animation1, options);
  }






  this.toSignFormPage = (page) => {
    $rootScope.themeColor = 'rgb(237, 125, 125)';
    $('.homeNavSlider').addClass('transitionLeft').css('left', '0%');
    const signup = () => {
      $rootScope.currentPage = 'signup';
      $rootScope.currentPage = "signup";
      $rootScope.signUp = "signOption";
      $rootScope.signIn = "";
    }
    const signin = () => {
      $rootScope.currentPage = 'signin';
      $rootScope.currentPage = "signin";
      $rootScope.signUp = "";
      $rootScope.signIn = "signOption";
    }
    $timeout(() => {
      (page === 'signup') ? signup() : signin();
      $('.homeNavSlider').css('left', '-100%');
      $timeout(() => { $('.homeNavSlider').removeClass('transitionLeft').css('left', '100%'); }, 800);
    }, 800);
  }
  this.backFromSignFormPage = () => {
    $('.homeNavSlider').addClass('transitionLeft').css('left', '0%');
    $timeout(() => {
      $rootScope.currentPage = 0;
      $rootScope.landingPageBtnHoverColor = '#430909';
      $rootScope.landingPageBtnColor = '#ea6262';
      $('.homeNavSlider').css('left', '-100%');
      $timeout(() => { $('.homeNavSlider').removeClass('transitionLeft').css('left', '100%'); }, 800);
    }, 800);
  }
  //animate the item to the shopping cart
  this.itemToShoppingCart = (selector, nodeValue, index) => {
    $('.shoppingCartBigView').hide();
    $('.options').css('left', '100vw');
    $timeout(() => {
      $('.itemPreview').show();
      $('body').append('<div data=\'' + nodeValue + 'clone\' class="itemImage" ng-click=\'moveToCart($event)\'></div>')
      const $selector = $(selector);
      const $clone = $('.itemImage[data=' + nodeValue + 'clone]');
      //find target position
      const cartPostion = $('.cartItemHeading img').position();

      const height = '1.6em';
      const width = '1.2em';

      //if the shopping cart drop needs adjustments chang the dx and dy
      const dx = 94;
      const dy = 120;

      const left = cartPostion.left + dx;
      const top = cartPostion.top + dy;

      const inBag = top + 20;

      const selfPosition = $selector.position();

      $clone.css('position', 'absolute')
            .css('top', selfPosition.top)
            .css('left', selfPosition.left)
            .css('height', '27.4em')
            .addClass('fullBackground')
            .css('backgroundImage', 'url(' + data.products[nodeValue].img + ')');

      const animation = { left: left, top: top, height: height, width: width }
      const animation2 = { top: inBag, opacity: 0 }
      const complete = () => {
        $clone.css('zIndex', -1);
        $clone.animate(animation2)

        const selectedItem = data.products[index];

        //timeout updates the DOM
        $timeout(() => {
          $rootScope.clickIt = true;
          $rootScope.clickable = null;
          if($rootScope.trackItems > data.cartItems.length){
            data.cartItems.splice(0, 0, selectedItem);
            data.checkoutItems.splice(0, 0, selectedItem);
          }
        }, 10);
      }
      const options = { duration: 1000, complete }
      $clone.animate(animation, options);
    }, 50);
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
  this.landingPage = () => {
    const animationDuration = 500;
    const intervalDuration = 4500;
    $rootScope.landingPageAnimationInterval = $interval(() => {

      //check to see if the interval has finished completing before starting another one
      if($rootScope.isIntervalInProgress){ return false }
      $rootScope.isIntervalInProgress = true;

      const initialFirstPageColor = 'rgb(237, 125, 125)';
      const initialSecondPageColor = 'rgb(91, 148, 239)';
      const initialThirdPageColor = 'rgb(153, 153, 153)';
      const currentPageColor = $('.landingPageColorOne').css('backgroundColor');
      const animation = { left: '0%' };
      let switchedColor;
      let currentColor;
      let number;

      //animation start function
      const start = () => {
        if(currentColor === 'firstColor'){
          $rootScope.landingPageBtnHoverColor = '#0b3474';
          $rootScope.landingPageBtnColor = '#4585ed';
          // $rootScope.landingPageBtnBorderColor = '#4485ee';
        } else if(currentColor === 'secondColor'){
          $rootScope.landingPageBtnHoverColor = '#444';
          $rootScope.landingPageBtnColor = '#777';
          // $rootScope.landingPageBtnBorderColor = '#e74b4b';
        } else if(currentColor === 'thirdColor'){
          $rootScope.landingPageBtnHoverColor = '#430909';
          $rootScope.landingPageBtnColor = '#ea6262';
          // $rootScope.landingPageBtnBorderColor = '#e74b4b';
        }
      }

      //animation complete function
      const complete = () => {
        if(number != 3){ $('.homeImg img').fadeIn(500).attr('src', './images/model' + number + '.png'); }
        if(currentColor === 'firstColor'){ $('.landingPageColorOne').css('backgroundColor', initialSecondPageColor); }
        else if(currentColor === 'secondColor'){ $('.landingPageColorOne').css('backgroundColor', initialThirdPageColor); }
        else if(currentColor === 'thirdColor'){ $('.landingPageColorOne').css('backgroundColor', initialFirstPageColor); }
        $('.landingPageColorTwo').css('left', '100%').css('backgroundColor', switchedColor);
        $rootScope.isIntervalInProgress = false;
        // if(currentColor != 'secondColor'){ $rootScope.isIntervalInProgress = false; }
      }

      //animation options function
      const options = { duration: animationDuration, start: start, complete: complete };

      //start the animation
      const startAnimation = (color, imgNumber) => {
        currentColor = color;
        number = imgNumber;
        if(color === 'firstColor'){ switchedColor = initialThirdPageColor; }
        else if(color === 'secondColor'){ switchedColor = initialFirstPageColor; }
        else if(color === 'thirdColor'){ switchedColor = initialSecondPageColor; }
        $('.homeImg img').fadeOut(400);
        $('.landingPageColorTwo').animate(animation, options);
      }

      //start the animation
      if(currentPageColor === initialFirstPageColor){ startAnimation('firstColor', 2); }
      else if(currentPageColor === initialSecondPageColor){ startAnimation('secondColor', 3); }
      else if(currentPageColor === initialThirdPageColor){ startAnimation('thirdColor', 1); }

    }, intervalDuration)
  }
});

app.service('data', function($rootScope, $interval, $timeout){
  this.setPageProducts = (pageIndex) => {
    let pageProducts = (pageIndex === 1) ? sew_products : crochet_products;
    return pageProducts;
  }



  this.navOptions = ['HOME', 'DESIGNERS', 'CONTACT', 'CHECKOUT'],
  this.cartItems = [],
  this.checkoutItems = [],
  this.products = sew_products;           // this comes from database.js
  this.getCartLength = () => {
    $interval(() => {
      $rootScope.cartQuantity = this.cartItems.length;
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
  this.calculateTotal = () => {
    if(this.checkoutItems.length > 0){
      let total = 0;
      this.checkoutItems.map((data) => {
        const sliceString = data.price.slice(1);
        const toInt = parseInt(sliceString)
        total += toInt;
      })
      return total;
    } else {
      return 0;
    }
  }
});

app.service('task', function($rootScope, $interval, $timeout, data){
  this.setThemeColor = (pageIndex) => {
    let themeColorObj = {};
    if(pageIndex === 1){
      themeColorObj.themeColor = $rootScope.redThemeColor;
      themeColorObj.borderThemeColor = $rootScope.redBorderThemeColor;
    } else if(pageIndex === 2){
      themeColorObj.themeColor = $rootScope.blueThemeColor;
      themeColorObj.borderThemeColor = $rootScope.blueBorderThemeColor;
    }
    return themeColorObj;
  }
  this.setCostIcon = (pageIndex) => {
    let customIcon;
    if(pageIndex === 1){ customIcon = "./images/sewing.png"; }
    else if(pageIndex === 2){ customIcon = "./images/crochet.png"; }
    return customIcon;
  }


  this.init = (themeColor) => {
    $('.shoppingCartBigView').hide();
    this.populateImgsOnPage();
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
    $('.signFormMessage').hide();
    // $timeout(() => { $('.navOptions[data=1]').css('color', themeColor) });
  }
  this.populateImgsOnPage = () => {
    const imgLength = data.products.length;
    let index = 0;
    const imgFill = $interval(() => {
      if(index === imgLength){
        $interval.cancel(imgFill);
      } else {
        $('.itemImg[data=' + index + ']').css('opacity', 1).hide().fadeIn().css('left', 0);
        index++
      }
    }, 200);
  }

});

app.service('navigate', function($rootScope, $timeout, data, animate, task){
  this.galleryLeftClick = () => {
    $rootScope.currentSlideImgNumber--;
    if($rootScope.currentSlideImgNumber < 0){
      $rootScope.currentSlideImgNumber = $rootScope.viewSlideShow.length - 1;
    }
    this.showBigView(false);
  }
  this.galleryRightClick = () => {
    $rootScope.currentSlideImgNumber++;
    if($rootScope.currentSlideImgNumber === $rootScope.viewSlideShow.length){
      $rootScope.currentSlideImgNumber = 0;
    }
    this.showBigView(false);
  }
  //controls the view of the gallery picture
  this.showBigView = (isFromPage) => {
    if(isFromPage){ $rootScope.currentSlideImgNumber = 0 }
    $rootScope.currentItem = $rootScope.nodeValue;
    if($rootScope.brands === 'sew_products'){ $rootScope.viewSlideShow = sew_products[$rootScope.nodeValue].imgSlideShow; }
    else if($rootScope.brands === 'crochet_products'){ $rootScope.viewSlideShow = crochet_products[$rootScope.nodeValue].imgSlideShow; }
    $rootScope.currentSlideImg = $rootScope.viewSlideShow[$rootScope.currentSlideImgNumber];
    $('.shoppingCartBigView').show();
  }
});

app.directive("tocart", function($rootScope) {
  return {
    template: '<div data={{$index}} disableclick class="addToCartBtn flexRow pointer" ng-click="moveToCart($event, $index)"><p data={{$index}} disableclick class="addToChartText" ng-click="moveToCart($event, $index)">ADD TO CART</p></div>'
  }
});

app.directive("view", function($rootScope) {
  return {
    template: '<div data={{$index}} disableclick class="viewBtn flexRow pointer" ng-click="showBigView($event, $index)"><p data={{$index}} disableclick class="addToChartText" ng-click="showBigView($event, $index)">VIEW GALLERY</p></div>'
  }
});
