'use strict';

var app = angular.module('app', []);

app.controller('ctrl', ['$scope', '$rootScope', '$interval', '$timeout', 'animate', 'data', 'task', 'navigate', function($scope, $rootScope, $interval, $timeout, animate, data, task, navigate){

  $scope.name = 'name';
  $scope.inLargeView = false;
  $rootScope.customIcon = './images/sewing.png';
  $rootScope.products = data.products;
  $scope.cartItems = data.cartItems;
  $scope.filters = data.filters;
  $scope.navOptions = data.navOptions;
  $scope.secondPageNavOptions = ['BRANDS', 'BRITTANY', 'BRANDI', 'DESIGNERS', 'CONTACT'];

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
  $scope.moveToCart = (e, index) => {
    $scope.inLargeView = false;
    $('.customizeDirector').css('opacity', 1);
    $rootScope.trackItems++;
    $rootScope.clickIt = false;
    const nodeValue = e.currentTarget.attributes[0].nodeValue;
    const selector = '.itemImage[data=' + nodeValue + ']';
    animate.itemToShoppingCart(selector, nodeValue, index);
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
  $scope.removeFromCart = (index) => {
    $scope.cartItems.splice(index, 1);
    $rootScope.trackItems--;
  }
  $scope.galleryLeftClick = () => {
    navigate.galleryLeftClick();
  }
  $scope.galleryRightClick = () => {
    navigate.galleryRightClick();
  }
  $scope.navigatePage = (e) => {
    const pageClick = e.target.innerText.toLowerCase();
    if(pageClick != $rootScope.currentPage){
      $('.navOptions').css('color', '#000');
      if(pageClick === 'brandi'){ $scope.themeColor = 'rgb(91, 148, 239)' }
      else if(pageClick === 'brittany'){ $scope.themeColor = 'rgb(237, 125, 125)' }
      animate.navigatePage(e, pageClick, $scope.themeColor);
    }
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
  $scope.logIn = (productName) => {
    //insert variable options in navigation bar
    const isBrandsIncludedInNav = $scope.navOptions.includes($rootScope.brittanyPageNavOptionName);
    if(!isBrandsIncludedInNav){
      $scope.navOptions.splice(1, 0, $rootScope.brittanyPageNavOptionName, $rootScope.brandiPageNavOptionName);
    }

    if(productName === 'crochet_products'){ $scope.themeColor = 'rgb(91, 148, 239)' }
    else if(productName === 'sew_products'){ $scope.themeColor = 'rgb(237, 125, 125)' }

    task.setThemeColors(productName);
    data.setProducts(productName);
    animate.logIn($scope.themeColor, productName);
    $rootScope.products = data.products;
    $rootScope.productsSet = true;
  }

  $rootScope.bind = true;
  $rootScope.isIntervalInProgress = false;
  $rootScope.productsSet = false;
  $rootScope.isBriitanyPageClicked = false;
  $rootScope.isBrandiPageClicked = false;
  $rootScope.brittanyPageNavOptionName = 'BRITTANY';
  $rootScope.brandiPageNavOptionName = 'BRANDI';
  $rootScope.currentPage = "landingPage";
  $rootScope.landingPageBtnHoverColor = '#430909';
  $rootScope.landingPageBtnColor = '#ea6262';
  $rootScope.landingPageBtnBorderColor = '#e74b4b';
  $rootScope.themeColor = '#ed7d7d';
  $rootScope.themeColorOne = '#ed7d7d';    //rgb(237, 125, 125)
  $rootScope.themeColorTwo = '#5b94ef';    //rgb(91, 148, 239)
  $rootScope.themeBorderColor = '#fce9e9';
  $rootScope.viewSlideShow = [];
  $rootScope.brands;
  $rootScope.currentSlideImg;
  $rootScope.currentSlideImgNumber = 0;
  $rootScope.cartQuantity = data.getCartLength();
  $rootScope.clickIt = true;
  $rootScope.trackItems = 0;
  $rootScope.dynamicClasses = 'borderRed';
  $rootScope.currentImgEvent;
  $rootScope.currentItem;
  $rootScope.landingPageAnimationInterval;

  task.init($scope.themeColor);
  animate.landingPage();
  animate.customButton();

}]);

app.service('animate', function($rootScope, $timeout, $interval, data, task){
  this.logIn = (themeColor, productName) => {
    $('.homeNavSlider').addClass('transitionLeft').css('left', '0%');
    $timeout(() => {
      this.cancelPageAnimations();
      if(productName === 'crochet_products'){
        $timeout(() => { $('.navOptions[data="2"]').css('color', themeColor); })
        $rootScope.currentPage = $rootScope.brandiPageNavOptionName.toLowerCase();
      }
      else if(productName === 'sew_products'){
        $timeout(() => { $('.navOptions[data="1"]').css('color', themeColor); })
        $rootScope.currentPage = $rootScope.brittanyPageNavOptionName.toLowerCase();
      }
      task.init();
      this.customButton();
      // const thisNav = $('.navOptions');
      // thisNav.css('color', themeColor);
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
  this.navigatePage = (e, pageClick, themeColor) => {
    if(!$rootScope.navigating){
      const isHomePageClicked = pageClick === 'home';
      //chose page transition slide screen
      const selector = isHomePageClicked ? '.homeNavSlider' : '.navSlider';
      //helps pause navigation until animation is done
      $rootScope.navigating = true;

      //used to switch between product pages
      $rootScope.isBriitanyPageClicked = pageClick === $rootScope.brittanyPageNavOptionName.toLowerCase();
      $rootScope.isBrandiPageClicked = pageClick === $rootScope.brandiPageNavOptionName.toLowerCase();
      //set theme colors it product page is clicked
      if ($rootScope.isBriitanyPageClicked) {
        $rootScope.currentPage = "loading";
        //wait for the transition screen to hide the page before changing products
        $timeout(() => {
          task.setThemeColors("sew_products");
          data.setProducts("sew_products");
          $rootScope.currentPage = $rootScope.brittanyPageNavOptionName.toLowerCase();
          $rootScope.products = data.products;
          $rootScope.productsSet = true;
          this.customButton();
        }, 500)
      } else if ($rootScope.isBrandiPageClicked) {
        $rootScope.currentPage = "loading";
        //wait for the transition screen to hide the page before changing products
        $timeout(() => {
          task.setThemeColors("crochet_products");
          data.setProducts("crochet_products");
          $rootScope.currentPage = $rootScope.brandiPageNavOptionName.toLowerCase();
          $rootScope.products = data.products;
          $rootScope.productsSet = true;
          this.customButton();
        }, 500)
      }
      //starts the page tranistion screen
      $(selector).addClass('transitionLeft').css('left', '0%');
      //fires after the transition left to continue page transition
      $timeout(() => {
        if(isHomePageClicked){
          $rootScope.landingPageBtnHoverColor = '#430909';
          $rootScope.landingPageBtnColor = '#ea6262';
          $rootScope.productsSet = false;
          this.landingPage();
          $rootScope.currentPage = 'landingPage';
        }
        else { $rootScope.currentPage = pageClick; }
        if ($rootScope.isBriitanyPageClicked) {
          task.populateImgsOnPage();
        } else if ($rootScope.isBrandiPageClicked) {
          task.populateImgsOnPage();
        } else {
          $('.cartItemsHolder').css('maxHeight', '45em');
        }

        const data = parseInt(e.target.attributes["0"].nodeValue);
        const thisNav = $('.navOptions[data=' + data + ']');
        $('.navOptions').css('color', '#000');
        thisNav.css('color', themeColor);

        $(selector).css('left', '-100%');
        $timeout(() => {
          $rootScope.navigating = false;
          $(selector).removeClass('transitionLeft').css('left', '100%');
        }, 800);
      }, 800);
    }
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
  this.cancelPageAnimations = () => {
    $interval.cancel($rootScope.landingPageAnimationInterval);
  }
});

app.service('data', function($rootScope, $interval, $timeout){
  this.navOptions = ['HOME', 'DESIGNERS', 'CONTACT'],
  this.cartItems = [],
  this.products = sew_products;           // this comes from database.js
  this.setProducts = (productName) => {
    $rootScope.brands = productName;
    this.products = ($rootScope.brands === 'sew_products') ? sew_products : crochet_products;
  }
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
});

app.service('task', function($rootScope, $interval, $timeout, data){
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
  this.setThemeColors = (setThemeColors) => {
    if(setThemeColors === "sew_products"){
      $rootScope.customIcon = './images/sewing.png';
      $rootScope.brands = 'sew_products';
      $rootScope.themeColor = '#ed7d7d';
      $rootScope.themeBorderColor = '#fce9e9';
    } else if(setThemeColors === "crochet_products"){
      $rootScope.customIcon = './images/crochet.png';
      $rootScope.brands = 'crochet_products';
      $rootScope.themeColor = '#5b94ef';
      $rootScope.themeBorderColor = '#e8f0fd';
    }
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
