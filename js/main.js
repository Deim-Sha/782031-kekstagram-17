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
