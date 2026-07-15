const GUEST_CAP = 120;
const DIETS = [
  { value: 'none', label: 'None' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-free' }
];

const guests = [
  { name: 'Mina', status: 'Attending', plusOne: 'Theo', diet: 'vegetarian', plusOneDiet: 'none' },
  { name: 'Luca', status: 'Regrets', plusOne: 'No', diet: 'none', plusOneDiet: 'none' },
  { name: 'Nia', status: 'Attending', plusOne: 'Jules', diet: 'vegan', plusOneDiet: 'vegetarian' },
  { name: 'Rafi', status: 'Attending', plusOne: 'Yes', diet: 'gluten-free', plusOneDiet: 'gluten-free' }
];

const waitlist = [];

const drinks = [
  {
    night: 'Night 1',
    name: 'Golden Hour Spritz',
    description: 'Citrus, elderflower, and a glowing splash of prosecco.'
  },
  {
    night: 'Night 2',
    name: 'Moonlit Basil Smash',
    description: 'Gin, basil, lime, and a little midnight sparkle.'
  },
  {
    night: 'Night 3',
    name: 'Starlight Fizz',
    description: 'A silky berry tonic with a whisper of rosemary.'
  }
];

const openingNight = new Date('2026-08-21T19:00:00');
const guestList = document.getElementById('guest-list');
const guestSummary = document.getElementById('guest-summary');
const dietSummary = document.getElementById('diet-summary');
const waitlistSection = document.getElementById('waitlist-section');
const waitlistSummary = document.getElementById('waitlist-summary');
const waitlistList = document.getElementById('waitlist-list');
const drinkMenu = document.getElementById('drink-menu');
const countdown = document.getElementById('countdown');
const rsvpForm = document.getElementById('rsvp-form');
const guestNameInput = document.getElementById('guest-name');
const guestStatusInput = document.getElementById('guest-status');
const guestPlusOneInput = document.getElementById('guest-plus-one');
const guestDietInput = document.getElementById('guest-diet');
const guestPlusOneDietInput = document.getElementById('guest-plus-one-diet');

function getDietOption(value) {
  return DIETS.find((diet) => diet.value === value) || DIETS[0];
}

function hasPlusOne(guest) {
  return guest.plusOne && guest.plusOne.toLowerCase() !== 'no';
}

function getPartySize(guest) {
  return guest.status === 'Attending' ? 1 + Number(hasPlusOne(guest)) : 0;
}

function getConfirmedGuestCount() {
  return guests.reduce((total, guest) => total + getPartySize(guest), 0);
}

function createGuestRow(guest) {
  const row = document.createElement('div');
  row.className = 'guest-row';

  const name = document.createElement('div');
  name.className = 'guest-name';
  name.textContent = guest.name;

  const meta = document.createElement('div');
  meta.className = 'guest-meta';

  const status = document.createElement('span');
  status.className = `badge status ${guest.status.toLowerCase()}`;
  status.textContent = guest.status;

  const plusOne = document.createElement('span');
  plusOne.className = 'badge plus-one';
  plusOne.textContent = `Plus-one: ${guest.plusOne || 'No'}`;

  const diet = getDietOption(guest.diet);
  const dietBadge = document.createElement('span');
  dietBadge.className = `badge diet ${diet.value}`;
  dietBadge.textContent = `Diet: ${diet.label}`;

  meta.append(status, plusOne, dietBadge);

  if (hasPlusOne(guest)) {
    const plusOneDiet = getDietOption(guest.plusOneDiet);
    const plusOneDietBadge = document.createElement('span');
    plusOneDietBadge.className = `badge diet ${plusOneDiet.value}`;
    plusOneDietBadge.textContent = `Plus-one diet: ${plusOneDiet.label}`;
    meta.append(plusOneDietBadge);
  }

  row.append(name, meta);

  return row;
}

function renderGuestRows(list, container) {
  container.replaceChildren();
  list.forEach((guest) => {
    container.append(createGuestRow(guest));
  });
}

function renderRsvps() {
  const confirmedGuestCount = getConfirmedGuestCount();
  const spotsRemaining = GUEST_CAP - confirmedGuestCount;
  const attending = guests.filter((guest) => guest.status === 'Attending').length;
  const regrets = guests.length - attending;

  guestSummary.textContent = `${confirmedGuestCount}/${GUEST_CAP} confirmed guests including plus-ones - ${spotsRemaining} spots remaining - ${attending} attending RSVPs / ${regrets} regrets`;
  renderGuestRows(guests, guestList);

  waitlistSection.hidden = waitlist.length === 0;
  waitlistSummary.textContent = `${waitlist.length} waitlisted RSVP${waitlist.length === 1 ? '' : 's'} in signup order`;
  renderGuestRows(waitlist, waitlistList);
  renderDietSummary();
}

function renderDietSummary() {
  const counts = DIETS.reduce((summary, diet) => {
    summary[diet.value] = 0;
    return summary;
  }, {});

  guests
    .filter((guest) => guest.status === 'Attending')
    .forEach((guest) => {
      counts[getDietOption(guest.diet).value] += 1;
      if (hasPlusOne(guest)) {
        counts[getDietOption(guest.plusOneDiet).value] += 1;
      }
    });

  dietSummary.replaceChildren();
  DIETS.forEach((diet) => {
    const item = document.createElement('div');
    item.className = `diet-count ${diet.value}`;

    const label = document.createElement('span');
    label.textContent = diet.label;

    const count = document.createElement('strong');
    count.textContent = counts[diet.value];

    item.append(label, count);
    dietSummary.append(item);
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const newGuest = {
    name: guestNameInput.value.trim(),
    status: guestStatusInput.value,
    plusOne: guestPlusOneInput.value.trim(),
    diet: guestDietInput.value,
    plusOneDiet: guestPlusOneDietInput.value
  };

  if (!newGuest.name) {
    return;
  }

  if (newGuest.status === 'Attending' && getConfirmedGuestCount() + getPartySize(newGuest) > GUEST_CAP) {
    newGuest.status = 'Waitlisted';
    waitlist.push(newGuest);
  } else {
    guests.unshift(newGuest);
  }

  renderRsvps();
  rsvpForm.reset();
  guestNameInput.focus();
}

rsvpForm.addEventListener('reset', () => {
  guestNameInput.focus();
});

function renderDrinks() {
  drinkMenu.innerHTML = drinks
    .map(
      (drink) => `
        <article class="drink-card">
          <h3>${drink.night} • ${drink.name}</h3>
          <p>${drink.description}</p>
        </article>
      `
    )
    .join('');
}

function updateCountdown() {
  const now = new Date();
  const difference = openingNight - now;

  if (difference <= 0) {
    countdown.innerHTML = '<span>Golden hour</span><span>is here</span>';
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  countdown.innerHTML = `
    <span>${days}d</span>
    <span>${hours}h</span>
    <span>${minutes}m</span>
    <span>${seconds}s</span>
  `;
}

rsvpForm.addEventListener('submit', handleSubmit);

renderRsvps();
renderDrinks();
updateCountdown();
setInterval(updateCountdown, 1000);
