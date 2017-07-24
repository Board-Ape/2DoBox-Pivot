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

function CardElements(title, body) {
  this.title = title;
  this.body = body;
  this.id = Date.now();
  this.completed = false;
  this.importance = 2;
};

function storageCheck() {
  var cardArray = [];
  retrieveLocalStorage();
  limitCardList();
  clearInputs();
  //disableShowMore();
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

function upvote() {
  var cardId = $(this).closest('.to-do-card')[0].id;
  var importance = ['None', 'Low', 'Normal','High','Critical']
  cardArray.forEach(function(card) {
    if (card.id == cardId) {
      card.importance++;
      $('.' + cardId).text(importance[card.importance]);
    }
    storeCards();
  })
};

function downvote() {
  var cardId = $(this).closest('.to-do-card')[0].id;
  var importance = ['None', 'Low', 'Normal','High','Critical']
  cardArray.forEach(function(card) {
    if (card.id == cardId) {
      card.importance--;
      $('.' + cardId).text(importance[card.importance]);
    }
    disableUpDownvote();
    storeCards();
  })
};
//Upvote/downvote funtionality and refactoring are there, need to create some type of window to not allow the the buttons to push past a certian value. Also the prepend card reloads a number rather than a string next to importance.

// function disableUpDownvote() {
//   var importance = ['None', 'Low', 'Normal','High','Critical']
//   if (importance === [0]) {
//     $(".#upvote-btn").prop('disabled', 'true');
//   }
// };

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
  console.log("searchCards");
  var search = $(".search-input").val().toUpperCase();
  var results = cardArray.filter(function(elementCard) {
    return elementCard.title.toUpperCase().includes(search) ||
           elementCard.body.toUpperCase().includes(search);
          //  elementCard.importance.toUpperCase().includes(search);
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
      <div class="delete-btn" id="delete"></div>
        <p class="detail-text" contenteditable="true">${buildCard.body}</p>
      </div>
      <div class="ratings">
        <div class="upvote-btn" id="upvote"></div>
        <div class="downvote-btn" id="downvote"></div>
        <p class="importance">importance: <span class="${buildCard.id}">${buildCard.importance}</span></p>
        <button class="completed-task-btn">Completed Task</button>
      </div>
      <hr>
    </article>`);
    //disableShowMore();
};

function taskComplete() {
  console.log("it works")
  var taskID = $(this).closest('.to-do-card')[0].id;
  // var parsedIdea = localStorage.setItem('array', JSON.stringify(cardArray));
  this.completed = true;
  $(this).parent().parent().addClass('grayout');
  storeCards();
}

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


//AMY WORKING ON SHOW MORE CARDS functionality

//this needs to be called each time we build a card into the array, right? so it checks for >10 each time and hides when needed

//im not deleting the from the page, but am deleting them from localstorage - opposite of what i want to do!!

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

$('.show-btn').on('click', showBtn);

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

//total = < 10, diable show more ... button

function disableShowMore() {
  if (cardArray.lenght <= 10) {
    $('.show-btn').attr('disabled', true);
  }
}
//where do i disable the button if there aren't even 10 cards?
