const GUEST_CAP = 120;

const guests = [
  { name: 'Mina', status: 'Attending', plusOne: 'Theo' },
  { name: 'Luca', status: 'Regrets', plusOne: 'No' },
  { name: 'Nia', status: 'Attending', plusOne: 'Jules' },
  { name: 'Rafi', status: 'Attending', plusOne: 'Yes' }
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
const waitlistSection = document.getElementById('waitlist-section');
const waitlistSummary = document.getElementById('waitlist-summary');
const waitlistList = document.getElementById('waitlist-list');
const drinkMenu = document.getElementById('drink-menu');
const countdown = document.getElementById('countdown');
const rsvpForm = document.getElementById('rsvp-form');
const guestNameInput = document.getElementById('guest-name');
const guestStatusInput = document.getElementById('guest-status');
const guestPlusOneInput = document.getElementById('guest-plus-one');

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

  meta.append(status, plusOne);
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
}

function handleSubmit(event) {
  event.preventDefault();

  const newGuest = {
    name: guestNameInput.value.trim(),
    status: guestStatusInput.value,
    plusOne: guestPlusOneInput.value.trim()
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
