// Simulate seat data
// Initialize 20 random seats as occupied (true) by default
let seats = new Array(100).fill(false);

function getRandomIndices(count, max) {
  const indices = new Set();
  while (indices.size < count) {
    indices.add(Math.floor(Math.random() * max));
  }
  return Array.from(indices);
}

const defaultOccupiedSeats = getRandomIndices(20, seats.length);
defaultOccupiedSeats.forEach(i => {
  if (i >= 0 && i < seats.length) seats[i] = true;
});

// Auto-refresh availability page
function renderAvailability() {
  const seatContainer = document.getElementById('seatContainer');
  if (seatContainer) {
    seatContainer.innerHTML = '';
    let occupied = 0;

    seats.forEach((status, index) => {
      const seat = document.createElement('div');
      seat.className = 'seat ' + (status ? 'occupied' : 'free');
      seat.title = `Seat ${index + 1}`;
      seatContainer.appendChild(seat);
      if (status) occupied++;
    });

    document.getElementById('freeSeats').textContent = seats.length - occupied;
    document.getElementById('occupiedSeats').textContent = occupied;
  }
}

setInterval(renderAvailability, 5000); // Refresh every 5 seconds
document.addEventListener('DOMContentLoaded', renderAvailability);

// Seat allocation logic
const form = document.getElementById('allocationForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const reg = form.elements['regNumber'].value;
    const lib = form.elements['libraryCode'].value;

    if (!reg || !lib) {
      alert('Please enter both Registration Number and Library Code.');
      return;
    }

    // Show popup instead of alert and redirect
    const popup = document.getElementById('popupOverlay');
    if (popup) {
      popup.style.display = 'flex';
    }
  });
}

// Add event listener for select seat button in popup
const selectSeatBtn = document.getElementById('selectSeatBtn');
if (selectSeatBtn) {
  selectSeatBtn.addEventListener('click', () => {
    // Navigate to view availability page
    window.location.href = 'availability.html';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const seatContainer = document.getElementById('seatContainer');
  if (seatContainer) {
    fetch('/availability')
      .then(res => res.json())
      .then(data => {
        seatContainer.innerHTML = '';
        let occupied = 0;

        let selectedSeatIndex = null; // Track the currently selected seat index

        data.seats.forEach((status, index) => {
          const seat = document.createElement('div');
          seat.className = 'seat ' + (status ? 'occupied' : 'free');
          seat.title = `Seat ${index + 1}`;
          seat.dataset.index = index;

          // Click to allocate if not already occupied
          seat.addEventListener('click', () => {
            // Toggle seat status on click
            if (seat.classList.contains('free')) {
              seat.classList.remove('free');
              seat.classList.add('occupied');
            } else if (seat.classList.contains('occupied')) {
              seat.classList.remove('occupied');
              seat.classList.add('free');
            }
            // Update counts
            const seats = seatContainer.querySelectorAll('.seat');
            let occupiedCount = 0;
            seats.forEach(s => {
              if (s.classList.contains('occupied')) occupiedCount++;
            });
            document.getElementById('occupiedSeats').textContent = occupiedCount;
            document.getElementById('freeSeats').textContent = seats.length - occupiedCount;
          });

          seatContainer.appendChild(seat);
          if (status) occupied++;
        });

        document.getElementById('freeSeats').textContent = data.seats.length - occupied;
        document.getElementById('occupiedSeats').textContent = occupied;
      });
  }
});
