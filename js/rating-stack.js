(function () {
  var positions = [
    { x: '-18px', y: '-10px', rotate: '-2.5deg' },
    { x: '18px', y: '8px', rotate: '2deg' },
    { x: '-6px', y: '18px', rotate: '-1deg' },
    { x: '24px', y: '-14px', rotate: '1.5deg' },
    { x: '-24px', y: '12px', rotate: '-1.8deg' },
    { x: '8px', y: '-22px', rotate: '2.4deg' },
    { x: '-14px', y: '22px', rotate: '-2.2deg' },
    { x: '26px', y: '18px', rotate: '1deg' },
    { x: '-28px', y: '-18px', rotate: '-1.2deg' },
    { x: '12px', y: '24px', rotate: '2.8deg' }
  ];

  function nameFromFile(file) {
    return file.replace(/\.[^.]+$/, '');
  }

  function imagePath(directory, file) {
    return directory.replace(/\/$/, '') + '/' + encodeURIComponent(file);
  }

  function readStackConfig(stack) {
    if (stack._ratingStackConfig) {
      return stack._ratingStackConfig;
    }

    var data = stack.querySelector('.rating-stack-data');

    if (data) {
      try {
        stack._ratingStackConfig = JSON.parse(data.textContent);
        return stack._ratingStackConfig;
      } catch (error) {
        if (window.console && typeof window.console.error === 'function') {
          window.console.error('Invalid rating stack data', error);
        }

        return null;
      }
    }

    stack._ratingStackConfig = {
      directory: stack.getAttribute('data-directory') || '',
      altPrefix: stack.getAttribute('data-alt-prefix') || '',
      files: (stack.getAttribute('data-files') || '').split('|').filter(Boolean)
    };

    return stack._ratingStackConfig;
  }

  function normalizeItem(item) {
    if (typeof item === 'string') {
      return { file: item };
    }

    return item;
  }

  function buildStack(stack) {
    var config = readStackConfig(stack);
    var files = config && Array.isArray(config.files) ? config.files.map(normalizeItem) : [];
    var altPrefix = config && config.altPrefix ? config.altPrefix : '';

    if (stack._ratingStackInitialized) {
      return Array.prototype.slice.call(stack.querySelectorAll('.rating-card'));
    }

    stack.innerHTML = '';

    return files.map(function (item, index) {
      var file = item.file || item.src;
      var position = positions[index % positions.length];
      var card = document.createElement('div');
      var image = document.createElement('img');

      card.className = 'rating-card';
      card.style.setProperty('--z', files.length - index);
      card.style.setProperty('--x', position.x);
      card.style.setProperty('--y', position.y);
      card.style.setProperty('--rotate', position.rotate);

      image.src = imagePath(config.directory, file);
      image.alt = item.alt || altPrefix + nameFromFile(file);

      card.appendChild(image);
      stack.appendChild(card);

      return card;
    });
  }

  function itemLabel(stack, remaining) {
    var label = stack.getAttribute('data-item-label') || 'item';

    return label + (remaining === 1 ? '' : 's');
  }

  function updateStatus(stack, status, cards) {
    var remaining = cards.filter(function (card) {
      return !card.classList.contains('is-hidden');
    }).length;

    status.textContent = remaining > 0
      ? remaining + ' ' + itemLabel(stack, remaining) + ' left. Click the pile to reveal the next one.'
      : 'All ' + itemLabel(stack, 2) + ' shown. Click once more to reset.';
  }

  function resetStack(stack) {
    var cards = Array.prototype.slice.call(stack.querySelectorAll('.rating-card'));
    var slide = stack.closest ? stack.closest('.rating-stack-slide') : stack.parentNode;
    var status = slide ? slide.querySelector('.rating-stack-status') : null;

    cards.forEach(function (card) {
      card.classList.remove('is-hidden');
    });

    if (status) {
      updateStatus(stack, status, cards);
    }
  }

  window.initializeRatingStacks = function () {
    var stacks = Array.prototype.slice.call(document.querySelectorAll('.rating-stack'));

    stacks.forEach(function (stack) {
      var slide = stack.closest ? stack.closest('.rating-stack-slide') : stack.parentNode;
      var status = slide ? slide.querySelector('.rating-stack-status') : null;
      var cards = buildStack(stack);

      if (!status || cards.length === 0) {
        return;
      }

      if (stack._ratingStackInitialized) {
        updateStatus(stack, status, cards);
        return;
      }

      stack.addEventListener('click', function () {
        var topCard = null;

        for (var index = 0; index < cards.length; index++) {
          if (!cards[index].classList.contains('is-hidden')) {
            topCard = cards[index];
            break;
          }
        }

        if (topCard) {
          topCard.classList.add('is-hidden');
        } else {
          cards.forEach(function (card) {
            card.classList.remove('is-hidden');
          });
        }

        updateStatus(stack, status, cards);
      });

      updateStatus(stack, status, cards);
      stack._ratingStackInitialized = true;
    });

    if (window.Reveal && typeof Reveal.addEventListener === 'function') {
      Reveal.addEventListener('slidechanged', function (event) {
        if (event.currentSlide && event.currentSlide.classList.contains('rating-stack-slide')) {
          Array.prototype.slice.call(event.currentSlide.querySelectorAll('.rating-stack')).forEach(resetStack);
        }
      });
    }
  };
}());
