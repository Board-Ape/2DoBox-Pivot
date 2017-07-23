var cardArray = []

$(window).on('load', storageCheck);
$('.to-do-card-parent').on('click', '#delete', removeCardFromStorage);
$('.task-input, .detail-input').on('keyup', enableSave);
$('.to-do-card-parent').on('click', '#upvote', upvote);
$('.to-do-card-parent').on('click', '#downvote', downvote);
$('.save-btn').on('click', saveClick);
$('.to-do-card-parent').on('blur', 'h2', editCard)
                      .on('blur', '.detail-text', editCard);
$('.search-input').on('keyup', searchCards);

function CardElements(title, body) {
  this.title = title;
  this.body = body;
  this.id = Date.now();
  this.quality = 'swill';
};

function storageCheck() {
  retrieveLocalStorage();
  clearInputs();
};

function enableSave() {
  if (($('.task-input').val() !== "") || ($('.detail-input').val() !== "")) {
    $('.save-btn').removeAttr('disabled');
  }
};

function removeCardFromStorage() {
  var currentCardId = $(this).closest('.to-do-card')[0].id
  cardArray.forEach(function(card, index) {
    if (currentCardId == card.id) {
      cardArray.splice(index, 1);
    }
  })
  storeCards();
  $(this).parents('.to-do-card').remove();
};

// This functionality is not working because it doesn't recognize what id is defined as when you split the function even if you have the forEach Loop nested inside both....

// function upvote() {
//   var cardId = $(this).closest('.idea-card')[0].id
//   cardArray.forEach(function(card) {
//     if (card.id == cardId) {
//       upvoteConditions();
//     }
//     storeCards();
//   })
// };
//
// function upvoteConditions() {
//   var cardId = $(this).closest('.idea-card')[0].id
//   cardArray.forEach(function(card) {
//     if (card.quality === "swill") {
//       card.quality = "plausible";
//       $('.' + cardId).text('plausible');
//     } else {
//       card.quality = "genius";
//       $('.' + cardId).text('genius');
//    }
//   })
// };


// Functionality is at 100% with this reduced function
// The trick will be removing the nested if statement without running into the same problems as above
function upvote() {
  var cardId = $(this).closest('.to-do-card')[0].id
  cardArray.forEach(function(card) {
    if (card.id == cardId) {
      if (card.quality === "swill") {
        card.quality = "plausible";
        $('.' + cardId).text('plausible');
      } else {
        card.quality = "genius"
        $('.' + cardId).text('genius');
      }
    }
    storeCards();
  })
};

function downvote(event) {
  event.preventDefault();
  var cardId = $(this).closest('.to-do-card')[0].id
  cardArray.forEach(function (card) {
    if (card.id == cardId) {
      if (card.quality === 'genius') {
        card.quality = 'plausible';
        $('.' + cardId).text('plausible');
      } else if (card.quality === 'plausible') {
        card.quality = 'swill'
        $('.' + cardId).text('swill');
      } else {
        card.quality = 'swill'
        $('.' + cardId).text('swill');
      }
    }
  storeCards();
  })
};

function saveClick(event) {
  event.preventDefault();
  fireCards();
  $('.save-btn').attr('disabled', 'disabled');
};

function editCard() {
  var id = $(this).closest('.to-do-card')[0].id;
  var title = $('h2').text();
  var body = $('.detail-text').text();
  cardArray.forEach(function(card) {
    if (card.id == id) {
      card.title = title;
      card.body = body;
    }
  })
  storeCards();
};

function searchCards() {
  var search = $(this).val().toUpperCase();
  var results = cardArray.filter(function(elementCard) {
    return elementCard.title.toUpperCase().includes(search) ||
           elementCard.body.toUpperCase().includes(search) ||
           elementCard.quality.toUpperCase().includes(search);
  });
  $('.to-do-card-parent').empty();
  for (var i = 0; i < results.length; i++) {
    addCards(results[i]);
  }
};

function addCards(buildCard) {
  $('.to-do-card-parent').prepend(
    `<article class="to-do-card" id="${buildCard.id}">
      <h2 contenteditable="true">${buildCard.title}</h2>
      <div class="delete-btn" id="delete">
      </div>
      <p class="detail-text" contenteditable="true">${buildCard.body}</p>
      <div class="ratings">
      <div class="upvote-btn" id="upvote"></div>
      <div class="downvote-btn" id="downvote"></div>
        <p class="quality">quality: <span class="${buildCard.id}">${buildCard.quality}</span></p>
      </div>
      <hr>
    </article>`);
};

function fireCards() {
  var newCard = new CardElements($('.task-input').val(), $('.detail-input').val());
  cardArray.push(newCard)
  addCards(newCard);
  storeCards();
  clearInputs();
};

function storeCards() {
  localStorage.setItem('array', JSON.stringify(cardArray));
  clearInputs()
};

function clearInputs() {
  $('.task-input').val('');
  $('.detail-input').val('');
  $('.task-input').focus();
};

function retrieveLocalStorage() {
  cardArray = JSON.parse(localStorage.getItem('array')) || [];
  cardArray.forEach(function(card) {
    addCards(card);
  })
};
