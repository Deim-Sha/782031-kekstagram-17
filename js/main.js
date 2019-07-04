'use strict';

var PHOTOS_NUMBER = 25;
var LIKES_MIN = 15;
var LIKES_MAX = 200;
var COMMENTS_MAX = 10;

var MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var NAMES = ['Артём', 'Лена', 'Саша', 'kot95', 'Wizard', 'killer77'];
var photos = [];

var photosContainer = document.querySelector('.pictures');
var photoTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var createComment = function () {
  return {
    avatar: 'img/avatar-' + getRandomInteger(1, NAMES.length) + '.svg',
    message: getRandomElement(MESSAGES),
    name: getRandomElement(NAMES)
  };
};

var createCommentsArray = function () {
  var commentsArray = [];
  var commentsNumber = getRandomInteger(0, COMMENTS_MAX);

  for (var i = 0; i < commentsNumber; i++) {
    commentsArray.push(createComment());
  }

  return commentsArray;
};

var createPhoto = function (number) {
  return {
    url: 'photos/' + (number + 1) + '.jpg',
    likes: getRandomInteger(LIKES_MIN, LIKES_MAX),
    comments: createCommentsArray()
  };
};

for (var i = 0; i < PHOTOS_NUMBER; i++) {
  photos.push(createPhoto(i));
}

var renderPhoto = function (photo) {
  var photoElement = photoTemplate.cloneNode(true);

  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__likes').textContent = photo.likes;
  photoElement.querySelector('.picture__comments').textContent = photo.comments.length;

  return photoElement;
};

var fragment = document.createDocumentFragment();

for (var j = 0; j < PHOTOS_NUMBER; j++) {
  fragment.appendChild(renderPhoto(photos[j]));
}
photosContainer.appendChild(fragment);

// Показывает и закрывает окно редактирования фотографии
var ESC_KEYCODE = 27;

var photoUploadControl = document.querySelector('#upload-file');
var photoEditor = document.querySelector('.img-upload__overlay');
var photoEditorClose = photoEditor.querySelector('#upload-cancel');
var photoPreview = photoEditor.querySelector('.img-upload__preview');

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var closePopup = function () {
  photoEditor.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
  photoUploadControl.value = '';
  photoPreview.classList.remove('effects__preview--' + currentEffect);
};

photoUploadControl.addEventListener('change', function () {
  photoEditor.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
  scaleValue.value = SCALE_MAX + '%';
  effectsList.querySelector('#effect-none').checked = true;
  effectLevel.classList.add('hidden');
});

photoEditorClose.addEventListener('click', closePopup);

// Изменяет масштаб фотографии
var SCALE_STEP = 25;
var SCALE_MIN = 25;
var SCALE_MAX = 100;
var scaleValue = photoEditor.querySelector('.scale__control--value');
var scaleControlDown = photoEditor.querySelector('.scale__control--smaller');
var scaleControlUp = photoEditor.querySelector('.scale__control--bigger');

scaleControlDown.addEventListener('click', function () {
  var scaleDown = parseInt(scaleValue.value, 10) - SCALE_STEP;

  if (scaleDown < SCALE_MIN) {
    scaleDown = SCALE_MIN;
  }

  scaleValue.value = scaleDown + '%';
  photoPreview.style.transform = 'scale(' + scaleDown / 100 + ')';
});

scaleControlUp.addEventListener('click', function () {
  var scaleUp = parseInt(scaleValue.value, 10) + SCALE_STEP;

  if (scaleUp > SCALE_MAX) {
    scaleUp = SCALE_MAX;
  }

  scaleValue.value = scaleUp + '%';
  photoPreview.style.transform = 'scale(' + scaleUp / 100 + ')';
});

// Накладывает эффект на фотографию
var EFFECT_VALUE_DEFAULT = 100;
var EFFECTS_LEVEL_MAX = {
  chrome: 1,
  sepia: 1,
  marvin: 100,
  phobos: 3,
  heat: 3
};
var FILTERS_DEFAULT = {
  none: '',
  chrome: 'grayscale(1)',
  sepia: 'sepia(1)',
  marvin: 'invert(100%)',
  phobos: 'blur(3px)',
  heat: 'brightness(3)'
};
var effectsList = photoEditor.querySelector('.effects__list');
var effectLevel = photoEditor.querySelector('.effect-level');
var effectLevelValue = effectLevel.querySelector('.effect-level__value');
var effectLevelLine = effectLevel.querySelector('.effect-level__line');
var effectLevelPin = effectLevelLine.querySelector('.effect-level__pin');
var effectLevelDepth = effectLevelLine.querySelector('.effect-level__depth');
var currentEffect = 'none';

effectsList.addEventListener('change', function (evt) {
  photoPreview.classList.remove('effects__preview--' + currentEffect);

  if (evt.target.value === 'none') {
    effectLevel.classList.add('hidden');
  } else {
    effectLevel.classList.remove('hidden');
    photoPreview.classList.add('effects__preview--' + evt.target.value);
    effectLevelValue.value = EFFECT_VALUE_DEFAULT;
    effectLevelPin.style.left = EFFECT_VALUE_DEFAULT + '%';
    effectLevelDepth.style.width = EFFECT_VALUE_DEFAULT + '%';
  }

  currentEffect = evt.target.value;
  photoPreview.style.filter = FILTERS_DEFAULT[currentEffect];
});

// Изменяет уровень эффекта
effectLevelPin.addEventListener('mouseup', function () {
  var value = EFFECTS_LEVEL_MAX[currentEffect] * ((effectLevelPin.offsetLeft / effectLevelLine.clientWidth).toFixed(2));

  switch (currentEffect) {
    case 'chrome':
      photoPreview.style.filter = 'grayscale(' + value + ')';
      break;
    case 'sepia':
      photoPreview.style.filter = 'sepia(' + value + ')';
      break;
    case 'marvin':
      photoPreview.style.filter = 'invert(' + value + '%)';
      break;
    case 'phobos':
      photoPreview.style.filter = 'blur(' + value + 'px)';
      break;
    case 'heat':
      photoPreview.style.filter = 'brightness(' + value + ')';
      break;
  }
});
