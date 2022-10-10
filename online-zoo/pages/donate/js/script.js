/* Burger menu */

const burgerButton = document.querySelector('.nav__burger_button');
const menu = document.querySelector('.nav');
const overlay = document.querySelector('.overlay');

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

/* amount */

const allSums = document.querySelectorAll('input[name="amount"]');
const amountAnother = document.querySelector('.amount__another_input');

allSums.forEach(sum => {
  if (sum.checked) {
    amountAnother.value = sum.value;
  }

  sum.addEventListener('click', () => {
    amountAnother.value = sum.value;
  });
});

amountAnother.addEventListener('change', () => {

  allSums.forEach(sum => {
    if (amountAnother.value.length > 4) {
      amountAnother.value = amountAnother.value.slice(0, 4);
    }

    if (amountAnother.value === sum.value) {
      sum.checked = true;
    } else {
      sum.checked = false;
    }
  });
});