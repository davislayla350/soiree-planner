const guests = [
  { name: 'Mina', status: 'Attending', plusOne: 'Theo' },
  { name: 'Luca', status: 'Regrets', plusOne: 'No' },
  { name: 'Nia', status: 'Attending', plusOne: 'Jules' },
  { name: 'Rafi', status: 'Attending', plusOne: 'Yes' }
];

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
const drinkMenu = document.getElementById('drink-menu');
const countdown = document.getElementById('countdown');
const rsvpForm = document.getElementById('rsvp-form');
const guestNameInput = document.getElementById('guest-name');
const guestStatusInput = document.getElementById('guest-status');
const guestPlusOneInput = document.getElementById('guest-plus-one');

function renderGuests() {
  const attending = guests.filter((guest) => guest.status === 'Attending').length;
  const regrets = guests.length - attending;
  guestSummary.textContent = `${attending} attending / ${regrets} regrets`;

  guestList.replaceChildren();

  guests.forEach((guest) => {
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
    guestList.append(row);
  });
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

  guests.unshift(newGuest);
  renderGuests();
  rsvpForm.reset();
  guestNameInput.focus();
}

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

renderGuests();
renderDrinks();
updateCountdown();
setInterval(updateCountdown, 1000);
