$(window).on('load', storageCheck);
$('.to-do-card-parent').on('click', '#delete', removeCardFromStorage);
$('.task-input, .detail-input').on('keyup', enableSave);
$('.to-do-card-parent').on('click', '#upvote', upvote);
$('.to-do-card-parent').on('click', '#downvote', downvote);
$('.save-btn').on('click', saveClick);
$('.to-do-card-parent').on('blur', 'h2', editCard)
                       .on('blur', '.detail-text', editCard);
$('.search-input').on('keyup', searchCards);
$('.to-do-card-parent').on('click', '.completed-task-btn', taskComplete);
$('.show-btn').on('click', showBtn);
$('.filter-importance').on('change', filterImportance);

function CardElements(title, body) {
  this.title = title;
  this.body = body;
  this.id = Date.now();
  this.completed = false;
  this.importance = 'normal';
};

function enableSave() {
  if (($('.task-input').val() !== "") || ($('.detail-input').val() !== "")) {
    $('.save-btn').removeAttr('disabled');
  }
};

function saveClick(event) {
  event.preventDefault();
  fireCards();
  $('.save-btn').attr('disabled', 'disabled');
};

function addCards(buildCard) {
  $('.to-do-card-parent').prepend(
    `<article class="to-do-card" id="${buildCard.id}">
      <h2 contenteditable="true">${buildCard.title}</h2>
      <aside class="complete-delete-container">
        <div class="completed-task-btn"></div>
        <div class="delete-btn" id="delete"></div>
      </aside>
        <p class="detail-text" contenteditable="true">${buildCard.body}</p>
      </div>
      <div class="ratings">
        <div class="upvote-btn" id="upvote"></div>
        <div class="downvote-btn" id="downvote"></div>
        <p class="importance">Importance: <span class="${buildCard.id}">${buildCard.importance}</span></p>

    </article>`);
};

function fireCards() {
  var newCard = new CardElements($('.task-input').val(), $('.detail-input').val());
  cardArray.push(newCard)
  addCards(newCard);
  storeCards();
  clearInputs();
  limitCardList();
};

function storeCards() {
  localStorage.setItem('array', JSON.stringify(cardArray));
  clearInputs()
};

function retrieveLocalStorage() {
  cardArray = JSON.parse(localStorage.getItem('array')) || [];
  cardArray.forEach(function(card) {
    addCards(card);
  })
};

function clearInputs() {
  $('.task-input').val('');
  $('.detail-input').val('');
};

function storageCheck() {
  var cardArray = [];
  retrieveLocalStorage();
  limitCardList();
  clearInputs();
};

function upvote() {
  var cardId = $(this).closest('.to-do-card')[0].id;
  var importance = ['none', 'low', 'normal','high','critical']
  cardArray.forEach(function(card) {
    if (card.id == cardId) {
    var currentIndex = importance.indexOf(card.importance);
    currentIndex = (currentIndex !== 4) ? currentIndex + 1 : currentIndex;
    card.importance = importance[currentIndex];
      $('.' + cardId).text(card.importance);
    }
    storeCards();
  })
};

function downvote() {
  var cardId = $(this).closest('.to-do-card')[0].id;
  var importance = ['none', 'low', 'normal','high','critical'];
  cardArray.forEach(function(card) {
    if (card.id == cardId) {
      var currentIndex = importance.indexOf(card.importance);
      currentIndex = (currentIndex !== 0) ? currentIndex - 1 : currentIndex;
      card.importance = importance[currentIndex];
      $('.' + cardId).text(card.importance);
      }
      storeCards();
    })
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
  console.log("searchCards");
  var search = $(".search-input").val().toUpperCase();
  var results = cardArray.filter(function(elementCard) {
    return elementCard.title.toUpperCase().includes(search) ||
           elementCard.body.toUpperCase().includes(search);
  });
  addCardsBack(results);
};

function filterImportance(event) {
  var selectedImportance = event.target.value;
  var results;
  if (selectedImportance === 'all') {
    results = cardArray.slice();
  } else {
  results = cardArray.filter(function(elementCard) {
    return elementCard.importance === selectedImportance;
    });
  }
    addCardsBack(results);
}

function addCardsBack(results) {
  $('.to-do-card-parent').empty();
  results.forEach(function(card) {
    addCards(card);
  });
}

// We now need the class to persist!
// Loop through the array similar to the upvote/donwvote, look for a matching card in localStorage
// Once you have that card you can change the object .thatCompleted
// Put back into localStorage
function taskComplete() {
  console.log("it works")
  var cardId = $(this).closest('.to-do-card')[0].id;
  console.log(this);
  cardArray.forEach(function(card) {
  if (card.id == cardId) {
    console.log("task complete", card);
    card.completed = true;
    }
  });
  $(this).parent().parent().addClass('grayout');
  storeCards();
}

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

//SHOW MORE/LESS FUNCTIONALITY
function limitCardList(card) {
  var splicedCards  = [];
  if(cardArray.length > 10) {
    splicedCards = cardArray.splice(0, cardArray.length - 10);
    $('.to-do-card-parent').empty();
    for (var i = 0; i < cardArray.length; i++) {
      addCards(cardArray[i]);
    }
  }
  return splicedCards;
}

function showBtn() {
  $('.to-do-card-parent').empty();
  toggleBtnText();
}

function toggleBtnText() {
  var $showBtn = $('.show-btn');
  if ($showBtn.text() === 'Show more...') {
    $showBtn.text('Show less...');
    retrieveLocalStorage();
  } else {
    $showBtn.text('Show more...');
    $('.to-do-card-parent').empty();
    limitCardList();
  }
}

function disableShowMore() {
  if (cardArray.length <= 10) {
    $('.show-btn').attr('disabled', true);
  }
}
