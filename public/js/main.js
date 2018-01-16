'use strict';

var app = angular.module('app', []);

app.controller('ctrl', ['$scope', '$rootScope', '$interval', '$timeout', 'backend', 'animate', 'data', 'task', 'navigate', function($scope, $rootScope, $interval, $timeout, backend, animate, data, task, navigate){

  const hiddenNavigationOptions = () => {
    $(".navOptions[data=3]").hide();
    $(".navOptions[data=4]").hide();
  }
  $interval(() => { hiddenNavigationOptions() })
  //optimized processes

  $scope.themeColor;
  $scope.borderThemeColor;
  $scope.customIcon;
  $scope.mainPageIndexes = [1, 2, 3, 4, 5, "loading"];
  $scope.productPageIndexes = [1, 2];
  $scope.navOptions = ['HOME', 'SEW & SO', 'BRANDI', 'DESIGNERS', 'CONTACT', 'CHECKOUT'];
  $scope.filters = data.filters;

  $scope.logIn = (pageIndex) => {
    const themeColorObj = task.setThemeColor(pageIndex);
    $scope.customIcon = task.setCostIcon(pageIndex);
    $scope.themeColor = themeColorObj.themeColor;
    $scope.borderThemeColor = themeColorObj.borderThemeColor;
    $rootScope.pageProducts = data.setPageProducts(pageIndex);
    animate.homeSlider(pageIndex);
    $timeout(() => {
      //navigation highlight
      $(".navOptions").removeClass("navHighlight");
      $(".navOptions[data=" + pageIndex + "]").addClass("navHighlight");
    }, 1000);
  }
  $scope.navigate = (e) => {
    if($rootScope.loadingPage === true){ return null }
    $rootScope.loadingPage = true;
    $timeout(() => { $rootScope.loadingPage = false; }, 2000)

    const pageIndex = parseInt(e.currentTarget.attributes.data.nodeValue);
    if(pageIndex != $rootScope.currentPage){
      if(pageIndex === 0){
        $rootScope.landingPageBtnHoverColor = '#430909';
        $rootScope.landingPageBtnColor = '#ea6262';
        animate.homeSlider(pageIndex);
        $('.movingBoxText').text($scope.navOptions[1]);
        $rootScope.isIntervalInProgress = false;
        $rootScope.onHomePage = true;
        $timeout(() => { animate.landingPage(); }, 2000)
      } else if (pageIndex === 1) {
        animate.slider(pageIndex);
        //variables that change after the slider covers the screen
        $scope.themeColor =  $rootScope.redThemeColor;
        $scope.borderThemeColor = $rootScope.redBorderThemeColor;
        $scope.customIcon = "./images/sewing.png";
        $timeout(() => {
          $rootScope.pageProducts = data.setPageProducts(pageIndex);
        }, 600)
      } else if (pageIndex === 2) {
        animate.slider(pageIndex);
        //variables that change after the slider covers the screen
        $scope.themeColor = $rootScope.blueThemeColor;
        $scope.borderThemeColor = $rootScope.blueBorderThemeColor;
        $scope.customIcon = "./images/crochet.png";
        $timeout(() => {
          $rootScope.pageProducts = data.setPageProducts(pageIndex);
        }, 600)
      } else if (pageIndex === 5) {
        $scope.themeColor =  $rootScope.redThemeColor;
        $scope.borderThemeColor = $rootScope.redBorderThemeColor;
        $scope.customIcon = "./images/shoppingBag.png";
        animate.slider(pageIndex);
        $('.cartItemsHolder').css('maxHeight', '45em');
      } else {
        animate.slider(pageIndex);
        $('.cartItemsHolder').css('maxHeight', '45em');
      }
    }
  }

  //cart moving
  $scope.moveToCart = (e, index, eventObj) => {
    $scope.inLargeView = false;
    $('.customizeDirector').css('opacity', 1);
    $rootScope.trackItems++;
    $rootScope.clickIt = false;
    let nodeValue;
    let indexValue;
    if(eventObj){
      nodeValue = eventObj.nodeValue;
      indexValue = eventObj.indexValue;
    } else {
      nodeValue = e.currentTarget.attributes[0].nodeValue;
      indexValue = index;
    }
    const selector = '.itemImage[data=' + nodeValue + ']';
    debugger
    animate.itemToShoppingCart(selector, nodeValue, indexValue);
  }
  $scope.removeFromCart = (index) => {
    task.removeMultipleFromProductData(index);
    $scope.cartItems.splice(index, 1);
    $scope.checkoutItems.splice(index, 1);
    $rootScope.trackItems--;
  }

  //close view options
  $scope.currentCloseView;
  $scope.closeViewSlides;
  $scope.currentIndex;
  $scope.slidesLength;
  $scope.eventObj = {};
  $scope.closeView = (product, e, index) => {

    const nodeValue = e.currentTarget.attributes[0].nodeValue;
    $scope.eventObj["nodeValue"] = nodeValue;
    $scope.eventObj["indexValue"] = index;

    $(".shoppingCartBigView").fadeIn();
    $scope.closeViewSlides = product.imgSlideShow;
    $scope.currentIndex = 0;
    $scope.slidesLength = product.imgSlideShow.length;
    $scope.currentCloseView = $scope.closeViewSlides[$scope.currentIndex];
  }
  $scope.closeViewRightClick = () => {
    const atLastIndex = (++$scope.currentIndex === $scope.slidesLength)
    $scope.currentIndex = atLastIndex ? 0 : $scope.currentIndex++;
    $scope.currentCloseView = $scope.closeViewSlides[$scope.currentIndex];
  }
  $scope.closeViewLeftClick = () => {
    const atFirstIndex = (--$scope.currentIndex < 0);
    $scope.currentIndex = atFirstIndex ? ($scope.slidesLength - 1) : $scope.currentIndex--;
    $scope.currentCloseView = $scope.closeViewSlides[$scope.currentIndex];
  }

  //cutsome button
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

  //cart quantity
  $scope.incrementCartItem = (item) => {
    task.increment(item);
  }
  $scope.decrementCartItem = (item) => {
    task.decrement(item);
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
  $rootScope.landingPageBtnHoverColor = '#430909';
  $rootScope.landingPageBtnColor = '#ea6262';
  $rootScope.landingPageBtnBorderColor = '#e74b4b';
  $rootScope.themeColorOne = '#ed7d7d';
  $rootScope.themeColorTwo = '#5b94ef';
  $rootScope.loadingPage = false;
  $rootScope.onHomePage = true;

  $rootScope.sew_products;
  $rootScope.crochet_products;
  $rootScope.pageProducts;
  $rootScope.blueThemeColor = "rgb(91, 148, 239)";
  $rootScope.blueBorderThemeColor = "rgb(232, 240, 253)";
  $rootScope.redThemeColor = "rgb(237, 125, 125)";
  $rootScope.redBorderThemeColor = "rgb(252, 233, 233)";
  $rootScope.customSewingIcon = "./images/sewing.png";
  $rootScope.customCrochetIcon = "./images/crochet.png";
  $rootScope.currentPage = 0;
  $rootScope.navOptions = data.navOptions;
  $rootScope.successfullyLoggedIn = false;
  $rootScope.pauseChartAddition = false;
  $rootScope.sew_products;
  $rootScope.crochet_products;

  //need to be reviewed

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
  $scope.hideBigView = () => {
    $scope.inLargeView = false;
    $('.shoppingCartBigView').hide();
    $('.customizeDirector').css('opacity', 1);
  }

  //sign in
  $scope.signUpLandingPageBtn = () => {
    animate.toSignFormPage('signup');
  }
  $scope.signInLandingPageBtn = () => {
    animate.toSignFormPage('signin');
  }
  $scope.signUpButtonOption = () => {
    $('.signFormMessage').fadeOut();
    $rootScope.currentPage = "signup";
    $rootScope.signUp = "signOption";
    $rootScope.signIn = "";
  }
  $scope.signInButtonOption = () => {
    $('.signFormMessage').fadeOut();
    $rootScope.currentPage = "signin";
    $rootScope.signUp = "";
    $rootScope.signIn = "signOption";
  }
  $scope.signUpButton = () => {
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
  $scope.signInButton = () => {
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
      const themeColorObj = task.setThemeColor(1);
      $scope.customIcon = task.setCostIcon(1);
      $scope.themeColor = themeColorObj.themeColor;
      $scope.borderThemeColor = themeColorObj.borderThemeColor;
      $rootScope.pageProducts = data.setPageProducts(1);
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
  $rootScope.currentItem;
  $rootScope.landingPageAnimationInterval;

  //add ids to the cart items => brittanys id start with 1000, brandis 2000, so on
  $rootScope.sew_products = task.assignIDs(sew_products);
  $rootScope.crochet_products = task.assignIDs(crochet_products);

  task.init($scope.themeColor);
  $timeout(() => { animate.landingPage(); })
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

      $rootScope.currentPage = "signin";
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
  this.creditCardSlider = (pageIndex) => {
    //animate slide transition
    $('.homeNavSlider').addClass('transitionLeft').css('left', '0%');
    $timeout(() => {
      //after slide has covered the page..
      $rootScope.currentPage = pageIndex;
      //finish sliding transition
      $('.homeNavSlider').css('left', '-100%');
      $timeout(() => { $('.homeNavSlider').removeClass('transitionLeft').css('left', '100%'); }, 800);
    }, 800);
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
            .css('backgroundImage', 'url(' + $rootScope.pageProducts[nodeValue].img + ')');

      const animation = { left: left, top: top, height: height, width: width }
      const animation2 = { top: inBag, opacity: 0 }
      const complete = () => {
        $clone.css('zIndex', -1);
        $clone.animate(animation2)

        const selectedItem = $rootScope.pageProducts[index];

        //timeout updates the DOM
        $timeout(() => {
          $rootScope.clickable = null;
          if($rootScope.trackItems > data.cartItems.length){
            //check for a cart dupplicate before adding in order to add a time "x" amount instead of I new item in the cart
            if(!$rootScope.pauseChartAddition){
              $rootScope.pauseChartAddition = true;
              $timeout(() => { $rootScope.pauseChartAddition = false }, 3000);
              const isADuplicate = task.checkForCartDuplicate(data.cartItems, selectedItem);
              if(isADuplicate){
                console.log('is duplicate');
              }
              else {
                data.cartItems.splice(0, 0, selectedItem);
                data.checkoutItems.splice(0, 0, selectedItem);
              }
            }
          }
        }, 10);
        $timeout(() => {
          $rootScope.clickIt = true;
        }, 2000);
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
    //set a watch for homepage
    $('.lpBtn').click(() => { $rootScope.onHomePage = false })

    const $movingBox = $('.movingBox');
    const $movingBoxP = $('.movingBoxText');
    $movingBoxP.css('height', '1.4em');
    const animationDuration = 500;
    const intervalDuration = 4500;
    const moveBoxText = ['Sew & So', 'Brandi Logo', 'Sign Up'];
    let moveBoxTextIndex = 0;
    // $('.lpBtn[data=0]').addClass('lpBtnHover');

    $rootScope.landingPageAnimationInterval = $interval(() => {

      //check to see if the interval has finished completing before starting another one
      if($rootScope.isIntervalInProgress){ return false }
      $rootScope.isIntervalInProgress = true;

      //stop animation if not on home page
      if(!$rootScope.onHomePage){
        $interval.cancel($rootScope.landingPageAnimationInterval);
        return null
      }

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
        moveBoxTextIndex++;
        moveBoxTextIndex = (moveBoxTextIndex === moveBoxText.length) ? 0 : moveBoxTextIndex;
        $movingBox.fadeOut(300);
        // $('.lpBtn').removeClass('lpBtnHover');
        // $('.lpBtn[data=' + moveBoxTextIndex + ']').addClass('lpBtnHover');
        $movingBoxP.css('height', '0em');
        $movingBox.removeClass('movingBoxIn').addClass('movingBoxOut');
        $timeout(() => {

          $movingBox.removeClass('movingBoxOut').addClass('movingBoxStart');
          $movingBoxP.text(moveBoxText[moveBoxTextIndex]);
          $timeout(() => {
            $movingBox.fadeIn(750);
            $movingBox.addClass('movingBoxIn');
            $timeout(() => {
              $movingBoxP.css('height', '1.4em');
            }, 200)
          }, 100)
        }, 400);

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
    let pageProducts = (pageIndex === 1) ? $rootScope.sew_products : $rootScope.crochet_products;
    return pageProducts;
  }



  this.navOptions = ['HOME', 'DESIGNERS', 'CONTACT', 'CHECKOUT'],
  this.cartItems = [],
  this.checkoutItems = [],
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
    if(this.cartItems.length > 0){
      let total = 0;
      this.cartItems.map((data) => {
        let multiple = data["multiple"] ? data["multiple"] : 1;
        const sliceString = data.price.slice(1);
        const toInt = parseInt(sliceString)
        total += (toInt * multiple);
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
  this.checkForCartDuplicate = (cartItems, obj) => {
    //if cart is empty return null
    if(cartItems.length === 0){ return false }
    let duplicate = false;
    const id = obj.id;
    cartItems.map((data, index) => {
      if(data.id === id){
        this.increaseDoubleNum(index);
        duplicate = true;
      }
    });
    return duplicate;
  }
  this.increaseDoubleNum = (index) => {
    if(data.cartItems[index]["multiple"]){
      data.cartItems[index]["multiple"]++;
    } else {
      data.cartItems[index]["multiple"] = 2;
    }
  }
  this.removeMultipleFromProductData = (index) => {
    const id = data.cartItems[index]["id"];
    $rootScope.sew_products.map((data, index) => {
      const idsMatch = (data.id === id);
      const hasMultipleField = (data["multiple"] != undefined);
      if(idsMatch && hasMultipleField){
        delete $rootScope.sew_products[index]['multiple'];
      }
    })
    $rootScope.crochet_products.map((data, index) => {
      const idsMatch = (data.id === id);
      const hasMultipleField = (data["multiple"] != undefined);
      if(idsMatch && hasMultipleField){
        delete $rootScope.crochet_products[index]['multiple'];
      }
    })
  }
  this.decrement = (item) => {
    const id = item.id;

    //check sew_products
    $rootScope.sew_products.map((dataValue, index) => {
      const idsMatch = (dataValue.id === id);
      const hasMultipleFieldAndGreaterThanOne = (dataValue["multiple"] != undefined) && (dataValue["multiple"] > 1);
      if(idsMatch){
        if(hasMultipleFieldAndGreaterThanOne){

          $rootScope.sew_products[index]['multiple']--;
          if($rootScope.sew_products[index]['multiple'] === 0){
            data.cartItems.map((dataVal, index, array) => {
              if(dataVal === $rootScope.sew_products[index]){
                //go through each of the products to mach the dataval
                console.log(data.cartItems);
                data.cartItems.splice(index, 1);
                console.log(data.cartItems);
              }
            })
          }

        } else if (!hasMultipleFieldAndGreaterThanOne) {

          data.cartItems.map((dataVal, index) => {
            if(dataVal.id === id){
              const before = data.cartItems;
              data.cartItems.splice(index, 1);
              const after = data.cartItems;
            }
          })

        }

      }
    })

    //check crochet_products
    $rootScope.crochet_products.map((dataValue, index) => {
      const idsMatch = (dataValue.id === id);
      const hasMultipleFieldAndGreaterThanOne = (dataValue["multiple"] != undefined) && (dataValue["multiple"] > 1);
      if(idsMatch){
        if(hasMultipleFieldAndGreaterThanOne){

          $rootScope.crochet_products[index]['multiple']--;
          if($rootScope.crochet_products[index]['multiple'] === 0){
            data.cartItems.map((dataVal, index, array) => {
              if(dataVal === $rootScope.crochet_products[index]){
                //go through each of the products to mach the dataval
                console.log(data.cartItems);
                data.cartItems.splice(index, 1);
                console.log(data.cartItems);
              }
            })
          }

        } else if (!hasMultipleFieldAndGreaterThanOne) {

          data.cartItems.map((dataVal, index) => {
            if(dataVal.id === id){
              const before = data.cartItems;
              data.cartItems.splice(index, 1);
              const after = data.cartItems;
            }
          })

        }

      }
    })

  }
  this.increment = (item) => {
    const id = item.id;

    //check sew_products
    $rootScope.sew_products.map((dataValue, index) => {
      const idsMatch = (dataValue.id === id);
      const hasMultipleField = (dataValue["multiple"] != undefined);
      if(idsMatch){
        if(hasMultipleField){

          $rootScope.sew_products[index]["multiple"]++;


        } else if (!hasMultipleField) {

          $rootScope.sew_products[index]["multiple"] = 2;

        }

      }
    })

    //check crochet_products
    $rootScope.crochet_products.map((dataValue, index) => {
      const idsMatch = (dataValue.id === id);
      const hasMultipleField = (dataValue["multiple"] != undefined);
      if(idsMatch){
        if(hasMultipleField){

          $rootScope.crochet_products[index]["multiple"]++;


        } else if (!hasMultipleField) {

          $rootScope.crochet_products[index]["multiple"] = 2;

        }

      }
    })

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
    if(!$rootScope.pageProducts){ return null }
    const imgLength = $rootScope.pageProducts.length;
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
  this.closeView = () => {

  }
  this.closeViewLeftClick = () => {

  }
  this.closeViewRightClick = () => {

  }
});

app.directive("tocart", function($rootScope) {
  return {
    template: '<div data={{$index}} disableclick class="addToCartBtn flexRow pointer" ng-click="moveToCart($event, $index)"><p data={{$index}} disableclick class="addToChartText" ng-click="moveToCart($event, $index)">ADD TO CART</p></div>'
  }
});

app.directive("view", function($rootScope) {
  return {
    template: '<div data={{$index}} disableclick class="viewBtn flexRow pointer"><p data={{$index}} disableclick class="addToChartText">VIEW GALLERY</p></div>'
  }
});
