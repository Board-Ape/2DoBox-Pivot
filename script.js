var cardArray = []

$(window).on('load', storageCheck);
$('.idea-card-parent').on('click', '#delete', removeCardFromStorage);
$('.title-input, .body-input').on('keyup', enableSave);
$('.idea-card-parent').on('click', '#upvote', upvote);
$('.idea-card-parent').on('click', '#downvote', downvote);
$('.save-btn').on('click', saveClick);
$('.idea-card-parent').on('blur', 'h2', editCard)
                      .on('blur', '.body-text', editCard);
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
  if (($('.title-input').val() !== "") || ($('.body-input').val() !== "")) {
    $('.save-btn').removeAttr('disabled');
  }
};

function removeCardFromStorage() {
  var currentCardId = $(this).closest('.idea-card')[0].id
  cardArray.forEach(function(card, index) {
    if (currentCardId == card.id) {
      cardArray.splice(index, 1);
    }
  })
  storeCards();
  $(this).parents('.idea-card').remove();
};

function upvote(event) {
  event.preventDefault();
  var cardId = $(this).closest('.idea-card')[0].id
  cardArray.forEach(function(card) {
    if (card.id == cardId) {
      if (card.quality === "swill") {
        card.quality = "plausible";
        $('.' + cardId).text('plausible');
      } else if (card.quality === "plausible") {
        card.quality = "genius"
        $('.' + cardId).text('genius');
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
  var cardId = $(this).closest('.idea-card')[0].id
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
  var id = $(this).closest('.idea-card')[0].id;
  var title = $('h2').text();
  var body = $('.body-text').text();
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
  $('.idea-card-parent').empty();
  for (var i = 0; i < results.length; i++) {
    addCards(results[i]);
  }
};

function addCards(buildCard) {
  $('.idea-card-parent').prepend(
    `<article class="idea-card" id="${buildCard.id}">
      <h2 contenteditable="true">${buildCard.title}</h2>
      <div class="delete-btn" id="delete">
      </div>
      <p class="body-text" contenteditable="true">${buildCard.body}</p>
      <div class="ratings">
      <div class="upvote-btn" id="upvote"></div>
      <div class="downvote-btn" id="downvote"></div>
        <p class="quality">quality: <span class="${buildCard.id}">${buildCard.quality}</span></p>
      </div>
      <hr>
    </article>`);
};

function fireCards() {
  var newCard = new CardElements($('.title-input').val(), $('.body-input').val());
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
  $('.title-input').val('');
  $('.body-input').val('');
  $('title-input').focus();
};

function retrieveLocalStorage() {
  cardArray = JSON.parse(localStorage.getItem('array')) || [];
  cardArray.forEach(function(card) {
    addCards(card);
  })
};
