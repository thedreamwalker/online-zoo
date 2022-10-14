/* slider */

const getData = async (url) =>  await (await fetch(url)).json();
const cardsContainer = document.querySelector('.card__list');
const sliderWrapper = document.querySelector('.slider__wrapper');
const buttonPrew = document.querySelector('.card__button_prev');
const buttonNext = document.querySelector('.card__button_next');
let buttonEnable = true;


class Card {
  constructor (img, type, area, predator, id, parent) {
    this.img = img;
    this.type = type;
    this.area = area;
    this.predator = predator;
    this.id = id;
    this.parent = parent;
  }
  
  render() {
    const element = document.createElement('li');
    element.classList.add('card__item');
    let icon;

    if (this.predator) {
      icon = 'card__text_meat';
    } else {
      icon = 'card__text_banana';
    }
    
    element.innerHTML += `
    <div class="card__img"><img src="${this.img}" alt="${this.type}"></div>
    <div class="card__text ${icon}">
      <h3 class="card__title">${this.type}</h3>
      <p>${this.area}</p>
    </div>`;
    this.parent.append(element);
  }
}

class Testimonial {
  constructor (avatar, name, text, id, parent) {
    this.avatar = avatar;
    this.name = name;
    this.text = text;
    this.id = id;
    this.parent = parent;
  }
  
  render() {
    const element = document.createElement('li');
    element.classList.add('testimonials__item');
    element.dataset.id = this.id;
    
    element.innerHTML += `
    <div class="testimonials__head">
      <div class="testimonials__avatar"><img src="${this.avatar}" alt="avatar ${this.name}"></div>
      <div class="testimonials__info">
        <h3 class="testimonials__name">${this.name}</h3>
        <p>Local Austria&nbsp;&nbsp;•&nbsp;&nbsp;Today</p>
      </div>
    </div>
    <div class="testimonials__body">
    ${this.text}
    </div>`;
    this.parent.append(element);
  }
}

const setCards = () => {
  const listSlider = document.createElement('div');
  listSlider.classList.add('slider__list');
  sliderWrapper.append(listSlider);
  const listPrew = document.createElement('ul');
  listPrew.classList.add('card__list', 'card__list_prew');
  listSlider.append(listPrew);
  const listCurr = document.createElement('ul');
  listCurr.classList.add('card__list', 'card__list_curr');
  listSlider.append(listCurr);
  const listNext = document.createElement('ul');
  listNext.classList.add('card__list', 'card__list_next');
  listSlider.append(listNext);

  listSlider.querySelectorAll('.card__list').forEach(li => {
    getData('./js/pets.json')
    .then(data => {
      data.forEach(({img, type, area, predator, id}) => {
        new Card(img, type, area, predator, id, li).render();
      });
    });
  });
};

setCards();

const shuffle = (array) => {

  let newArray = array.slice(0);
  for (let i = newArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
};

const sliderList = document.querySelector('.slider__list');

const changeCards = (parent) => {
  parent.innerHTML = ``;

  getData('./js/pets.json')
    .then(data => {
      const shuffleData = shuffle(data);
      shuffleData.forEach(({img, type, area, predator, id}) => {
        new Card(img, type, area, predator, id, parent).render();
      });
    });
};

const cardsNext = () => {
  const currentList = sliderList.querySelector('.card__list_curr');
  const nextList = sliderList.querySelector('.card__list_next');

  const replacedCurr = sliderList.replaceChild(nextList, currentList);

  sliderList.append(replacedCurr);

  nextList.classList.remove('card__list_next');
  nextList.classList.add('card__list_curr');
  currentList.classList.remove('card__list_curr');
  currentList.classList.add('card__list_next');

  sliderList.classList.remove('slider__to_left');
  sliderList.removeEventListener('animationend', cardsNext);
  buttonEnable = true;
};

const cardsPrew = () => {

  const currentList = sliderList.querySelector('.card__list_curr');
  const prewList = sliderList.querySelector('.card__list_prew');

  const replacedCurr = sliderList.replaceChild(prewList, currentList);

  sliderList.prepend(replacedCurr);

  prewList.classList.remove('card__list_prew');
  prewList.classList.add('card__list_curr');
  currentList.classList.remove('card__list_curr');
  currentList.classList.add('card__list_prew');

  sliderList.classList.remove('slider__to_right');
  sliderList.removeEventListener('animationend', cardsPrew);
  buttonEnable = true;
};

buttonPrew.addEventListener('click', () => {
  if (buttonEnable) {
    buttonEnable = false;
    const listNext = document.querySelector('.card__list_next');

    changeCards(listNext);

    sliderList.classList.add('slider__to_left');

    // почему если в слушателе ниже использовать не отдельную функцию, а в нем самом - будет срабатывать несколько раз?

    sliderList.addEventListener('animationend', cardsNext);
  }
});

buttonNext.addEventListener('click', () => {
  if (buttonEnable) {
    buttonEnable = false;
    const listPrew = document.querySelector('.card__list_prew');

    changeCards(listPrew);

    sliderList.classList.add('slider__to_right');

    // почему если в слушателе ниже использовать не отдельную функцию, а в нем самом - будет срабатывать несколько раз?

    sliderList.addEventListener('animationend', cardsPrew);
  }
});

/* Testimonials */

const testimonialsContainer = document.querySelector('.testimonials__list');
const testimonialsRange = document.querySelector('.testimonials__scroll');

const setTestimonials = () => {
  getData('./js/testimonials.json')
    .then(data => {
      data.forEach(({avatar, name, text, id}) => {
        new Testimonial(avatar, name, text, id, testimonialsContainer).render();
      });
    });
};

setTestimonials();

const changeTestimonials = () => {
  const testimonialsWidth = window.getComputedStyle(testimonialsContainer.querySelector('.testimonials__item')).width;
  
  testimonialsContainer.style.transform = `translateX(-${(Math.ceil(testimonialsWidth.slice(0, testimonialsWidth.length - 2)) + 30) * testimonialsRange.value}px)`;
};

/* Testimonials pop-up*/

const popUp = document.querySelector('.popup');
const popUpItem = popUp.querySelector('.popup__testimonial');
const popUpButton = popUp.querySelector('.popup__close');
const popUpBack = popUp.querySelector('.popup__back');
const overlay = document.querySelector('.overlay');

const testimonialsPopUpOpen = () => {
  popUp.classList.add('active');
  overlay.classList.add('active');
  document.body.classList.add('disable__scroll');
};


const testimonialsPopUpClose = () => {
  popUp.classList.remove('active');
  overlay.classList.remove('active');
  document.body.classList.remove('disable__scroll');
};

testimonialsContainer.addEventListener('click', event => {
  popUpItem.innerHTML = ``;

  const setTestimonial = (number) => {
    getData('./js/testimonials.json')
      .then(data => {
        let [avatar, name, text, id] = [data[number - 1].avatar, data[number - 1].name, data[number - 1].text, data[number - 1].id];

        new Testimonial(avatar, name, text, id, popUpItem).render();
      });
  };

  if (event.target.closest('.testimonials__item') && window.innerWidth < 1000) {
    testimonialsPopUpOpen();
    const id = event.target.closest('.testimonials__item').getAttribute('data-id');

    setTestimonial(id);
  }
});

popUpButton.addEventListener('click', testimonialsPopUpClose);
popUpBack.addEventListener('click', testimonialsPopUpClose);

/* Burger menu */

const burgerButton = document.querySelector('.nav__burger_button');
const menu = document.querySelector('.nav');

const switcherBurgerMenu = () => {
  menu.classList.toggle('active');
  burgerButton.classList.toggle('active');

  if (overlay.classList.contains('active')) {
    overlay.classList.remove('active');
  } else {
    overlay.classList.add('active');
  }
};

burgerButton.addEventListener('click', switcherBurgerMenu);
overlay.addEventListener('click', switcherBurgerMenu);